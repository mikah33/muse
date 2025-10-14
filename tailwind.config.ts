import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pure-black': '#000000',
        'soft-black': '#0A0A0A',
        'charcoal': '#1A1A1A',
        'dark-gray': '#2D2D2D',
        'medium-gray': '#666666',
        'light-gray': '#999999',
        'pale-gray': '#CCCCCC',
        'off-white': '#F5F5F5',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'extreme': '0.2em',
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-out infinite alternate',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scale-x': 'scale-x 0.3s ease-out forwards',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'scale-x': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
