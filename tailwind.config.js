/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        cat: {
          cream: '#FFFDF9',
          peach: '#FFE8D6',
          salmon: '#FF9F80',
          orange: '#FF7E36',
          caramel: '#DDA15E',
          chocolate: '#60412B',
          lavender: '#EADEFC',
          purple: '#8A5CF5',
          mint: '#D8F3DC',
          sage: '#52B788',
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        bounceSubtle: 'bounceSubtle 2s ease-in-out infinite',
        popIn: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
