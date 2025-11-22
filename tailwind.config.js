/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.jsx",
    "./**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Slate 900
        secondary: "#1e293b", // Slate 800
        gold: "#d4af37",
        "gold-light": "#f0e6b3",
        "gold-dark": "#b4942b",
      },
    },
  },
  plugins: [],
}

