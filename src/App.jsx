import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useLenis } from "@/hooks/useLenis"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Events from "@/components/Events"
import Resources from "@/components/Resources"
import About from "@/components/About"
import Community from "@/components/Community"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function App() {
  useLenis()
  useGsapReveal(".reveal")

  // Liquid heading effect on h2 elements
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const headings = document.querySelectorAll("h2")
    const splits = []
    const triggers = []

    headings.forEach((h) => {
      try {
        const split = new SplitText(h, { type: "chars,words" })
        splits.push(split)
        const anim = gsap.fromTo(
          split.chars,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            stagger: { each: 0.03, from: "start" },
            scrollTrigger: {
              trigger: h,
              start: "top 85%",
            },
          }
        )
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
      } catch (err) {
        console.warn("SplitText error on heading:", err)
      }
    })

    return () => {
      triggers.forEach((t) => t.kill())
      splits.forEach((s) => s.revert())
    }
  }, [])

  // Horizontal marquee on the divider band
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const track = document.querySelector(".marquee-track")
    if (!track) return
    const anim = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    })

    return () => {
      anim.kill()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-kotlin-dark text-white">
      <Navbar />
      <main>
        <Hero />

        {/* Marquee divider */}
        <div className="overflow-hidden py-4 border-y border-white/5">
          <div className="marquee-track flex whitespace-nowrap gap-12 text-sm font-mono text-kotlin-purple/70 uppercase tracking-widest">
            {Array(8)
              .fill(
                "Kotlin · Android · Multiplatform · Coroutines · Compose · JVM · Backend · KUG CBE ·"
              )
              .map((t, i) => (
                <span key={i}>{t}</span>
              ))}
          </div>
        </div>

        <Events />
        <Resources />
        <About />
        <Community />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
