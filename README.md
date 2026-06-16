# Beachwalk Villas — Astro + Tailwind + Cloudflare

Modern rebuild of beachwalkvillas.net using Astro, Tailwind CSS, and Cloudflare Pages.

## Stack
- **Framework:** Astro 4.x (static output)
- **Styling:** Tailwind CSS 3.x
- **Hosting:** Cloudflare Pages
- **Content:** Astro Content Collections (MDX)

## Project Structure

```
src/
├── components/
│   ├── Nav.astro           # Sticky nav with mobile menu
│   ├── Footer.astro        # Site footer
│   ├── Hero.astro          # Hero with video/image bg support
│   ├── VillaCard.astro     # Villa grid card
│   ├── ImageGallery.astro  # Villa detail image gallery
│   └── ContactForm.astro   # Contact/inquiry form
├── content/
│   ├── config.ts           # Zod schema for villas collection
│   └── villas/             # 10 MDX files (one per villa)
├── layouts/
│   ├── BaseLayout.astro    # HTML shell + SEO head
│   ├── SiteLayout.astro    # BaseLayout + Nav + Footer
│   └── VillaLayout.astro   # SiteLayout wrapper for villa pages
├── pages/
│   ├── index.astro                 # Home
│   ├── amenities.astro             # Amenities
│   ├── attractions.astro           # Local Attractions
│   ├── promotions.astro            # Promotions
│   ├── health-and-safety.astro     # Health & Safety
│   ├── reservation-policies.astro  # Booking Policies
│   ├── contact-us.astro            # Contact
│   ├── 404.astro                   # 404 page
│   └── villas/
│       ├── index.astro             # All villas grid (with filter)
│       └── [slug].astro            # Dynamic villa detail page
└── styles/
    └── global.css                  # Tailwind + global styles

public/
├── images/                  # ALL media from WP uploads (copy here)
├── _redirects               # Cloudflare URL redirect rules
└── robots.txt
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Copy media files
Copy contents of `beachwalk-uploads/` to `public/images/`:
```bash
cp -r ~/Desktop/beachwalk-uploads/* public/images/
```

### 3. Run dev server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `dist`
5. Node version: 18+

## Content Updates

### Update villa details
Edit any file in `src/content/villas/` — frontmatter controls all structured data,
the body content is the villa description rendered on the detail page.

### Add/remove amenities per villa
Update the `unitAmenities` array in each villa's MDX frontmatter.

### Add pricing
Add `nightlyRate`, `weeklyRate`, or `monthlyRate` to any villa's frontmatter.

### Update brand colors
Edit `tailwind.config.mjs` — the `brand` color palette is the single source of truth.
Update hex values after confirming exact colors from the live site or Figma.

## TODO Before Launch
- [ ] Copy all images from WP uploads to `/public/images/`
- [ ] Confirm exact brand hex colors from live site / Figma
- [ ] Update contact email address in Footer and ContactForm
- [ ] Add phone number when confirmed
- [ ] Verify all villa gallery image assignments match actual photos
- [ ] Set up form handling (Cloudflare Forms, Formspark, or Resend)
- [ ] Add Google Maps embed to Contact page
- [ ] Test all redirects from old WP URLs
- [ ] Submit sitemap to Google Search Console after launch
