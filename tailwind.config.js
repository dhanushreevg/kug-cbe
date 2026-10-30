/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Carbon #050506 System matching Gather Lite
        void:        '#050506',
        surface:     '#111111',
        'surface-2': '#141414',
        'surface-3': '#1a1a1a',

        // Border system (subtle white opacity)
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          mid:     'rgba(255, 255, 255, 0.12)',
          strong:  'rgba(255, 255, 255, 0.18)',
        },

        // Kotlin Brand Kit Colors
        kotlin: {
          purple:     '#7F52FF',
          magenta:    '#C811E1',
          coral:      '#E44857',
          orange:     '#F88A00',
          blue:       '#0095D5',
          grey:       '#8A8A8A',
        },

        // Text hierarchy adhering to WCAG AA+
        text: {
          primary: '#FFFFFF',
          body:    '#D4D4D4',
          muted:   '#8A8A8A',
          dim:     '#666666',
        },
      },

      fontFamily: {
        sans:    ['Manrope', 'system-ui', 'sans-serif'],
        body:    ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        'clean-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'clean-md': '0 8px 16px rgba(0, 0, 0, 0.5)',
        'clean-lg': '0 16px 32px rgba(0, 0, 0, 0.6)',
      },

      animation: {
        'marquee':   'marquee 30s linear infinite',
      },

      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
