/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // Verde Poli
          dark: '#15803d',
        },
        secondary: '#facc15', // Amarillo
        accent: '#ef4444',    // Rojo
      },
    },
  },
  plugins: [],
}