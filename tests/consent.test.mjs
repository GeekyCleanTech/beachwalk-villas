import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_VERSION,
  cookieDomainCandidates,
  hasGlobalPrivacyControl,
  isAnalyticsCookie,
  isClarityCookie,
  isGoogleAnalyticsCookie,
  makeConsent,
  parseConsent,
  toGoogleConsent,
} from "../src/lib/consent.ts";

const NOW = 1_800_000_000_000;

test("round-trips a stored choice", () => {
  const stored = JSON.stringify(makeConsent(true, "user", NOW));
  const parsed = parseConsent(stored, NOW + 1000);
  assert.equal(parsed?.analytics, true);
  assert.equal(parsed?.necessary, true);
  assert.equal(parsed?.source, "user");
});

test("missing, malformed, or wrong-shape values mean 'ask again'", () => {
  assert.equal(parseConsent(null, NOW), null);
  assert.equal(parseConsent("", NOW), null);
  assert.equal(parseConsent("not json", NOW), null);
  assert.equal(parseConsent("123", NOW), null);
  assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION, analytics: "yes", timestamp: NOW }), NOW), null);
  assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION, analytics: true }), NOW), null);
});

test("older policy versions and expired choices are re-asked", () => {
  const old = { ...makeConsent(true, "user", NOW), version: CONSENT_VERSION - 1 };
  assert.equal(parseConsent(JSON.stringify(old), NOW), null);

  const stored = JSON.stringify(makeConsent(true, "user", NOW));
  assert.notEqual(parseConsent(stored, NOW + CONSENT_MAX_AGE_MS), null);
  assert.equal(parseConsent(stored, NOW + CONSENT_MAX_AGE_MS + 1), null);
});

test("a timestamp from the future is rejected", () => {
  const future = JSON.stringify(makeConsent(true, "user", NOW + 3_600_000));
  assert.equal(parseConsent(future, NOW), null);
});

test("Google Consent Mode: ads always denied, analytics follows the choice", () => {
  const none = toGoogleConsent(null);
  assert.equal(none.analytics_storage, "denied");

  const rejected = toGoogleConsent(makeConsent(false, "user", NOW));
  assert.equal(rejected.analytics_storage, "denied");

  const accepted = toGoogleConsent(makeConsent(true, "user", NOW));
  assert.equal(accepted.analytics_storage, "granted");
  for (const params of [none, rejected, accepted]) {
    assert.equal(params.ad_storage, "denied");
    assert.equal(params.ad_user_data, "denied");
    assert.equal(params.ad_personalization, "denied");
    assert.equal(params.security_storage, "granted");
  }
});

test("Global Privacy Control is only honored when exactly true", () => {
  assert.equal(hasGlobalPrivacyControl({ globalPrivacyControl: true }), true);
  assert.equal(hasGlobalPrivacyControl({ globalPrivacyControl: false }), false);
  assert.equal(hasGlobalPrivacyControl({}), false);
  assert.equal(hasGlobalPrivacyControl(undefined), false);
});

test("only Google Analytics cookies are recognised for cleanup", () => {
  for (const name of ["_ga", "_gid", "_gat", "_gat_gtag_G_ABC", "_ga_ABC123XYZ"]) {
    assert.equal(isGoogleAnalyticsCookie(name), true, name);
  }
  for (const name of ["bwv_consent_v1", "session", "ga", "_gaming"]) {
    assert.equal(isGoogleAnalyticsCookie(name), false, name);
  }
});

test("Clarity cookies are recognised and included in analytics cleanup", () => {
  assert.equal(isClarityCookie("_clck"), true);
  assert.equal(isClarityCookie("_clsk"), true);
  assert.equal(isClarityCookie("_clock"), false);
  for (const name of ["_ga", "_ga_ABC", "_clck", "_clsk"]) assert.equal(isAnalyticsCookie(name), true, name);
  for (const name of ["bwv_consent_v1", "keep"]) assert.equal(isAnalyticsCookie(name), false, name);
});

test("cookie domain candidates cover host and parents, never a bare TLD", () => {
  assert.deepEqual(cookieDomainCandidates("www.beachwalkvillas.net"), [
    "www.beachwalkvillas.net",
    "beachwalkvillas.net",
  ]);
  assert.deepEqual(cookieDomainCandidates("beachwalkvillas.net"), ["beachwalkvillas.net"]);
  assert.deepEqual(cookieDomainCandidates("localhost"), []);
});
