const STATS = [
  { number: "250+", label: "Engineers in Network" },
  { number: "01", label: "Metro Chapter (CBE)" },
  { number: "100%", label: "Free & Open Source" },
  { number: "2.0", label: "Compiler Era" },
]

export default function Community() {
  return (
    <section id="community" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void">
      <div className="mb-14">
        <div className="section-label">Community Metrics</div>
        <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
          Built by <span className="gradient-text">Developers</span>, for Developers
        </h2>
        <p className="font-body text-text-body text-base max-w-2xl leading-relaxed">
          From independent software vendors to college research groups and enterprise engineering teams across Coimbatore, we are creating a home for pragmatic programmers.
        </p>
      </div>

      {/* 4-column Stats Grid with dividers on bg-surface */}
      <div className="bg-surface grid grid-cols-2 lg:grid-cols-4 border-l border-t border-border mb-16 rounded-sm overflow-hidden">
        {STATS.map((stat, i) => (
          <div key={i} className="border-r border-b border-border p-8 flex flex-col justify-center">
            <div className="font-mono text-4xl sm:text-5xl font-bold gradient-text mb-2 tabular-nums">
              {stat.number}
            </div>
            <div className="font-mono text-xs tracking-widest uppercase text-text-dim">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Join the Movement Card with Primary CTA */}
      <div className="card-base p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-kotlin-pink block mb-2">
            Get Involved
          </span>
          <h3 className="font-display text-2xl font-bold text-white mb-3">
            Join the Coimbatore Kotlin User Group
          </h3>
          <p className="font-body text-sm text-text-muted leading-relaxed">
            RSVP for upcoming technical meetups, collaborate on open-source Kotlin experiments, and connect directly with local engineers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-7 py-3.5 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin overflow-hidden transition-all duration-200 hover:brightness-110 hover:shadow-kotlin-md active:scale-[0.97] active:brightness-90 select-none inline-flex items-center gap-2"
          >
            Register with Group
          </a>
          <a
            href="https://slack-chats.kotlinlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border px-7 py-3.5 rounded-sm font-body font-medium text-sm text-text-body bg-surface transition-all duration-200 hover:bg-surface-2 hover:text-white active:scale-[0.97] select-none inline-flex items-center gap-2"
          >
            Global Slack
          </a>
        </div>
      </div>
    </section>
  )
}
