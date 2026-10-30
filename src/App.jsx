import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useLenis } from "@/hooks/useLenis"
import { useGsapReveal } from "@/hooks/useGsapReveal"
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs"

import Navbar from "@/components/Navbar"
import ParticleHero from "@/components/ParticleHero"
import Events from "@/components/Events"
import KodeeShowcase from "@/components/KodeeShowcase"
import KodeeArcade from "@/components/KodeeArcade"
import About from "@/components/About"
import Community from "@/components/Community"
import Resources from "@/components/Resources"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import KodeeCompanion from "@/components/KodeeCompanion"
import PageLoader from "@/components/PageLoader"
import KodeeGif, { KODEE_GIFS, KODEE_FRAMES } from "@/components/KodeeGif"

gsap.registerPlugin(ScrollTrigger, SplitText)

const MARQUEE_TEXT = "KOTLIN · COIMBATORE · LEARN · BUILD · SHARE · CONNECT · "

/* ─── Walking Kodee ────────────────────────────────────────────────────────
   Kodee walks along the marquee divider under the hero. The x position is
   scrubbed by ScrollTrigger while the divider travels between "just entered
   the viewport" and "pinned at the top" — one full viewport of scroll.
   On mobile the Kodee renders at 64px; under reduced motion it becomes a
   static frame leaning at the left edge (no scrub). */
function WalkingKodee() {
  const walkerRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined
    const el = walkerRef.current
    if (!el) return undefined

    const tween = gsap.fromTo(
      el,
      { x: -72 },
      {
        x: () => (el.parentElement ? el.parentElement.offsetWidth + 72 : window.innerWidth + 72),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "top top",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      }
    )

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill()
      tween.kill()
      gsap.set(el, { clearProps: "x" })
    }
  }, [reducedMotion])

  return (
    <span
      ref={walkerRef}
      className={`pointer-events-none absolute bottom-1.5 z-10 select-none ${
        reducedMotion ? "left-[8%]" : "left-0 will-change-transform"
      }`}
      aria-hidden="true"
    >
      <KodeeGif
        gif={KODEE_GIFS.walking}
        frame={KODEE_FRAMES.petite}
        alt=""
        eager
        className="h-16 w-16 sm:h-14 sm:w-14 object-contain"
      />
    </span>
  )
}

export default function App() {
  useLenis()
  useGsapReveal(".reveal")

  // Mechanical character stagger for section headings
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const headings = document.querySelectorAll("h2.section-heading")
    const splits = []
    const triggers = []

    headings.forEach((h) => {
      try {
        const split = new SplitText(h, { type: "chars" })
        splits.push(split)
        const anim = gsap.from(split.chars, {
          opacity: 0,
          duration: 0.03,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: h,
            start: "top 85%",
          },
        })
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
      } catch (err) {
        console.warn("SplitText heading fallback:", err)
      }
    })

    return () => {
      triggers.forEach((t) => t.kill())
      splits.forEach((s) => s.revert())
    }
  }, [])

  // Marquee: the track loops with the compositor-run `animate-marquee`
  // keyframe (translateX 0 → -50%, identical seam math to the former GSAP
  // tween) instead of a 25 s main-thread style write every frame. Reduced
  // motion leaves it static via motion-safe.

  return (
    <div className="relative min-h-screen bg-void text-body">
      <PageLoader onFinish={() => ScrollTrigger.refresh()} />
      <Navbar />

      <main>
        {/* Interactive Particle Dissolve Hero */}
        <ParticleHero />

        {/* Minimal Solid Marquee Divider + walking Kodee */}
        <div className="relative overflow-hidden py-3 bg-surface select-none border-y border-border marquee-band">
          <div className="marquee-track motion-safe:animate-marquee flex w-max whitespace-nowrap text-xs font-mono font-bold text-muted uppercase tracking-[0.15em]">
            <span>{MARQUEE_TEXT.repeat(6)}</span>
            <span aria-hidden="true">{MARQUEE_TEXT.repeat(6)}</span>
          </div>
          <WalkingKodee />
        </div>

        <Events />
        <div className="border-t border-border" />

        <KodeeShowcase />
        <div className="border-t border-border" />

        <KodeeArcade />
        <div className="border-t border-border" />

        <About />
        <div className="border-t border-border" />

        <Community />
        <div className="border-t border-border" />

        <Resources />
        <div className="border-t border-border" />

        <Contact />
      </main>

      <Footer />
      <KodeeCompanion />
    </div>
  )
}
