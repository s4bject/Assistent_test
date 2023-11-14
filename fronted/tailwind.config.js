/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

