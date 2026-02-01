/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'geist': ['var(--font-geist-sans)', 'sans-serif'],
        'heading': ['var(--font-playfair)', 'serif'], // Fallback for Perfectly Nineties
      },
      colors: {
        'overlap-blue': {
          DEFAULT: '#80C2E5',
          light: '#9BCBE8',
          dark: '#6784A6',
        },
      },
    },
  },
  plugins: [],
}
