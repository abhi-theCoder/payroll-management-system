/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e6ecff',
          200: '#d1dcff',
          300: '#b3c7ff',
          400: '#8fa7ff',
          500: '#6b7dff',
          600: '#5863ff',
          700: '#4247ef',
          800: '#3635c7',
          900: '#2f32a0',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9ff',
          200: '#ddd5ff',
          300: '#c5b3ff',
          400: '#a885ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
