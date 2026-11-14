import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs"
import KodeeGif, { KODEE_GIFS, KODEE_FRAMES } from "@/components/KodeeGif"
import SectionHeader from "@/components/SectionHeader"

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

const LUMA_EVENT_URL = "https://luma.com/7kvusrr5"

const EVENTS = [
  {
    category: "Featured Meetup",
    title: "KUG Coimbatore Kickoff: Kotlin 2.0 & Beyond",
    description: "Join Kotlin developers in Coimbatore for an in-person community meetup focused on learning, collaboration, and building together.",
    date: "December 20, 2026 · CBE",
    featured: true,
    rsvpStatus: "live",
    href: LUMA_EVENT_URL,
  },
  {
    category: "Flagship Event",
    title: "January 5, 2027: KUG Coimbatore Flagship Event",
    description: "A bigger community event focused on technology, innovation, collaboration, and exciting learning opportunities. These events are important steps towards building a strong and active developer community in Coimbatore.",
    date: "January 5, 2027",
    featured: false,
    rsvpStatus: "coming_soon",
  },
]

export default function Events() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="events"
      className="max-w-7xl mx-auto bg-void px-5 sm:px-10 lg:px-16 py-[var(--section-gap)]"
    >
      {/* Editorial header: numbered rail + heading, staggered left edge kept. */}
      <div className="relative mb-10 sm:mb-14 sm:pl-[8%]">
        {/* kodee-floating.gif: decorative header accent, 25% opacity, gentle
            CSS float. Hidden entirely under reduced motion. */}
        {!reducedMotion && (
          <KodeeGif
            gif={KODEE_GIFS.floating}
            frame={KODEE_FRAMES.petite}
            alt=""
            eager
            aria-hidden="true"
            className="kodee-float pointer-events-none absolute -top-2 right-0 z-0 h-14 w-14 opacity-25 sm:right-16 lg:-right-4 lg:h-16 lg:w-16"
          />
        )}
        <SectionHeader
          num="01"
          label="Upcoming Events"
          title="Events & Workshops"
          lede="Technical sessions, live code labs, and architect breakdowns — free and open to everyone in Coimbatore. Event registrations and schedule updates live on Luma."
        />
      </div>

      {/* Grid: 1 col mobile → 2 tablet → 3 lg, solid surfaces, 12px radius.
          Cards are editorial: numbered index, and an always-visible RSVP
          affordance for touch. rsvpStatus drives whether that affordance is
          the live Luma link or an inactive "Coming Soon" label. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {EVENTS.map((event, idx) => (
          <div
            key={idx}
            className={`p-7 rounded-xl flex flex-col justify-between transition-all duration-200 border ${
              event.featured
                ? "bg-surface-2 border-border-mid"
                : "bg-surface border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-muted">
                  {event.category}
                </span>
                <span className="font-mono text-xs tabular-nums text-dim">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-fg leading-snug mb-3">
                {event.title}
              </h3>
              <p className="body-copy font-body text-muted leading-relaxed mb-6">
                {event.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4 mt-auto">
              <span className="font-mono text-xs text-dim">{event.date}</span>
              {event.rsvpStatus === "coming_soon" ? (
                <span className="inline-flex items-center whitespace-nowrap rounded-md font-mono text-xs uppercase tracking-[0.14em] text-muted select-none">
                  Coming Soon
                </span>
              ) : (
                <a
                  href={event.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-44 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md font-mono text-xs uppercase tracking-[0.14em] text-body transition-colors duration-150 hover:text-fg focus-visible:text-fg active:text-fg"
                >
                  REGISTER ON LUMA
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mb-6">
        <p className="font-body text-base text-muted leading-relaxed max-w-4xl">
          We will be discussing the event ideas, planning, responsibilities, and preparations together. Let&apos;s work as a team, share ideas, and make both events successful! Let&apos;s build something amazing together!
        </p>
        <p className="font-mono text-xs tracking-widest uppercase text-dim mt-4">
          KUG Coimbatore Organizing Team
        </p>
      </div>

      {/* Luma Event Updates Callout */}
      <div className="bg-surface-2 border border-border-strong rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 text-accent">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14h.01"/>
              <path d="M12 14h.01"/>
              <path d="M16 14h.01"/>
              <path d="M8 18h.01"/>
              <path d="M12 18h.01"/>
            </svg>
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-dim block mb-1">
              Live Schedule &amp; RSVPs
            </span>
            <h3 className="font-display text-xl font-bold text-fg">
              Follow KUG Coimbatore on Luma
            </h3>
            <p className="font-body text-sm text-muted mt-1 max-w-xl">
              Get instant notifications for new meetups, speaker announcements, venue coordinates, and direct calendar sync.
            </p>
          </div>
        </div>
        <a
          href={LUMA_EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center gap-2 shrink-0"
        >
          <span>View on Luma</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Call for Speakers Banner: solid surface, 12px radius, 1px border */}
      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-dim block mb-1">
            Community CFP
          </span>
          <h3 className="font-display text-xl font-bold text-fg">
            Have a Kotlin project or case study to share?
          </h3>
          <p className="font-body text-sm text-muted mt-1 max-w-xl">
            Whether it&apos;s a 15-minute lightning talk or a deep architectural breakdown, we welcome first-time and seasoned speakers alike.
          </p>
        </div>
        <a
          href="mailto:kugcoimbatore@gmail.com?subject=Call%20for%20Speakers%20-%20KUG%20Coimbatore"
          className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center shrink-0"
        >
          Submit a Talk
        </a>
      </div>
    </section>
  )
}
