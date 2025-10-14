/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all JSX/TSX files
  ],
  theme: {
    extend: {  keyframes: {
        rotateY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'rotate-y': 'rotateY 3s linear infinite',
      },
    },
  },
  plugins: [],
}

