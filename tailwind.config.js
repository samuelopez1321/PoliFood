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
          light: '#4ade80',
        },
        secondary: {
          DEFAULT: '#facc15',
          dark: '#eab308',
        }, // Amarillo
        accent: {
          DEFAULT: '#ef4444', // Rojo para "Agotado" o errores
          dark: '#b91c1c',
        },
        neutral: {
          50:  '#f9fafb', // Fondo de la página
          100: '#f3f4f6', // Fondos de tarjetas
          800: '#1f2937', // Textos principales
          900: '#111827', // Títulos muy oscuros
        }  
      },
    },
  },
  plugins: [],
}