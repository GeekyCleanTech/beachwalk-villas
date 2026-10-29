

## ---

**1\. Core Framework & Design System**

To achieve that "boutique-hotel-grade" feel, we will move away from generic utility classes and define a strict Design Token system in your tailwind.config.mjs.

* **Typography:** Pair a refined serif (e.g., *Playfair Display* for headings) with a clean humanist sans-serif (e.g., *Inter* or *Lato* for body).  
* **Color Palette (Tokens):**  
  * primary: \#0a3d52 (Ocean Navy)  
  * accent: \#cc6633 (Refined Terracotta \- adjusted for WCAG AA contrast against \#ffffff backgrounds)  
  * secondary: \#408080 (Seafoam/Teal)  
  * neutral: \#f8f7f4 (Warm Sand)  
* **Performance:** Use @fontsource for self-hosted, optimized font loading to prevent layout shifts.

## ---

**2\. Villa Content Model (Zod \+ Collections)**

Defining your villas in src/content/config.ts ensures type safety and prevents broken links or missing data in your booking funnel.

TypeScript

// src/content/config.ts  
import { defineCollection, z } from 'astro:content';

const villas \= defineCollection({  
  type: 'content',  
  schema: z.object({  
    name: z.string(),  
    unitNumber: z.number(),  
    category: z.enum(\['Studio', 'One Bedroom', 'Two Bedroom', 'Three Bedroom Penthouse'\]),  
    viewType: z.string(),  
    specs: z.object({  
      bedrooms: z.number(),  
      bathrooms: z.number(),  
      maxGuests: z.number(),  
      sqft: z.number(),  
    }),  
    rates: z.object({  
      winter: z.number(),  
      springHoliday: z.number(),  
      summer: z.number(),  
    }),  
    guestyUrl: z.string().url(),  
  }),  
});

## ---

**3\. SEO & Accessibility (The "Professional Foundation")**

To ensure your search rankings are preserved and user accessibility is robust:

* **Structured Data:** Build an SEO.astro component that injects JSON-LD for each unit. This is critical for appearing in Google’s vacation rental search results.  
* **Semantic Landmarks:** Use standard \<header\>, \<nav\>, \<main\>, \<section\>, and \<footer\> tags.  
* **Accessible Forms:** For the inquiry form, ensure aria-invalid and aria-describedby are dynamically updated by your client-side validation logic.  
* **Image Handling:** Utilize astro:assets to automatically transform hero images into webp and generate responsive srcset definitions, keeping your page weight lean.

## ---

**4\. Implementation Checklist**

| Phase | Task | Technical Focus |
| :---- | :---- | :---- |
| **I** | **Skeleton & Tokens** | Astro setup, Tailwind config, Font setup. |
| **II** | **Data Modeling** | Content Collections setup & Markdown migration. |
| **III** | **Component Lib** | Build VillaCard, Nav, Gallery, RateTable. |
| **IV** | **Booking Logic** | Integrate deep-links; test Guesty cross-origin behavior. |
| **V** | **Accessibility** | Run axe-core audits; refine focus states. |
| **VI** | **SEO/Deployment** | Sitemap, Robots, 301-redirect mapping, Vercel/Netlify CI/CD. |

### ---

This configuration prioritizes the "Coastal Luxury" palette while ensuring WCAG AA compliance by adjusting the saturation of the terracotta accent.

### **1\. `tailwind.config.mjs` Design Tokens**

JavaScript  
/\*\* @type {import('tailwindcss').Config} \*/  
export default {  
  content: \['./src/\*\*/\*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'\],  
  theme: {  
    extend: {  
      colors: {  
        // Coastal Luxury Palette  
        navy: {  
          DEFAULT: '\#0a3d52',  
          dark: '\#072b3a',  
        },  
        terracotta: {  
          DEFAULT: '\#b85a2d', // Adjusted for WCAG AA contrast against white  
        },  
        seafoam: {  
          DEFAULT: '\#408080',  
        },  
        sand: {  
          DEFAULT: '\#f8f7f4',  
          dark: '\#e5e1dc',  
        },  
      },  
      fontFamily: {  
        serif: \['"Playfair Display"', 'serif'\],  
        sans: \['"Inter"', 'system-ui', 'sans-serif'\],  
      },  
      spacing: {  
        '128': '32rem',  
      },  
    },  
  },  
  plugins: \[require('@tailwindcss/typography'), require('@tailwindcss/forms')\],  
};

---

### **2\. Implementation Prompt for Google AI Studio**

Copy this block into Google AI Studio. It is engineered to force the model to adopt your "Digital Transformation Partner" persona and follow strict architectural constraints.

### **3\. Villa Content Schema & Image Mapping**

To keep your media pipeline clean, use this mapping convention in your content frontmatter.

**File Mapping Table (Reference for your asset pipeline):**

| Villa | Filename Placeholder |
| :---- | :---- |
| Poolside Studio \#10 | villa-poolside-10.jpg |
| Poolside Studio \#9 | villa-poolside-9.jpg |
| Garden View Villa \#3 | villa-garden-3.jpg |
| Ocean Front Villa \#7 | villa-oceanfront-7.jpg |
| Avenue View Villa \#1 | villa-avenue-1.jpg |
| Avenue View Villa \#2 | villa-avenue-2.jpg |
| Ocean View Villa \#4 | villa-oceanview-4.jpg |
| Ocean Front Villa \#6 | villa-oceanfront-6.jpg |
| Ocean Front Villa \#8 | villa-oceanfront-8.jpg |
| Ocean View Penthouse \#5 | villa-penthouse-5.jpg |

**Code Block: Zod Image Mapping**

Add this to your src/content/config.ts to enforce image presence during the build:

TypeScript  
// Add to your villa schema  
image: image().refine((img) \=\> img.width \>= 800, {  
  message: "Villa images must be at least 800px wide for high-res displays.",  
}),

In keeping with your requirement for a high-performance, boutique-luxury site, the `SEO.astro` component must go beyond basic meta tags. It needs to handle dynamic Open Graph injection and, crucially, **structured data (JSON-LD)** to ensure your villas appear as rich results in search engines.

Here is the finalized schema for your `SEO.astro` component, designed to be dropped into your `src/components/` directory.

### **`SEO.astro` Component**

Code snippet  
\---  
// src/components/SEO.astro  
import { SEO } from "astro-seo"; // Recommended: install 'astro-seo' package

interface Props {  
  title?: string;  
  description?: string;  
  canonical?: string;  
  isVillaPage?: boolean;  
  schemaData?: Record\<string, any\>;  
}

const {   
  title \= "Beachwalk Villas | Luxury Oceanfront Rentals in Carlsbad",   
  description \= "Experience boutique coastal luxury at Beachwalk Villas. Steps from the Carlsbad shore, offering residential-style villas with unobstructed ocean views.",  
  canonical,  
  isVillaPage \= false,  
  schemaData   
} \= Astro.props;

const siteName \= "Beachwalk Villas";  
const fullTitle \= title ? \`${title} | ${siteName}\` : siteName;

// Default Organization Schema  
const baseSchema \= {  
  "@context": "https://schema.org",  
  "@type": "LodgingBusiness",  
  "name": siteName,  
  "address": {  
    "@type": "PostalAddress",  
    "streetAddress": "3100 Ocean Street",  
    "addressLocality": "Carlsbad",  
    "addressRegion": "CA",  
    "postalCode": "92008",  
    "addressCountry": "US"  
  },  
  "telephone": "+1-760-720-1400",  
  "url": "https://beachwalkvillas.net"  
};  
\---

\<SEO  
  title={fullTitle}  
  description={description}  
  canonical={canonical || Astro.url.href}  
  openGraph={{  
    basic: { title: fullTitle, type: "website", image: "/social-share.jpg" },  
    optional: { siteName: siteName, description: description },  
  }}  
  twitter={{ card: "summary\_large\_image" }}  
/\>

{/\* JSON-LD Structured Data Injection \*/}  
\<script type="application/ld+json" set:html={JSON.stringify(isVillaPage ? schemaData : baseSchema)} /\>

### **Implementation Notes for your Google AI Studio Plan**

When you feed this into the AI Studio, ensure you emphasize these three "technical levers":

1. **Dynamic Schema Injection:** Note how `schemaData` is passed as a prop. On your `[slug].astro` villa pages, you will fetch the data from the Content Collection and pass the `VacationRental` schema object into this component to ensure the "Rates" and "Unit Details" are indexed correctly.  
2. **Canonical Enforcement:** By defaulting to `Astro.url.href`, we prevent duplicate content issues—a common pitfall in older WordPress-to-Astro migrations.  
3. **Performance:** This component is "zero-client-js." It outputs static HTML/JSON at build time, ensuring 0ms impact on your Largest Contentful Paint (LCP).

To ensure your villa detail pages are fully indexed and performant, we need to bridge the **Content Collection** data directly into the `SEO.astro` component and the page layout.

Below is the template for `src/pages/villas/[slug].astro`. This structure ensures the schema is dynamically generated based on the specific villa unit.

### **`[slug].astro` Template**

Code snippet  
\---  
// src/pages/villas/\[slug\].astro  
import { getCollection, type CollectionEntry } from 'astro:content';  
import Layout from '../../layouts/Layout.astro'; // Assuming your base layout  
import SEO from '../../components/SEO.astro';

export async function getStaticPaths() {  
  const villaEntries \= await getCollection('villas');  
  return villaEntries.map(entry \=\> ({  
    params: { slug: entry.slug },  
    props: { entry },  
  }));  
}

const { entry } \= Astro.props;  
const { data } \= entry;

// Construct JSON-LD for this specific villa  
const villaSchema \= {  
  "@context": "https://schema.org",  
  "@type": "VacationRental",  
  "name": data.name,  
  "description": data.longDescription,  
  "address": {  
    "@type": "PostalAddress",  
    "streetAddress": "3100 Ocean Street",  
    "addressLocality": "Carlsbad",  
    "addressRegion": "CA",  
    "postalCode": "92008"  
  },  
  "offers": {  
    "@type": "Offer",  
    "priceCurrency": "USD",  
    "price": data.rates.winter, // Base season example  
    "description": "Rates vary by season"  
  }  
};  
\---

\<Layout title={data.name}\>  
  \<SEO   
    slot="head"  
    title={data.name}   
    description={data.shortDescription}  
    isVillaPage={true}  
    schemaData={villaSchema}  
  /\>

  \<main class="container mx-auto px-4 py-8"\>  
    \<h1 class="font-serif text-4xl text-navy mb-4"\>{data.name}\</h1\>  
      
    \<section class="grid md:grid-cols-2 gap-8"\>  
      \<div\>  
        \<img src={\`/images/${data.image}\`} alt={data.name} class="rounded-lg shadow-lg" /\>  
      \</div\>  
      \<div\>  
        \<p class="text-xl text-terracotta font-semibold mb-4"\>  
          {data.specs.bedrooms} BR / {data.specs.bathrooms} BA | Sleeps {data.specs.maxGuests}  
        \</p\>  
        \<div class="prose max-w-none"\>  
          {data.longDescription}  
        \</div\>  
        \<a href={data.guestyUrl} class="mt-6 inline-block bg-terracotta text-white px-6 py-3 rounded-md hover:bg-navy transition"\>  
          Book This Villa  
        \</a\>  
      \</div\>  
    \</section\>  
  \</main\>  
\</Layout\>

---

### **Key Technical Integrations for the Implementation Plan:**

1. **Schema Injection:** Note how `villaSchema` is built using the `data` object from the collection. This ensures that every time you update a villa's description or price in the Markdown file, the SEO metadata updates automatically at build time.  
2. **`getStaticPaths`:** This function tells Astro to build an individual HTML page for every villa found in your `src/content/villas/` folder, effectively handling the routing for your entire inventory.  
3. **The Slot Pattern:** By using `<SEO slot="head" />`, we ensure the meta tags are injected into the `<head>` of your master `Layout.astro` without repeating the entire boilerplate.

