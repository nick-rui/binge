/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'swipe-right': 'swipe-right 0.5s ease-out',
        'swipe-left': 'swipe-left 0.5s ease-out',
      },
      keyframes: {
        'swipe-right': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(200%) rotate(20deg)' },
        },
        'swipe-left': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(-200%) rotate(-20deg)' },
        },
      },
    },
  },
  plugins: [],
} 