import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@/..." maps to src/
      "@": path.resolve(__dirname, "./src"),
      // gsap/SplitText is resolved from the npm package (node_modules/gsap/SplitText.js).
      // The local src/lib/SplitText.js is an IIFE that never assigns SplitText onto its
      // exportsObj, so the named export was always undefined → "Z_ is not a constructor".
      // The npm package exports { SplitText, SplitText as default } correctly.
    },
  },
})
