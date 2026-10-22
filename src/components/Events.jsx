import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const events = [
  {
    tag: "Meetup",
    title: "KUG CBE Kickoff Meetup",
    meta: "Coming Soon · Coimbatore",
    desc: "Our first in-person gathering — talks, demos, and networking for Kotlin enthusiasts across CBE.",
    href: "#",
  },
  {
    tag: "Workshop",
    title: "Kotlin for Android Beginners",
    meta: "Coming Soon · Online",
    desc: "Hands-on introduction to Kotlin for Android development. No prior experience needed.",
    href: "#",
  },
  {
    tag: "Talk",
    title: "Coroutines Deep Dive",
    meta: "Coming Soon · Online",
    desc: "A technical session on Kotlin coroutines, flows, and async patterns in production apps.",
    href: "#",
  },
]

export default function Events() {
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) return

    const triggers = []
    const cards = gsap.utils.toArray(".event-card")
    cards.forEach((card, i) => {
      const anim = gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
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
    <section id="events" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-kotlin-purple" />
            Upcoming Community Gatherings
          </span>
          <h2 className="reveal text-4xl md:text-6xl font-bold mt-2">
            Events & <span className="kotlin-gradient-text">Workshops</span>
          </h2>
          <p className="reveal text-white/60 mt-4 max-w-xl text-base leading-relaxed">
            Meetups, workshops, and deep-dives — free and open to all developers, students, and engineers in Coimbatore.
          </p>
        </div>

        {/* Kodee Meetup Teaser Card */}
        <div className="reveal glass rounded-2xl p-4 flex items-center gap-4 border-kotlin-purple/25 max-w-sm shrink-0 shadow-lg shadow-kotlin-purple/5">
          <img
            src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-jumping.svg"
            alt="Kodee jumping"
            className="w-16 h-16 object-contain animate-float shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-white">First Meetup Loading!</span>
            <span className="text-xs text-white/50">
              Coimbatore in-person venue announcements coming soon.
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev, i) => (
          <div
            key={i}
            className="reveal event-card glass-card p-7 flex flex-col justify-between gap-4 group hover:border-kotlin-purple/50"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kotlin-purple bg-kotlin-purple/15 border border-kotlin-purple/30 rounded-full px-3 py-1 w-fit">
                  {ev.tag}
                </span>
                <span className="text-xs text-white/40 font-mono">{ev.meta}</span>
              </div>
              <h3 className="text-xl font-bold leading-snug group-hover:text-kotlin-light transition-colors">
                {ev.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {ev.desc}
              </p>
            </div>
            <a
              href={ev.href}
              className="mt-2 text-sm font-semibold text-kotlin-purple hover:text-kotlin-light transition-colors inline-flex items-center gap-1.5 pt-3 border-t border-white/5"
            >
              <span>RSVP Interest</span>
              <span>→</span>
            </a>
          </div>
        ))}
      </div>

      {/* Call for Speakers Banner with Kodee Sharing */}
      <div className="reveal mt-12 glass rounded-3xl p-8 md:p-10 border-kotlin-purple/20 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-kotlin-surface/60 via-kotlin-surface/40 to-kotlin-purple/10">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img
            src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sharing.svg"
            alt="Kodee sharing knowledge"
            className="w-24 h-24 object-contain animate-float shrink-0"
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono text-kotlin-light uppercase tracking-wider">
              Call For Speakers · Coimbatore
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Have something cool built in Kotlin?
            </h3>
            <p className="text-sm text-white/60 max-w-xl">
              We welcome first-time and seasoned speakers alike. Share your Android, Compose, KMP, Coroutines, or Backend experiences with the local community!
            </p>
          </div>
        </div>
        <a
          href="mailto:kugcoimbatore@gmail.com?subject=KUG%20CBE%20Speaker%20Proposal"
          className="glass-btn shrink-0 rounded-full px-6 py-3.5 font-semibold text-kotlin-purple text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Submit Talk Proposal</span>
          <span>🎤</span>
        </a>
      </div>
    </section>
  )
}
