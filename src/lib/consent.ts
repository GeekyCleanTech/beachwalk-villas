// src/lib/consent.ts — pure consent-state helpers (no DOM access) so they can
// be unit tested with `node --test`. The banner component wires them to the
// browser: localStorage, Google Consent Mode v2 and the GTM loader.

export const CONSENT_STORAGE_KEY = "bwv_consent_v1";
export const CONSENT_VERSION = 1;
/** Re-ask after 12 months so a stale choice does not live forever. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentChoice {
  /** Always true — strictly necessary storage needs no consent. Recorded for clarity. */
  necessary: true;
  /** Analytics: Google Analytics 4 (via Google Tag Manager) and Microsoft Clarity. */
  analytics: boolean;
  /** Epoch milliseconds when the visitor made the choice. */
  timestamp: number;
  version: typeof CONSENT_VERSION;
  /** "user" = clicked a button; "gpc" = Global Privacy Control signal honored. */
  source: "user" | "gpc";
}

/**
 * Parse a stored value. Returns null (= ask again) for anything missing,
 * malformed, from an older policy version, or older than 12 months.
 */
export function parseConsent(
  raw: string | null | undefined,
  now: number = Date.now(),
): ConsentChoice | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.version !== CONSENT_VERSION) return null;
  if (typeof d.analytics !== "boolean") return null;
  if (typeof d.timestamp !== "number" || !Number.isFinite(d.timestamp)) return null;
  if (d.timestamp > now + 60_000) return null; // clock skew / tampering
  if (now - d.timestamp > CONSENT_MAX_AGE_MS) return null;
  return {
    necessary: true,
    analytics: d.analytics,
    timestamp: d.timestamp,
    version: CONSENT_VERSION,
    source: d.source === "gpc" ? "gpc" : "user",
  };
}

export function makeConsent(
  analytics: boolean,
  source: ConsentChoice["source"] = "user",
  now: number = Date.now(),
): ConsentChoice {
  return {
    necessary: true,
    analytics,
    timestamp: now,
    version: CONSENT_VERSION,
    source,
  };
}

export type GoogleConsentState = "granted" | "denied";

export interface GoogleConsentParams {
  ad_storage: GoogleConsentState;
  ad_user_data: GoogleConsentState;
  ad_personalization: GoogleConsentState;
  analytics_storage: GoogleConsentState;
  functionality_storage: GoogleConsentState;
  personalization_storage: GoogleConsentState;
  security_storage: GoogleConsentState;
}

/**
 * Map a choice onto Google Consent Mode v2 signals. This site runs GA4 only,
 * so advertising signals are denied unconditionally.
 */
export function toGoogleConsent(choice: ConsentChoice | null): GoogleConsentParams {
  const analytics: GoogleConsentState = choice?.analytics ? "granted" : "denied";
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analytics,
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  };
}

/** True when the browser sends a Global Privacy Control opt-out signal. */
export function hasGlobalPrivacyControl(nav: { globalPrivacyControl?: boolean } | undefined): boolean {
  return nav?.globalPrivacyControl === true;
}

/** Google Analytics cookie names: `_ga`, `_gid`, `_gat*`, and `_ga_<container>`. */
export function isGoogleAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name === "_gid" || name.startsWith("_gat") || name.startsWith("_ga_");
}

/** Microsoft Clarity first-party cookies: `_clck` (user) and `_clsk` (session). */
export function isClarityCookie(name: string): boolean {
  return name === "_clck" || name === "_clsk";
}

/** Any cookie set by the analytics tools this site loads after consent. */
export function isAnalyticsCookie(name: string): boolean {
  return isGoogleAnalyticsCookie(name) || isClarityCookie(name);
}

/** Hostnames to try when expiring a cookie: the host itself and each parent domain. */
export function cookieDomainCandidates(hostname: string): string[] {
  const parts = hostname.split(".").filter(Boolean);
  const out: string[] = [];
  // Skip single-label hosts (localhost) and never emit a bare TLD.
  for (let i = 0; i <= parts.length - 2; i++) {
    out.push(parts.slice(i).join("."));
  }
  return out;
}
