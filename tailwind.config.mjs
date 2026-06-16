/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Core brand palette — update with exact hex from live site screenshots
        brand: {
          navy:    '#1a2e44',  // deep header/footer navy
          teal:    '#2a7f8f',  // accent / CTA color
          sand:    '#f5f0e8',  // warm off-white background
          gold:    '#c9a84c',  // highlight / decorative
          white:   '#ffffff',
          dark:    '#1c1c1c',
        },
      },
      fontFamily: {
        // Update with actual fonts used on live site
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero':  ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1' }],
        'h1':    ['clamp(2rem, 4vw, 3.5rem)',  { lineHeight: '1.2' }],
        'h2':    ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.3' }],
        'h3':    ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'site': '1280px',
      },
      spacing: {
        'section': '5rem',
      },
    },
  },
  plugins: [],
};
