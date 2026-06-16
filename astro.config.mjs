import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://beachwalkvillas.net',
  // Cloudflare adapter for server-side rendering on Cloudflare Pages/Workers
  // Enables on-demand rendering for contact forms and dynamic features
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
