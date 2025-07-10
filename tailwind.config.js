/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",         // CRA uses this for root HTML
    "./src/**/*.{js,jsx,ts,tsx}",  // All React component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

