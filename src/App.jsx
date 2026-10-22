import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useLenis } from "@/hooks/useLenis"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Events from "@/components/Events"
import KodeeShowcase from "@/components/KodeeShowcase"
import Resources from "@/components/Resources"
import About from "@/components/About"
import Community from "@/components/Community"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import KodeeCompanion from "@/components/KodeeCompanion"
import PageLoader from "@/components/PageLoader"

gsap.registerPlugin(ScrollTrigger, SplitText)

const MARQUEE_ITEMS = [
  { text: "Kotlin 2.0", icon: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-happy.gif" },
  { text: "Android Studio", icon: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-petite-56px-24px.svg" },
  { text: "Jetpack Compose", icon: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-floating.gif" },
  { text: "Kotlin Multiplatform", icon: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-walking.gif" },
  { text: "Coroutines & Flow", icon: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-electrified.png" },
  { text: "KUG Coimbatore", icon: "/assets/kotlin_mascot_2/Digital/Emoji/kodee-greetings.gif" },
  { text: "Server-side & Ktor", icon: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png" },
  { text: "Community Powered", icon: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-loving.png" },
]

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
      duration: 25,
      ease: "none",
      repeat: -1,
    })

    return () => {
      anim.kill()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-kotlin-dark text-white selection:bg-kotlin-purple selection:text-white">
      <PageLoader onFinish={() => ScrollTrigger.refresh()} />
      <Navbar />
      <main>
        <Hero />

        {/* Marquee divider with animated Kodee emojis */}
        <div className="overflow-hidden py-4 border-y border-white/5 bg-kotlin-surface/30">
          <div className="marquee-track flex whitespace-nowrap gap-10 text-xs sm:text-sm font-mono text-kotlin-purple/85 uppercase tracking-widest items-center">
            {/* Duplicated for seamless loop */}
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2.5">
                <img
                  src={item.icon}
                  alt={item.text}
                  className="w-5 h-5 object-contain inline-block"
                />
                <span>{item.text}</span>
                <span className="text-white/20 ml-2">✦</span>
              </span>
            ))}
          </div>
        </div>

        <Events />
        <KodeeShowcase />
        <About />
        <Community />
        <Resources />
        <Contact />
      </main>
      <Footer />
      <KodeeCompanion />
    </div>
  )
}
