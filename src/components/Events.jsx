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
    <section id="events" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void">
      {/* Title Header with staggered left edge: padding-left 8% */}
      <div className="mb-14 sm:pl-[8%]">
        <div className="section-label">Upcoming Events</div>
        <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] max-w-2xl mb-4">
          Events &amp; <span className="gradient-text">Workshops</span>
        </h2>
        <p className="font-body text-text-muted text-base max-w-lg leading-relaxed">
          Technical sessions, live code labs, and architect breakdowns — free and open to everyone in Coimbatore.
        </p>
      </div>

      {/* Grid: Gap is the Border rule (gap-px with bg-border-mid container) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-mid rounded-sm overflow-hidden mb-12">
        {EVENTS.map((event, idx) => {
          if (event.featured) {
            return (
              <div
                key={idx}
                className="gradient-border bg-surface-2 p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs tracking-widest uppercase text-kotlin-pink">
                      {event.category}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-vivid opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary leading-snug mb-3">
                    {event.title}
                  </h3>
                  <p className="font-body text-sm text-text-muted leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                  <span className="font-mono text-xs text-text-dim">{event.date}</span>
                  <ArrowRight className="w-4 h-4 text-kotlin-indigo group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            )
          }

          return (
            <div
              key={idx}
              className="card-base bg-surface p-6 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-widest uppercase text-text-dim">
                    {event.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-vivid opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary leading-snug mb-3">
                  {event.title}
                </h3>
                <p className="font-body text-sm text-text-muted leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                <span className="font-mono text-xs text-text-dim">{event.date}</span>
                <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-kotlin-indigo group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Call for Speakers Banner: full-width, bg-surface, border border-border, CTA right-aligned */}
      <div className="bg-surface border border-border rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-text-dim block mb-1">
            Community CFP
          </span>
          <h3 className="font-display text-xl font-bold text-text-primary">
            Have a Kotlin project or case study to share?
          </h3>
          <p className="font-body text-sm text-text-muted mt-1 max-w-xl">
            Whether it&apos;s a 15-minute lightning talk or a deep architectural breakdown, we welcome first-time and seasoned speakers alike.
          </p>
        </div>
        <a
          href="mailto:kugcoimbatore@gmail.com?subject=Call%20for%20Speakers%20-%20KUG%20Coimbatore"
          className="gradient-border px-7 py-3.5 rounded-sm font-body font-medium text-sm text-text-body bg-surface transition-all duration-200 hover:bg-surface-2 hover:text-white active:scale-[0.97] select-none inline-flex items-center justify-center shrink-0"
        >
          Submit a Talk
        </a>
      </div>
    </section>
  )
}
