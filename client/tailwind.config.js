/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#010b18',
          900: '#021428',
          800: '#032340',
          700: '#053660',
          600: '#0a4f8a',
          500: '#0e6eb8',
          400: '#1a8fd1',
          300: '#38b6f0',
          200: '#7dd4f8',
          100: '#c2eeff',
        },
        foam: {
          DEFAULT: '#e8f8ff',
          white: '#f0fbff',
        },
        biolum: {
          DEFAULT: '#00ffe7',
          dim: '#00bfad',
          glow: '#7ffff4',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'wave-slow': 'wave 8s ease-in-out infinite',
        'wave-medium': 'wave 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(8px)' },
          '50%': { opacity: '1', filter: 'blur(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'ocean-glow': '0 0 30px rgba(0, 255, 231, 0.3)',
        'ocean-glow-lg': '0 0 60px rgba(0, 255, 231, 0.4)',
        'deep': '0 25px 80px rgba(1, 11, 24, 0.9)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}