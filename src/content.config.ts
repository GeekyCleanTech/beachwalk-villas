import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const villas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/villas' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    unitNumber: z.number(),
    category: z.enum(['Studio', 'One Bedroom', 'Two Bedroom', 'Three Bedroom Penthouse']),
    viewType: z.string(),
    status: z.enum(['available', 'occupied', 'maintenance']).default('available'),
    image: image(),
    galleryImages: z.array(image()).default([]),
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
    layout: z.string().optional(),
    tagline: z.string().optional(),
    featured: z.boolean().default(false),
    unitAmenities: z.array(z.string()).default([]),
    metaDescription: z.string().optional(),
    sortOrder: z.number().default(0),
  }),
});

export const collections = { villas };
