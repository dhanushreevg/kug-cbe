import { useEffect } from "react"
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import { LiquidHero } from "@/components/LiquidHero"
import HeroMascotCard from "@/components/HeroMascotCard"

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
      className="relative w-full min-h-screen flex items-center justify-start overflow-hidden pt-16 md:pt-0"
    >
      {/* LiquidHero fills the full section background */}
      <LiquidHero className="absolute inset-0" fillFactor={0.7} />

      {/* Gradient overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-kotlin-dark/95 via-kotlin-dark/75 to-transparent z-10 pointer-events-none" />

      {/* 2-Column Responsive Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-7">
          {/* Eyebrow */}
          <div className="reveal inline-flex items-center gap-2.5 glass rounded-full px-4 py-1.5 text-xs sm:text-sm font-mono text-kotlin-purple border border-kotlin-purple/25 w-fit">
            <span className="w-2 h-2 rounded-full bg-kotlin-purple animate-pulse" />
            <span>Kotlin User Group · Coimbatore, Tamil Nadu</span>
          </div>

          {/* Main headline — GSAP SplitText char animation on mount */}
          <h1
            id="hero-headline"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight max-w-3xl select-none"
          >
            Kotlin<br />
            <span className="kotlin-gradient-text">User Group</span><br />
            Coimbatore
          </h1>

          {/* Subheadline */}
          <p className="reveal text-base sm:text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
            A vibrant community of developers, learners, and builders passionate about
            Kotlin, Android, Multiplatform, and Server-side engineering — based in Coimbatore.
          </p>

          {/* Quick Perks / Badges */}
          <div className="reveal flex flex-wrap items-center gap-3 text-xs font-mono text-white/50">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <span className="text-kotlin-coral">✦</span> JetBrains Recognized
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <span className="text-kotlin-light">✦</span> Free & Open For All
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <span className="text-kotlin-orange">✦</span> Hands-on Sessions
            </span>
          </div>

          {/* CTAs */}
          <div className="reveal flex flex-wrap gap-4 mt-2">
            <a
              href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn rounded-full px-6 py-3.5 font-semibold text-kotlin-purple text-base inline-flex items-center gap-2 shadow-lg shadow-kotlin-purple/20"
            >
              <span>Join KUG CBE</span>
              <span>→</span>
            </a>
            <a
              href="#events"
              className="rounded-full px-6 py-3.5 font-semibold text-base text-white/80 border border-white/10 hover:border-kotlin-purple/50 hover:text-white transition-all duration-300 inline-flex items-center gap-2 bg-white/5 hover:bg-white/10"
            >
              <span>Explore Events</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Right Column: Hero Mascot Card */}
        <div className="lg:col-span-5 flex justify-center items-center w-full">
          <HeroMascotCard />
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
