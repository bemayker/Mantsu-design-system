/** @type {import('tailwindcss').Config} */
// Tailwind theme wired to the Mantsu design tokens. Keeping the mapping here
// (rather than re-declaring hex values) means utility classes like
// `bg-primary-blue` or `text-h2` resolve to the exact Figma values.
export default {
  content: ['./src/**/*.{ts,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#155799',
        'primary-neutral': '#0f172a',
        'primary-orange': '#ff5640',
        midnight: '#00193f',
        atlantic: '#092755',
        horizon: '#155799',
        'sky-mist': '#bcddff',
        frost: '#eef6f8',
        'selected-blue': '#eff6ff',
        slate: {
          50: '#f8fafc',
          200: '#e2e8f0',
          400: '#94a3b8',
          500: '#717680',
          600: '#475569',
          950: '#0c1222',
        },
        info: '#3588db',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#f43f5e',
        'info-bg': '#eff6ff',
        'success-bg': '#f0fdf4',
        'warning-bg': '#fff7ed',
        'error-bg': '#fff1f2',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #c70c5b 0%, #e8824f 100%)',
      },
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        h1: ['36px', { lineHeight: '40px', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '700' }],
        h4: ['18px', { fontWeight: '700' }],
        'body-lg': ['16px', { fontWeight: '700' }],
        'body-emphasis': ['16px', { fontWeight: '500' }],
        body: ['16px', { fontWeight: '400' }],
        'body-sm-emphasis': ['14px', { fontWeight: '700' }],
        'body-sm': ['14px', { fontWeight: '400' }],
        'body-xs-emphasis': ['12px', { fontWeight: '700' }],
        'body-xs': ['12px', { fontWeight: '400' }],
      },
      boxShadow: {
        'mantsu-sm': '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
        'mantsu-md': '0 1px 1px 0 rgba(10, 13, 18, 0.05)',
        'mantsu-lg': '0 8px 12px -4px rgba(21, 21, 21, 0.25)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
