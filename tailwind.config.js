/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Background system
        void:        '#0A0A0F',
        surface:     '#111119',
        'surface-2': '#191924',
        'surface-3': '#22222F',

        // Border system
        border: {
          DEFAULT: '#1C1C2A',
          mid:     '#2A2A3C',
          strong:  '#3A3A52',
        },

        // Kotlin brand gradient stops
        kotlin: {
          pink:       '#C757BC',
          violet:     '#9B59F5',
          indigo:     '#7F52FF',
          // Raw vivid — hero headline accent & ripple only
          'raw-pink':   '#D512EE',
          'raw-violet': '#C727DE',
          'raw-indigo': '#814DFE',
        },

        // GDG pinwheel structural grey
        gdg: {
          grey:  '#D8D8D8',
          light: '#EBEBEB',
        },

        // Text hierarchy
        text: {
          primary: '#FFFFFF',
          body:    '#E8E8F0',
          muted:   '#8888A8',
          dim:     '#55556A',
        },

        // Semantic
        success: '#22C55E',
        error:   '#EF4444',
        warning: '#F59E0B',
      },

      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      backgroundImage: {
        'gradient-kotlin':   'linear-gradient(135deg, #C757BC, #9B59F5, #7F52FF)',
        'gradient-kotlin-h': 'linear-gradient(90deg,  #C757BC, #9B59F5, #7F52FF)',
        'gradient-kotlin-v': 'linear-gradient(180deg, #C757BC, #9B59F5, #7F52FF)',
        'gradient-vivid':    'linear-gradient(135deg, #D512EE, #C727DE, #814DFE)',
        'gradient-text':     'linear-gradient(110deg, #D512EE 0%, #C727DE 45%, #814DFE 100%)',
        'gradient-glow':     'radial-gradient(ellipse at 50% 0%, rgba(155,89,245,0.18) 0%, transparent 65%)',
      },

      boxShadow: {
        'kotlin-sm': '0 0 0 1px rgba(155,89,245,0.3)',
        'kotlin-md': '0 0 28px rgba(155,89,245,0.14)',
        'kotlin-lg': '0 0 64px rgba(127,82,255,0.08)',
      },

      animation: {
        'float':     'float 6s ease-in-out infinite',
        'spin-slow': 'spin 16s linear infinite',
        'pulse-dim': 'pulseDim 3s ease-in-out infinite',
        'marquee':   'marquee 30s linear infinite',
        'fade-in':   'fadeIn 0.4s ease forwards',
      },

      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        pulseDim: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
