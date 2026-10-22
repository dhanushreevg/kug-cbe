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
          coral:   "#FE2857",
          orange:  "#F88909",
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
        "float":      "float 4s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "wiggle":     "wiggle 0.8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: "translateY(32px)" },
                   to:   { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        marquee: { from: { transform: "translateX(0)" },
                   to:   { transform: "translateX(-50%)" } },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.35, transform: "scale(1)" },
          "50%": { opacity: 0.7, transform: "scale(1.08)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
}
