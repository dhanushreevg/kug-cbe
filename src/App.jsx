import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useLenis } from "@/hooks/useLenis"
import { useGsapReveal } from "@/hooks/useGsapReveal"

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

gsap.registerPlugin(ScrollTrigger, SplitText)

const MARQUEE_TEXT = "KOTLIN · COIMBATORE · LEARN · BUILD · SHARE · CONNECT · "

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

  // Marquee animation
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const track = document.querySelector(".marquee-track")
    if (!track) return

    const anim = gsap.to(track, {
      xPercent: -50,
      duration: 25,
      ease: "none",
      repeat: -1,
    })

    return () => {
      anim.kill()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050506] text-[#d4d4d4] selection:bg-white/20 selection:text-white">
      <PageLoader onFinish={() => ScrollTrigger.refresh()} />
      <Navbar />

      <main>
        {/* Interactive Particle Dissolve Hero */}
        <ParticleHero />

        {/* Minimal Solid Marquee Divider */}
        <div className="overflow-hidden py-3 bg-[#111111] select-none border-y border-white/[0.08]">
          <div className="marquee-track flex whitespace-nowrap text-xs font-mono font-bold text-[#8a8a8a] uppercase tracking-[0.15em]">
            <span>{MARQUEE_TEXT.repeat(12)}</span>
          </div>
        </div>

        <Events />
        <div className="border-t border-white/[0.08]" />

        <KodeeShowcase />
        <div className="border-t border-white/[0.08]" />

        <KodeeArcade />
        <div className="border-t border-white/[0.08]" />

        <About />
        <div className="border-t border-white/[0.08]" />

        <Community />
        <div className="border-t border-white/[0.08]" />

        <Resources />
        <div className="border-t border-white/[0.08]" />

        <Contact />
      </main>

      <Footer />
      <KodeeCompanion />
    </div>
  )
}
