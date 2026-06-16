/** @type {import('tailwindcss').Config} */
// Note: Tailwind v4 reads the canonical theme from `@theme` in src/styles/global.css.
// This config mirrors those brand tokens for editor tooling / reference.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          sand:       '#f7f3ec', // warm sand background
          surface:    '#ffffff',
          teal:       '#1f6f78', // primary ocean teal
          'teal-dark':'#16555c',
          coral:      '#e0763c', // accent sunset coral (sparingly)
          'coral-dark':'#c8632d',
          navy:       '#1c2b33', // text navy
          muted:      '#5c6b72',
          border:     '#e7dfd2',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Inter"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
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
  plugins: [],
};
