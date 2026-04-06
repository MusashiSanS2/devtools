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
        bg: '#08080c',
        surface: '#0f0f14',
        border: '#1c1c28',
        muted: '#3a3a52',
        text: '#e8e8f0',
        subtle: '#8888a8',
        accent: {
          blue: '#4f8eff',
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#06b6d4',
          orange: '#f97316',
          green: '#22c55e',
          yellow: '#eab308',
        },
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        fira: ['var(--font-fira)', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern':
          'radial-gradient(circle, #1c1c28 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

export default config
