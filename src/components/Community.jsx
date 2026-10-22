import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Community() {
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const triggers = []
    const statElements = document.querySelectorAll(".stat-number")

    statElements.forEach((el) => {
      const end = parseInt(el.dataset.end, 10) || 0
      const suffix = el.dataset.suffix || ""

      if (reduceMotion) {
        el.textContent = end + suffix
        return
      }

      const obj = { val: 0 }
      const anim = gsap.fromTo(
        obj,
        { val: 0 },
        {
          val: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix
          },
        }
      )
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section id="community" className="py-28 px-6 md:px-12">
      {/* Full-width glass band */}
      <div className="glass border-y border-kotlin-purple/10 py-20 max-w-7xl mx-auto rounded-3xl px-10">
        <div className="text-center mb-14">
          <div className="reveal relative w-fit mx-auto mb-4">
            <div className="absolute inset-0 mascot-glow rounded-full scale-125 pointer-events-none -z-10 animate-pulse-glow" />
            <img
              src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-in-love.svg"
              alt="Kodee in love"
              className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto animate-float"
            />
          </div>
          <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-kotlin-purple" />
            Growing Together
          </span>
          <h2 className="reveal text-4xl md:text-6xl font-bold mt-3">
            Be Part of the <span className="kotlin-gradient-text">Community</span>
          </h2>
          <p className="reveal text-white/60 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            We are just getting started. Join our group, attend local meetups, and help shape Coimbatore’s premier Kotlin hub!
          </p>
        </div>

        {/* Stats */}
        <div className="reveal flex flex-wrap justify-center gap-12 mb-14">
          {[
            { end: 0, suffix: "+", label: "Members" },
            { end: 0, suffix: "+", label: "Events Hosted" },
            { end: 1, suffix: "", label: "City" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="stat-number text-5xl md:text-6xl font-bold text-kotlin-purple tabular-nums"
                data-end={stat.end}
                data-suffix={stat.suffix}
              >
                {stat.end}
                {stat.suffix}
              </div>
              <div className="text-sm text-white/45 font-mono uppercase tracking-widest mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal flex justify-center">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn rounded-full px-8 py-4 font-semibold text-kotlin-purple text-base inline-flex items-center gap-2"
          >
            <span>Join KUG Coimbatore</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
