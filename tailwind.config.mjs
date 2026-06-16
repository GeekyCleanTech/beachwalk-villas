/** @type {import('tailwindcss').Config} */
// Note: Tailwind v4 reads the canonical theme from `@theme` in src/styles/global.css.
// This config mirrors those brand tokens for editor tooling / reference.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Coastal Luxury Palette
        navy: {
          DEFAULT: '#0a3d52',
          dark: '#072b3a',
        },
        terracotta: {
          DEFAULT: '#b85a2d', // Adjusted for WCAG AA contrast against white
        },
        seafoam: {
          DEFAULT: '#408080',
        },
        sand: {
          DEFAULT: '#f8f7f4',
          dark: '#e5e1dc',
        },
        brand: {
          surface:    '#ffffff',
          muted:      '#5c6b72',
          border:     '#e7dfd2',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.05' }],
        'h1':   ['clamp(2rem, 4vw, 3.25rem)',  { lineHeight: '1.12' }],
        'h2':   ['clamp(1.625rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
        'h3':   ['clamp(1.25rem, 2vw, 1.6rem)', { lineHeight: '1.3' }],
      },
      maxWidth: {
        'site': '1200px',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
