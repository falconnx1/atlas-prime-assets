/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#faf8f3',
          500: '#d4af37',
          600: '#c19a1b',
          700: '#a67c52',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
}
