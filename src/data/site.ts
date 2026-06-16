// src/data/site.ts — single source of truth for shared site data

export const site = {
  name: "Beachwalk Villas",
  tagline: "Welcome to our beachfront escape",
  location: "Carlsbad, CA",
  phone: "760-720-1400 ext. 1",
  phoneHref: "tel:+17607201400", // ext. dialed after connection
  email: "info@beachwalkvillas.net",
  emailHref: "mailto:info@beachwalkvillas.net",
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

// Sister properties (kept as an "Other Properties" row)
export const sisterProperties = [
  {
    name: "Monte Vista",
    blurb: "Boutique apartment living in a classic San Diego setting.",
  },
  {
    name: "La Jolla Scenic",
    blurb: "Stylish stays among the hills and coves of La Jolla.",
  },
  {
    name: "Redwood Hollow Cottages",
    blurb: "Garden cottages tucked into the heart of La Jolla.",
  },
];
