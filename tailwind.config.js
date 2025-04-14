/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#050314',
        'deep-blue': '#0A0A2A',
        'cosmic-purple': '#2E0854',
        'nebula-pink': '#FF00FF',
        'electric-blue': '#00FFFF',
        'neon-teal': '#39FF14',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'nebula-gradient': 'linear-gradient(to right, #0A0A2A, #2E0854, #0A0A2A)',
      }
    },
  },
  plugins: [],
}
