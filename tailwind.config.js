/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Segoe UI Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}