const STATS = [
  { number: "250+", label: "Engineers in Network" },
  { number: "01", label: "Metro Chapter (CBE)" },
  { number: "100%", label: "Free & Open Source" },
  { number: "2.0", label: "Compiler Era" },
]

export default function Community() {
  return (
    <section id="community" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void">
      <div className="mb-14 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="section-label">Community Metrics</div>
          <h2 className="section-heading font-display font-bold text-fg text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
            Built by Developers, for Developers
          </h2>
          <p className="font-body text-body text-base max-w-2xl leading-relaxed">
            From independent software vendors to college research groups and enterprise engineering teams across Coimbatore, we are creating a home for pragmatic programmers.
          </p>
        </div>

        {/* kodee-in-love.png beside the heading; grayscale-to-colour hover kept */}
        <img
          src="/assets/kotlin_mascot_2/Digital/PNG/Kodee-in-love-96.png"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          width={96}
          height={96}
          className="kodee-img h-12 w-12 sm:h-16 sm:w-16 shrink-0 object-contain select-none"
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
            RSVP for upcoming technical meetups, collaborate on open-source Kotlin experiments, and connect directly with local engineers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-body font-medium text-sm text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center gap-2 shadow-sm"
          >
            Register with Group
          </a>
          <a
            href="https://slack-chats.kotlinlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-body font-medium text-sm text-body hover:text-fg bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center gap-2"
          >
            Global Slack
          </a>
        </div>
      </div>
    </section>
  )
}
