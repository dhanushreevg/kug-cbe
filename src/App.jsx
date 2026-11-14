import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useLenis } from "@/hooks/useLenis"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import Navbar from "@/components/Navbar"
import ParticleHero from "@/components/ParticleHero"
import KodeeStage from "@/components/KodeeStage"
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
import EventNotification from "@/components/EventNotification"

gsap.registerPlugin(ScrollTrigger, SplitText)

const MARQUEE_TEXT = "KOTLIN · COIMBATORE · LEARN · BUILD · SHARE · CONNECT · "

/* The walking Kodee now lives in <KodeeStage /> — its own clipped-proof lane
   between the hero and this marquee band — so the band's overflow-hidden
   (required for the seamless looping track) can never clip the mascot. */

export default function App() {
  useLenis()
  useGsapReveal(".reveal")

  // Mechanical character stagger for section headings
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    // SplitText must be a real constructor (the npm gsap/SplitText exports it
    // correctly; the former alias to src/lib/SplitText.js returned undefined
    // which caused "Z_ is not a constructor").
    if (typeof SplitText !== "function") return

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
      } catch {
        // SplitText is a progressive enhancement — heading text is always
        // visible; no error is logged so the console stays clean.
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
      <EventNotification />
      <Navbar />

      <main>
        {/* Interactive Particle Dissolve Hero */}
        <ParticleHero />

        {/* The mascot's own lane — walker is never clipped here. */}
        <KodeeStage />

        {/* Minimal Solid Marquee Divider (track only; the walker runs above).
            .marquee-band in index.css owns the 12px top/bottom padding. */}
        <div className="relative overflow-hidden bg-surface select-none border-y border-border marquee-band">
          <div className="marquee-track motion-safe:animate-marquee flex w-max whitespace-nowrap font-mono font-bold text-muted uppercase tracking-[0.15em] text-[11px] sm:text-xs">
            <span>{MARQUEE_TEXT.repeat(6)}</span>
            <span aria-hidden="true">{MARQUEE_TEXT.repeat(6)}</span>
          </div>
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
