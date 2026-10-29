import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://beachwalkvillas.net',
  output: 'static',
  integrations: [
    sitemap(),
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
