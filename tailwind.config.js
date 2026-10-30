/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic surfaces — all resolve to CSS custom properties that flip
        // between the "Carbon" (dark) and "Paper" (light) themes.
        // See :root blocks in src/styles/index.css.
        void:        'var(--color-void)',
        surface:     'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        'surface-4': 'var(--color-surface-4)',

        // Border system (subtle hairlines, themed)
        border: {
          DEFAULT: 'var(--color-border)',
          mid:     'var(--color-border-mid)',
          strong:  'var(--color-border-strong)',
        },

        // Foreground + inverse. `ink` is the text used ON fg-coloured buttons.
        fg:       'var(--color-text-primary)',
        'fg-hover': 'var(--color-fg-hover)',
        ink:      'var(--color-ink)',
        body:     'var(--color-text-body)',
        muted:    'var(--color-text-muted)',
        dim:      'var(--color-text-dim)',

        // Quiz correctness states
        correct: {
          bg:   'var(--state-correct-bg)',
          line: 'var(--state-correct-line)',
          text: 'var(--state-correct-text)',
        },
        wrong: {
          bg:   'var(--state-wrong-bg)',
          line: 'var(--state-wrong-line)',
          text: 'var(--state-wrong-text)',
        },

        // Kotlin Brand Kit Colors — identical in both themes (accents only)
        kotlin: {
          purple:     '#7F52FF',
          magenta:    '#C811E1',
          coral:      '#E44857',
          orange:     '#F88A00',
          blue:       '#0095D5',
          grey:       '#8A8A8A',
        },
      },

      // Make the default border colour themed as well.
      borderColor: ({ colors }) => ({
        ...colors,
        DEFAULT: 'var(--color-border)',
      }),

      fontFamily: {
        sans:    ['Manrope', 'system-ui', 'sans-serif'],
        body:    ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        'clean-sm': '0 1px 2px var(--shadow-panel, rgba(0, 0, 0, 0.5))',
        'clean-md': '0 8px 16px var(--shadow-panel, rgba(0, 0, 0, 0.5))',
        'clean-lg': '0 16px 32px var(--shadow-panel, rgba(0, 0, 0, 0.6))',
      },

      animation: {
        'marquee':   'marquee 30s linear infinite',
        'kodee-float': 'kodee-float 4.2s ease-in-out infinite',
      },

      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'kodee-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-7px) rotate(2.5deg)' },
        },
      },
    },
  },
  plugins: [],
}
