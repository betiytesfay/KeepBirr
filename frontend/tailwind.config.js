/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spring: "#02F5A1",
        onyx: "#07191E",
        navy: "#000066",
        yellowAccent: "#FFFF99",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}