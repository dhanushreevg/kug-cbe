import SectionHeader from "@/components/SectionHeader"
import { COMMUNITY_LINKS } from "@/config/links"

const STATS = [
  { number: "250+", label: "Engineers in Network" },
  { number: "01", label: "Metro Chapter (CBE)" },
  { number: "100%", label: "Free & Open Source" },
  { number: "2.0", label: "Compiler Era" },
]

export default function Community() {
  return (
    <section
      id="community"
      className="max-w-7xl mx-auto bg-void px-5 sm:px-10 lg:px-16 py-[clamp(4rem,8vw,8rem)]"
    >
      <div className="relative mb-14">
        {/* kodee-in-love.png beside the heading — full colour always; hover
            (desktop) only adds a gentle scale, never a colour change. */}
        <img
          src="/assets/kotlin_mascot_2/Digital/PNG/Kodee-in-love-96.png"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          width={96}
          height={96}
          className="kodee-img pointer-events-none absolute -top-3 right-0 h-12 w-12 sm:h-16 sm:w-16 shrink-0 object-contain select-none"
        />
        <SectionHeader
          num="05"
          label="Community Metrics"
          title="Built by Developers, for Developers"
          lede="From independent software vendors to college research groups and enterprise engineering teams across Coimbatore, we are creating a home for pragmatic programmers."
          className="pr-16 sm:pr-20"
        />
      </div>

      {/* 4-column Stats Grid with solid dividers on solid #111111 */}
      <div className="bg-surface grid grid-cols-2 lg:grid-cols-4 border border-border mb-16 rounded-xl overflow-hidden">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`p-5 sm:p-8 flex flex-col justify-center border-border ${
              i < 2 ? "border-b" : ""
            } ${i % 2 === 0 ? "border-r" : ""} lg:border-b-0 ${
              i < STATS.length - 1 ? "lg:border-r" : ""
            }`}
          >
            <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-fg mb-2 tabular-nums">
              {stat.number}
            </div>
            <div className="font-mono text-xs tracking-widest uppercase text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Join the Movement Card with Solid CTAs */}
      <div className="bg-surface border border-border rounded-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-muted block mb-2">
            Get Involved
          </span>
          <h3 className="font-display text-2xl font-bold text-fg mb-3">
            Join the Coimbatore Kotlin User Group
          </h3>
          <p className="font-body text-sm text-muted leading-relaxed">
            Connect directly with local developers in our official LinkedIn community group, register for upcoming hands-on sessions on Luma, and build together.
          </p>
        </div>

        {/* CTAs stack full-width on mobile, side by side from sm. */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 md:w-auto md:shrink-0">
          <a
            href={COMMUNITY_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center gap-2"
          >
            Join WhatsApp Community
          </a>
          <a
            href={COMMUNITY_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center gap-2"
          >
            Follow on LinkedIn
          </a>
          <a
            href={COMMUNITY_LINKS.volunteer}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center gap-2"
          >
            Volunteer Sign Up
          </a>
          <a
            href="https://luma.com/7kvusrr5"
            target="_blank"
            rel="noopener noreferrer"
            className="tap-44 w-full sm:w-auto px-6 py-3 rounded-xl font-body font-medium text-sm text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center justify-center gap-2"
          >
            Events on Luma
          </a>
        </div>
      </div>
    </section>
  )
}
