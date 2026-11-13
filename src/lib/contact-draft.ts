export const CONTACT_RECIPIENT = "reservations@beachwalkvillas.net";

// An application fallback threshold, not a universal email-client limit.
// Count the complete percent-encoded URI; longer drafts use manual copy.
export const MAILTO_MAX_ENCODED_LENGTH = 1800;

export interface InquiryFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  villa: string;
  checkin: string;
  checkout: string;
  guests: string;
  message: string;
}

export interface EmailDraft {
  recipient: string;
  subject: string;
  body: string;
  mailto: string;
  exceedsMailtoPolicy: boolean;
}

export type InquiryErrors = Partial<Record<keyof InquiryFields, string>>;
export type PreparationResult =
  | { ok: false; errors: InquiryErrors }
  | { ok: true; values: InquiryFields; draft: EmailDraft };

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Calendar arithmetic deliberately avoids Date parsing and timezone conversion.
function parseCalendarDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1 || month < 1 || month > 12) return null;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > daysInMonth[month - 1]) return null;
  return { year, month, day };
}

function formatDate(date: CalendarDate): string {
  return `${MONTHS[date.month - 1]} ${date.day}, ${date.year}`;
}

function formatDateRange(checkin: CalendarDate, checkout: CalendarDate): string {
  if (checkin.year !== checkout.year) {
    return `${formatDate(checkin)}–${formatDate(checkout)}`;
  }
  if (checkin.month !== checkout.month) {
    return `${MONTHS[checkin.month - 1]} ${checkin.day}–${MONTHS[checkout.month - 1]} ${checkout.day}, ${checkin.year}`;
  }
  return `${MONTHS[checkin.month - 1]} ${checkin.day}–${checkout.day}, ${checkin.year}`;
}

function encodeMailtoComponent(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function prepareEmailDraft(input: InquiryFields): PreparationResult {
  const values: InquiryFields = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    villa: input.villa.trim(),
    checkin: input.checkin.trim(),
    checkout: input.checkout.trim(),
    guests: input.guests.trim(),
    message: input.message.replace(/\r\n?/g, "\n").trim(),
  };
  const errors: InquiryErrors = {};
  if (!values.firstName) errors.firstName = "Enter your first name.";
  if (!values.lastName) errors.lastName = "Enter your last name.";
  if (!values.email) {
    errors.email = "Enter your contact email address.";
  } else if (!/^[^\s@]+@[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message) errors.message = "Enter a message for the Beachwalk Villas team.";

  const guestCount = Number(values.guests);
  if (!/^\d+$/.test(values.guests) || !Number.isSafeInteger(guestCount) || guestCount < 1) {
    errors.guests = "Enter a whole number of guests, at least 1.";
  }

  const checkin = values.checkin ? parseCalendarDate(values.checkin) : null;
  const checkout = values.checkout ? parseCalendarDate(values.checkout) : null;
  if (values.checkin && !checkin) errors.checkin = "Enter a valid check-in date.";
  if (values.checkout && !checkout) errors.checkout = "Enter a valid check-out date.";
  if (checkin && checkout && values.checkout <= values.checkin) {
    errors.checkout = "Check-out must be after check-in.";
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  values.guests = String(guestCount);
  const subjectParts = ["Beachwalk Villas inquiry"];
  if (checkin && checkout) subjectParts.push(formatDateRange(checkin, checkout));
  else if (checkin) subjectParts.push(`Check-in ${formatDate(checkin)}`);
  else if (checkout) subjectParts.push(`Check-out ${formatDate(checkout)}`);
  subjectParts.push(`${guestCount} ${guestCount === 1 ? "guest" : "guests"}`);
  if (values.villa) subjectParts.push(values.villa);
  const subject = subjectParts.join(" — ").replace(/[\r\n]+/g, " ");
  const name = `${values.firstName} ${values.lastName}`;
  const body = [
    "Hello Beachwalk Villas team,",
    "",
    values.message,
    "",
    "Inquiry details:",
    `Name: ${name}`,
    `Contact email: ${values.email}`,
    `Phone: ${values.phone || "Not provided"}`,
    `Villa of interest: ${values.villa || "Not selected"}`,
    `Check-in: ${checkin ? formatDate(checkin) : "Not provided"}`,
    `Check-out: ${checkout ? formatDate(checkout) : "Not provided"}`,
    `Guests: ${guestCount}`,
    "",
    "Thank you,",
    name,
  ].join("\n");
  const mailto = `mailto:${CONTACT_RECIPIENT}?subject=${encodeMailtoComponent(subject)}&body=${encodeMailtoComponent(body.replace(/\n/g, "\r\n"))}`;

  return {
    ok: true,
    values,
    draft: {
      recipient: CONTACT_RECIPIENT,
      subject,
      body,
      mailto,
      exceedsMailtoPolicy: mailto.length > MAILTO_MAX_ENCODED_LENGTH,
    },
  };
}
