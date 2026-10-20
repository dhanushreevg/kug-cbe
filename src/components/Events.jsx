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
      <div className="mb-16">
        <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase">
          Upcoming
        </span>
        <h2 className="reveal text-4xl md:text-6xl font-bold mt-2">
          Events
        </h2>
        <p className="reveal text-white/50 mt-4 max-w-xl">
          Meetups, workshops, and talks — free and open to everyone in Coimbatore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((ev, i) => (
          <div
            key={i}
            className="reveal event-card glass-card p-6 flex flex-col gap-3"
          >
            <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kotlin-purple bg-kotlin-purple/10 rounded-full px-3 py-1 w-fit">
              {ev.tag}
            </span>
            <h3 className="text-xl font-semibold leading-snug">{ev.title}</h3>
            <p className="text-sm text-white/40 font-mono">{ev.meta}</p>
            <p className="text-sm text-white/55 leading-relaxed flex-1">
              {ev.desc}
            </p>
            <a
              href={ev.href}
              className="mt-2 text-sm font-semibold text-kotlin-purple hover:text-kotlin-light transition-colors inline-flex items-center gap-1"
            >
              <span>RSVP</span>
              <span>→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
