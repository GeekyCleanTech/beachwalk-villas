// src/data/site.ts — single source of truth for shared site data

export const site = {
  name: "Beachwalk Villas",
  tagline: "Welcome to our beachfront escape",
  location: "Carlsbad, CA",
  address: "3100 Ocean St, Carlsbad, CA 92008",
  mapsQuery: "Beachwalk Villas, 3100 Ocean St, Carlsbad, CA 92008",
  phone: "760-720-1400 ext. 1",
  phoneHref: "tel:+17607201400", // ext. dialed after connection
  telephoneIntl: "+1-760-720-1400", // E.164-ish, for structured data
  email: "info@beachwalkvillas.net",
  emailHref: "mailto:info@beachwalkvillas.net",
  // Structured postal address (3100 Ocean St, Carlsbad, CA 92008)
  addressParts: {
    street: "3100 Ocean St",
    city: "Carlsbad",
    region: "CA",
    postalCode: "92008",
    country: "US",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Villas", href: "/villas/" },
  { label: "Amenities", href: "/amenities/" },
  { label: "Attractions", href: "/attractions/" },
  { label: "Promotions", href: "/promotions/" },
  { label: "Contact", href: "/contact-us/" },
];

// Secondary links surfaced in the footer
export const footerLinks = [
  { label: "Health & Safety", href: "/health-and-safety/" },
  { label: "Booking Policies", href: "/reservation-policies/" },
];

// View-type → display label + badge style
export const typeLabels: Record<string, string> = {
  "ocean-front": "Ocean Front",
  "ocean-view": "Ocean View",
  "avenue-view": "Avenue View",
  "garden-view": "Garden View",
  "poolside-studio": "Poolside",
};

// Which types get a "strongest selling point" badge, and its style
export const typeBadge: Record<string, "ocean" | "coral" | null> = {
  "ocean-front": "ocean",
  "ocean-view": "ocean",
  "poolside-studio": "coral",
  "avenue-view": null,
  "garden-view": null,
};

// Bedroom count → filter category (matches live-site grouping)
export function bedroomCategory(bedrooms: number): string {
  if (bedrooms === 0) return "studio";
  if (bedrooms === 1) return "one-bedroom";
  if (bedrooms === 2) return "two-bedroom";
  return "three-bedroom-penthouse";
}

export const categoryLabels: { key: string; label: string }[] = [
  { key: "studio", label: "Studios" },
  { key: "one-bedroom", label: "One Bedroom" },
  { key: "two-bedroom", label: "Two Bedroom" },
  { key: "three-bedroom-penthouse", label: "Three Bedroom Penthouse" },
];

// Sister properties (kept as an "Other Properties" row).
// All three are part of the Redwood La Jolla family of vacation rentals.
export const sisterProperties = [
  {
    name: "Redwood Hollow Cottages",
    blurb: "Historic garden cottages steps from La Jolla Village and the sea.",
    url: "https://redwoodhollow-lajolla.com/accommodations/",
  },
  {
    name: "Monte Vista",
    blurb:
      "An ocean-view townhome in La Jolla — room for the whole family, with a pool and hot tub.",
    url: "https://redwoodhollow-lajolla.com/astra-portfolio/monte-vista-ocean-view-townhome/",
  },
  {
    name: "La Jolla Scenic",
    blurb: "A mid-century modern home tucked into the hills above La Jolla.",
    url: "https://redwoodhollow-lajolla.com/la-jolla-scenic-mid-century-modern-home/",
  },
];
