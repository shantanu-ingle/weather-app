/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // adjust this path based on your framework/folder structure
    "./public/index.html"              // for HTML usage
  ],
  theme: {
    extend: {
      colors: {
        // Example of custom colors
        primary: "#1d4ed8",
        secondary: "#9333ea",
        accent: "#10b981",
      },
      fontFamily: {
        // Example custom fonts
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),       // Optional: better form styling
    require('@tailwindcss/typography'),  // Optional: prose classes for markdown/text
    require('@tailwindcss/aspect-ratio') // Optional: maintain aspect ratios
  ],
}
