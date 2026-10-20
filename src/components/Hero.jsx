import { useEffect } from "react"
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import { LiquidHero } from "@/components/LiquidHero"

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
      gsap.fromTo(
        split.chars,
        { opacity: 0, y: 60, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.025,
          delay: 0.2,
        }
      )
      return () => {
        split.revert()
      }
    } catch {
      gsap.fromTo(
        headline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-start overflow-hidden"
    >
      {/* LiquidHero fills the full section background */}
      <LiquidHero className="absolute inset-0" fillFactor={0.7} />

      {/* Gradient overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-kotlin-dark/90 via-kotlin-dark/60 to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-32 flex flex-col gap-8 w-full">
        {/* Eyebrow */}
        <span className="reveal inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm font-mono text-kotlin-purple border border-kotlin-purple/25 w-fit">
          <span className="w-2 h-2 rounded-full bg-kotlin-purple animate-pulse" />
          Kotlin User Group · Coimbatore, Tamil Nadu
        </span>

        {/* Main headline — GSAP SplitText char animation on mount */}
        <h1
          id="hero-headline"
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight max-w-3xl select-none"
        >
          Kotlin<br />
          <span className="text-kotlin-purple">User Group</span><br />
          Coimbatore
        </h1>

        {/* Subheadline */}
        <p className="reveal text-lg md:text-xl text-white/60 max-w-lg leading-relaxed">
          A community of developers, learners, and builders who love Kotlin — based
          in Coimbatore, Tamil Nadu.
        </p>

        {/* CTAs */}
        <div className="reveal flex flex-wrap gap-4 mt-2">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn rounded-full px-6 py-3 font-semibold text-kotlin-purple text-base inline-flex items-center gap-2"
          >
            <span>Join the Group</span>
            <span>→</span>
          </a>
          <a
            href="#events"
            className="rounded-full px-6 py-3 font-semibold text-base text-white/70 border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
          >
            <span>Upcoming Events</span>
            <span>↓</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
        <span className="text-xs font-mono tracking-widest uppercase">
          scroll
        </span>
        <div className="w-px h-10 bg-white/30 animate-pulse" />
      </div>
    </section>
  )
}
