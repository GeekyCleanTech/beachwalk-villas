import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  CONTACT_RECIPIENT,
  MAILTO_MAX_ENCODED_LENGTH,
  prepareEmailDraft,
} from "../src/lib/contact-draft.ts";

const base = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "",
  villa: "",
  checkin: "",
  checkout: "",
  guests: "2",
  message: "Could you help us plan our stay?",
};

function prepare(changes = {}) {
  const result = prepareEmailDraft({ ...base, ...changes });
  assert.equal(result.ok, true, JSON.stringify(result));
  return result;
}

test("draft uses the reservations recipient, both names, guest count, and explicit missing details", () => {
  const { draft } = prepare();
  assert.equal(draft.recipient, "reservations@beachwalkvillas.net");
  assert.equal(CONTACT_RECIPIENT, draft.recipient);
  assert.equal(draft.subject, "Beachwalk Villas inquiry — 2 guests");
  assert.equal(draft.body, [
    "Hello Beachwalk Villas team,", "", base.message, "", "Inquiry details:",
    "Name: Jane Smith", "Contact email: jane@example.com", "Phone: Not provided",
    "Villa of interest: Not selected", "Check-in: Not provided", "Check-out: Not provided",
    "Guests: 2", "", "Thank you,", "Jane Smith",
  ].join("\n"));
});

test("required fields reject whitespace; contact email rejects invalid syntax", () => {
  for (const field of ["firstName", "lastName", "email", "guests", "message"]) {
    const result = prepareEmailDraft({ ...base, [field]: " \t\n " });
    assert.equal(result.ok, false, field);
    assert.ok(result.errors[field], field);
  }
  for (const email of ["missing-at", "a@@example.com", "jane@", "two people@example.com"]) {
    const result = prepareEmailDraft({ ...base, email });
    assert.equal(result.ok, false, email);
    assert.ok(result.errors.email);
  }
});

test("trimming preserves meaningful message lines, accented names, and optional values", () => {
  const { values, draft } = prepare({
    firstName: "  José ", lastName: " O'Neill ", email: " jose+stay@example.com ",
    phone: " +1 (760) 555-0100 ", villa: "Ocean Front Villa #7",
    message: " \r\nFirst line.\r\n\r\nSecond line.\n ", guests: " 02 ",
  });
  assert.equal(values.firstName, "José");
  assert.equal(values.lastName, "O'Neill");
  assert.equal(values.guests, "2");
  assert.equal(values.message, "First line.\n\nSecond line.");
  assert.ok(draft.body.includes("Name: José O'Neill"));
  assert.ok(draft.body.includes("Phone: +1 (760) 555-0100"));
  assert.ok(draft.body.includes("Villa of interest: Ocean Front Villa #7"));
});

test("guests are positive safe whole numbers without an arbitrary occupancy maximum", () => {
  assert.equal(prepare({ guests: "1" }).draft.subject, "Beachwalk Villas inquiry — 1 guest");
  assert.equal(prepare({ guests: "25" }).draft.subject, "Beachwalk Villas inquiry — 25 guests");
  for (const guests of ["0", "-1", "1.5", "1e2", "NaN", "Infinity", "9007199254740992"]) {
    const result = prepareEmailDraft({ ...base, guests });
    assert.equal(result.ok, false, guests);
    assert.ok(result.errors.guests);
  }
});

test("optional and partial dates do not invent the missing date", () => {
  const checkinOnly = prepare({ checkin: "2027-03-12" }).draft;
  assert.equal(checkinOnly.subject, "Beachwalk Villas inquiry — Check-in March 12, 2027 — 2 guests");
  assert.ok(checkinOnly.body.includes("Check-out: Not provided"));
  const checkoutOnly = prepare({ checkout: "2027-03-15" }).draft;
  assert.equal(checkoutOnly.subject, "Beachwalk Villas inquiry — Check-out March 15, 2027 — 2 guests");
  assert.ok(checkoutOnly.body.includes("Check-in: Not provided"));
});

test("date ranges format accurately within months, across months, and across years", () => {
  assert.equal(prepare({ checkin: "2027-03-12", checkout: "2027-03-15", villa: "Ocean Front Villa #7" }).draft.subject,
    "Beachwalk Villas inquiry — March 12–15, 2027 — 2 guests — Ocean Front Villa #7");
  assert.equal(prepare({ checkin: "2027-03-30", checkout: "2027-04-02" }).draft.subject,
    "Beachwalk Villas inquiry — March 30–April 2, 2027 — 2 guests");
  assert.equal(prepare({ checkin: "2027-12-30", checkout: "2028-01-02" }).draft.subject,
    "Beachwalk Villas inquiry — December 30, 2027–January 2, 2028 — 2 guests");
  assert.ok(prepare({ checkin: "2028-02-29" }).draft.body.includes("February 29, 2028"));
});

test("impossible dates and non-increasing stays are rejected", () => {
  for (const checkin of ["2027-02-29", "2027-04-31", "2027-13-01", "2027-00-12", "2027-03-00", "0000-01-01", "03/12/2027"]) {
    const result = prepareEmailDraft({ ...base, checkin });
    assert.equal(result.ok, false, checkin);
    assert.ok(result.errors.checkin);
  }
  for (const checkout of ["2027-03-12", "2027-03-11"]) {
    const result = prepareEmailDraft({ ...base, checkin: "2027-03-12", checkout });
    assert.equal(result.ok, false, checkout);
    assert.equal(result.errors.checkout, "Check-out must be after check-in.");
  }
});

test("mail-to parameters round-trip punctuation, Unicode, emoji and lines without extra recipients", () => {
  const message = "& + ? # O'Neill café 🏖️\nLine 2: ?cc=other@example.com&bcc=third@example.com\n<script>alert('x')</script>";
  const { draft } = prepare({ message, villa: "Ocean Front Villa #7", firstName: "José" });
  const url = new URL(draft.mailto);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "reservations@beachwalkvillas.net");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.searchParams.get("subject"), draft.subject);
  assert.equal(url.searchParams.get("body"), draft.body.replace(/\n/g, "\r\n"));
  assert.ok(draft.body.includes(message));
  assert.equal(url.hash, "");
  assert.equal(url.searchParams.has("cc"), false);
  assert.equal(url.searchParams.has("bcc"), false);
});

test("subject is always single-line", () => {
  const { draft } = prepare({ villa: "Villa #7\r\nCc: nobody@example.com" });
  assert.doesNotMatch(draft.subject, /[\r\n]/);
  assert.deepEqual([...new URL(draft.mailto).searchParams.keys()], ["subject", "body"]);
});

test("complete encoded URI threshold uses copy fallback only above the boundary and never truncates", () => {
  const short = prepare({ message: "x" }).draft;
  const boundaryLength = MAILTO_MAX_ENCODED_LENGTH - short.mailto.length + 1;
  assert.ok(boundaryLength > 1);
  const atBoundary = prepare({ message: "x".repeat(boundaryLength) }).draft;
  assert.equal(atBoundary.mailto.length, MAILTO_MAX_ENCODED_LENGTH);
  assert.equal(atBoundary.exceedsMailtoPolicy, false);
  const overBoundary = prepare({ message: "x".repeat(boundaryLength + 1) }).draft;
  assert.equal(overBoundary.mailto.length, MAILTO_MAX_ENCODED_LENGTH + 1);
  assert.equal(overBoundary.exceedsMailtoPolicy, true);
  const longMessage = "🌊 Complete message & details\n".repeat(400).trim();
  const long = prepare({ message: longMessage }).draft;
  assert.equal(long.exceedsMailtoPolicy, true);
  assert.ok(long.body.includes(longMessage));
  assert.equal(new URL(long.mailto).searchParams.get("body"), long.body.replace(/\n/g, "\r\n"));
});

test("selected calendar dates are stable on Pacific, UTC and Tokyo devices", () => {
  const moduleUrl = new URL("../src/lib/contact-draft.ts", import.meta.url).href;
  const input = { ...base, checkin: "2027-03-12", checkout: "2027-03-15" };
  const program = `import { prepareEmailDraft } from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(prepareEmailDraft(${JSON.stringify(input)})));`;
  const results = ["America/Los_Angeles", "UTC", "Asia/Tokyo"].map((TZ) =>
    execFileSync(process.execPath, ["--input-type=module", "-e", program], { env: { ...process.env, TZ }, encoding: "utf8" }),
  );
  assert.equal(results[0], results[1]);
  assert.equal(results[1], results[2]);
  assert.ok(results[0].includes("March 12–15, 2027"));
});
