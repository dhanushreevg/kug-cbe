/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        kotlin: {
          purple:  "#7F52FF",
          light:   "#B69CFF",
          dark:    "#1B1B1F",
          surface: "#27272B",
          muted:   "#3D3D42",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.5s ease forwards",
        "marquee":    "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: "translateY(32px)" },
                   to:   { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        marquee: { from: { transform: "translateX(0)" },
                   to:   { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
}
