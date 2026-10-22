import { useEffect } from "react"
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import LiquidHero from "@/components/LiquidHero"

export default function Hero() {
  useEffect(() => {
    const headline = document.getElementById("hero-headline")
    if (!headline) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      headline.style.opacity = "1"
      return
    }

    try {
      const split = new SplitText(headline, { type: "chars" })
      gsap.from(split.chars, {
        opacity: 0,
        duration: 0.03,
        stagger: 0.025,
        ease: "none",
        delay: 0.2,
      })
      return () => {
        split.revert()
      }
    } catch {
      // Fallback if SplitText is unavailable
      gsap.fromTo(
        headline,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "none", delay: 0.2 }
      )
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen overflow-hidden bg-void flex items-center"
      style={{ isolation: "isolate" }}
    >
      {/* z-0: Three.js canvas filling 100% of the section */}
      <LiquidHero
        imagePath="/assets/kug-logo.png"
        imageAlign="right"
        fillFactor={0.52}
      />

      {/* z-10: actual hero content with staggered left edge (padding-left 6%) */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 sm:pl-[6%]">
        {/* Section label */}
        <div className="section-label mb-6">Kotlin User Group · Coimbatore</div>

        {/* Main headline — deliberate breaks */}
        <h1
          id="hero-headline"
          className="font-display font-bold text-white text-[clamp(3rem,8vw,6.5rem)] leading-[0.90] tracking-[-0.04em] max-w-4xl mb-6 select-none"
        >
          Build with<br />
          <span className="gradient-text">Kotlin.</span><br />
          Together.
        </h1>

        {/* Subline */}
        <p className="font-body text-text-muted text-lg max-w-lg leading-relaxed mb-10">
          A developer community in Coimbatore exploring
          Kotlin — from mobile to backend to multiplatform.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#community"
            className="relative px-7 py-3.5 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin overflow-hidden transition-all duration-200 hover:brightness-110 hover:shadow-kotlin-md active:scale-[0.97] active:brightness-90 select-none inline-flex items-center gap-2"
          >
            Join the Group
          </a>
          <a
            href="#events"
            className="gradient-border px-7 py-3.5 rounded-sm font-body font-medium text-sm text-text-body bg-surface transition-all duration-200 hover:bg-surface-2 hover:text-white active:scale-[0.97] select-none inline-flex items-center gap-2"
          >
            View Events
          </a>
        </div>
      </div>

      {/* Faint radial glow behind headline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow pointer-events-none z-0" />
    </section>
  )
}
