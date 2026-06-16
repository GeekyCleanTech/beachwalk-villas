import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const villas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/villas' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    unit: z.number(),
    type: z.enum(['ocean-front', 'ocean-view', 'avenue-view', 'garden-view', 'poolside-studio']),
    status: z.enum(['available', 'occupied', 'maintenance']).default('available'),
    thumbnailImage: z.string(),
    galleryImages: z.array(z.string()),
    bedrooms: z.number(),
    bathrooms: z.number(),
    maxGuests: z.number().optional(),
    sqft: z.number().optional(),
    unitAmenities: z.array(z.string()).default([]),
    nightlyRate: z.number().optional(),
    weeklyRate: z.number().optional(),
    monthlyRate: z.number().optional(),
    metaDescription: z.string().optional(),
    sortOrder: z.number().default(0),
  }),
});

export const collections = { villas };
