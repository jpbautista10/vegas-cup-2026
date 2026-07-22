/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#ffd700",
        neonpink: "#ff2d6a",
        neoncyan: "#00e5ff",
        strip: "#0a0608",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        sans: ['Oswald', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
