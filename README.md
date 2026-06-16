# Beachwalk Villas — Astro + Tailwind + Cloudflare

Modern rebuild of beachwalkvillas.net using Astro, Tailwind CSS, and Cloudflare Pages.

## Stack
- **Framework:** Astro 6.x with Cloudflare adapter (server-side rendering)
- **Styling:** Tailwind CSS 4.x
- **Hosting:** Cloudflare Pages (with Workers for SSR)
- **Content:** Astro Content Collections (MDX)
- **Analytics:** Cloudflare Web Analytics (optional, token-gated)

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

### 1. Initial Setup

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository and click "Begin setup"

### 2. Build Configuration

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 18 (or higher) |

### 3. Environment Variables

In Cloudflare Pages dashboard → Settings → Environment variables, add:

```
PUBLIC_CF_BEACON_TOKEN=your_actual_beacon_token_here
```

**Note:** Use the `PUBLIC_` prefix for any variables that need to be accessible in the browser. Server-only variables don't need this prefix.

### 4. Cloudflare Web Analytics Setup

1. In Cloudflare dashboard, go to **Web Analytics**
2. Click **Add a site**
3. Enter your domain (e.g., `beachwalkvillas.net`)
4. Copy the beacon token (looks like `1234567890abcdef1234567890abcdef`)
5. Add it as `PUBLIC_CF_BEACON_TOKEN` in your environment variables
6. Deploy — analytics will appear after the first page load

### 5. Local Development with Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your actual values to `.env`:
   ```bash
   PUBLIC_CF_BEACON_TOKEN=your_dev_or_prod_token
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

**Important:** `.env` is in `.gitignore` and will never be committed. Only `.env.example` (with placeholder values) should be in the repo.

### 6. SSR vs Static

This project uses the **Cloudflare adapter** with `output: 'server'`, enabling:
- Server-side rendering for dynamic content
- API endpoints for form handling
- Edge functions on Cloudflare's global network

The build will automatically generate the correct Workers bundle for Cloudflare.

## Content Updates

### Update villa details
Edit any file in `src/content/villas/` — frontmatter controls all structured data,
the body content is the villa description rendered on the detail page.

### Add/remove amenities per villa
Update the `unitAmenities` array in each villa's MDX frontmatter.

### Add pricing
Add `nightlyRate`, `weeklyRate`, or `monthlyRate` to any villa's frontmatter.

### Update brand colors & fonts
The canonical design tokens live in `src/styles/global.css` under `@theme`
(Tailwind v4 reads them from there); `tailwind.config.mjs` mirrors them for tooling.

Current palette:
- Sand background `#F7F3EC` · Surface `#FFFFFF`
- Primary ocean teal `#1F6F78` · Primary dark `#16555C`
- Accent sunset coral `#E0763C` (used sparingly)
- Text navy `#1C2B33` · Muted `#5C6B72` · Border `#E7DFD2`

Typography: **Fraunces** (serif display) + **Inter** (body/UI), loaded in `BaseLayout.astro`.

Shared site data (phone, nav, sister properties, type labels) lives in `src/data/site.ts`.

## TODO Before Launch
- [x] Confirm exact brand hex colors (sand/teal/coral palette applied)
- [x] Add phone number — `760-720-1400 ext. 1` (see `src/data/site.ts`)
- [x] Add Google Maps embed to Contact page
- [ ] Confirm/replace the placeholder map location (currently Carlsbad State Beach)
- [ ] Replace sister-property blurbs / link them to live sites when URLs are confirmed
- [ ] Confirm the `info@beachwalkvillas.net` email address
- [ ] Verify all villa gallery image assignments match actual photos
- [ ] Set up form handling (Cloudflare Forms, Formspark, or Resend)
- [ ] Test all redirects from old WP URLs
- [ ] Submit sitemap to Google Search Console after launch
