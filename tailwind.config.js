/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        ink: '#0B0E11',
        panel: '#12161B',
        panel2: '#191F26',
        line: '#242C35',
        sand: '#F3ECDD',
        rust: '#FF5A36',
        gold: '#F5B93E',
        sea: '#1FB6A6',
        violet: '#8C7CF0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'goa-sunset': 'linear-gradient(135deg, #FF5A36 0%, #F5B93E 45%, #1FB6A6 100%)',
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(255,90,54,0.18), transparent 60%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(4deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 9s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
