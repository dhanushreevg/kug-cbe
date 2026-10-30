const STATS = [
  { number: "250+", label: "Engineers in Network" },
  { number: "01", label: "Metro Chapter (CBE)" },
  { number: "100%", label: "Free & Open Source" },
  { number: "2.0", label: "Compiler Era" },
]

export default function Community() {
  return (
    <section id="community" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-[#050506]">
      <div className="mb-14">
        <div className="section-label">Community Metrics</div>
        <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
          Built by Developers, for Developers
        </h2>
        <p className="font-body text-[#d4d4d4] text-base max-w-2xl leading-relaxed">
          From independent software vendors to college research groups and enterprise engineering teams across Coimbatore, we are creating a home for pragmatic programmers.
        </p>
      </div>

      {/* 4-column Stats Grid with solid dividers on solid #111111 */}
      <div className="bg-[#111111] grid grid-cols-2 lg:grid-cols-4 border border-white/[0.08] mb-16 rounded-xl overflow-hidden">
        {STATS.map((stat, i) => (
          <div key={i} className="border-r border-b lg:border-b-0 border-white/[0.08] p-8 flex flex-col justify-center last:border-r-0">
            <div className="font-mono text-4xl sm:text-5xl font-bold text-white mb-2 tabular-nums">
              {stat.number}
            </div>
            <div className="font-mono text-xs tracking-widest uppercase text-[#8a8a8a]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Join the Movement Card with Solid CTAs */}
      <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8a8a8a] block mb-2">
            Get Involved
          </span>
          <h3 className="font-display text-2xl font-bold text-white mb-3">
            Join the Coimbatore Kotlin User Group
          </h3>
          <p className="font-body text-sm text-[#8a8a8a] leading-relaxed">
            RSVP for upcoming technical meetups, collaborate on open-source Kotlin experiments, and connect directly with local engineers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-body font-medium text-sm text-[#0a0a0a] bg-white hover:bg-[#e6e6e6] transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center gap-2 shadow-sm"
          >
            Register with Group
          </a>
          <a
            href="https://slack-chats.kotlinlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-body font-medium text-sm text-[#d4d4d4] hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.08] transition-all duration-150 active:scale-[0.98] select-none inline-flex items-center gap-2"
          >
            Global Slack
          </a>
        </div>
      </div>
    </section>
  )
}
