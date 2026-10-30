const ArrowRight = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const EVENTS = [
  {
    category: "Featured Meetup",
    title: "KUG Coimbatore Kickoff: Kotlin 2.0 & Beyond",
    description: "The inaugural in-person gathering for Kotlin engineers in Coimbatore. Deep dive into K2 compiler performance, coroutines, and community roadmap.",
    date: "November 2024 · CBE",
    featured: true,
  },
  {
    category: "Hands-on Workshop",
    title: "Kotlin Multiplatform: Compose Across Platforms",
    description: "Build a single codebase that runs seamlessly across Android, iOS, and Desktop with shared Kotlin logic and declarative Compose UI.",
    date: "December 2024 · Hands-on",
    featured: false,
  },
  {
    category: "Deep Dive Talk",
    title: "High-Throughput Backends with Ktor & Coroutines",
    description: "Master non-blocking asynchronous servers, structured concurrency, and resilience patterns using Ktor and Kotlin Flow in production.",
    date: "January 2025 · Online",
    featured: false,
  },
]

export default function Events() {
  return (
    <section id="events" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-[#050506]">
      {/* Title Header with staggered left edge: padding-left 8% */}
      <div className="mb-14 sm:pl-[8%]">
        <div className="section-label">Upcoming Events</div>
        <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] max-w-2xl mb-4">
          Events &amp; Workshops
        </h2>
        <p className="font-body text-[#8a8a8a] text-base max-w-lg leading-relaxed">
          Technical sessions, live code labs, and architect breakdowns — free and open to everyone in Coimbatore.
        </p>
      </div>

      {/* Grid: 3 cards, solid surfaces, 12px radius, 1px border rgba(255,255,255,0.08) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {EVENTS.map((event, idx) => (
          <div
            key={idx}
            className={`p-7 rounded-xl flex flex-col justify-between group cursor-pointer transition-all duration-200 border ${
              event.featured
                ? "bg-[#141414] border-white/[0.14] hover:border-white/[0.25]"
                : "bg-[#111111] border-white/[0.08] hover:border-white/[0.16]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-[#8a8a8a]">
                  {event.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <h3 className="font-display text-lg font-bold text-white leading-snug mb-3">
                {event.title}
              </h3>
              <p className="font-body text-sm text-[#8a8a8a] leading-relaxed mb-6">
                {event.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 mt-auto">
              <span className="font-mono text-xs text-[#666666]">{event.date}</span>
              <ArrowRight className="w-4 h-4 text-[#8a8a8a] group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Call for Speakers Banner: solid #111111, 12px radius, 1px border */}
      <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-[#666666] block mb-1">
            Community CFP
          </span>
          <h3 className="font-display text-xl font-bold text-white">
            Have a Kotlin project or case study to share?
          </h3>
          <p className="font-body text-sm text-[#8a8a8a] mt-1 max-w-xl">
            Whether it&apos;s a 15-minute lightning talk or a deep architectural breakdown, we welcome first-time and seasoned speakers alike.
          </p>
        </div>
        <a
          href="mailto:kugcoimbatore@gmail.com?subject=Call%20for%20Speakers%20-%20KUG%20Coimbatore"
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-[#d4d4d4] hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.08] transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center shrink-0"
        >
          Submit a Talk
        </a>
      </div>
    </section>
  )
}
