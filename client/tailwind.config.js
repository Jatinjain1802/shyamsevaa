export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sindoor: '#8E1616',
        marigold: '#F39200',
        haldi: '#FFC107',
        'paper-bg': '#FCF8F1',
        'heritage-dark': '#2D1B1B',
        primary: {
          DEFAULT: '#F25D11', // Vibrant Orange
          dark: '#D14909',
        },
        secondary: '#FFF8F0', // Cream
        accent: '#FFD700', // Gold
        whatsapp: '#25D366',
        'text-dark': '#2D1810',
        'text-light': '#555555',
      },
      fontFamily: {
        sans: ['Martel', 'serif'], // Changed default sans to Martel as per design
        serif: ['Yatra One', 'cursive'], // Changed default serif to Yatra One
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        hindi: ['Tiro Devanagari Hindi', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
