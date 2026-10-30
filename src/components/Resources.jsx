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

const RESOURCES = [
  {
    title: "Official Kotlin Documentation",
    desc: "Language tour, type system specifications, and standard library API docs.",
    category: "Docs",
    href: "https://kotlinlang.org/docs/home.html",
  },
  {
    title: "Kotlin Playground",
    desc: "Execute code snippets with live K2 compiler directly in your browser.",
    category: "Sandbox",
    href: "https://play.kotlinlang.org/",
  },
  {
    title: "JetBrains KUG Guidelines",
    desc: "Official framework and support resources for JetBrains community chapters.",
    category: "Community",
    href: "https://kotlinlang.org/docs/kug-guidelines.html",
  },
  {
    title: "Global Kotlin Slack",
    desc: "Engage with core language designers, library maintainers, and worldwide developers.",
    category: "Community",
    href: "https://slack-chats.kotlinlang.org/",
  },
  {
    title: "Kotlin YouTube Channel",
    desc: "Keynotes from KotlinConf, feature walkthroughs, and performance deep dives.",
    category: "Media",
    href: "https://www.youtube.com/@Kotlin",
  },
  {
    title: "Compose Multiplatform Portal",
    desc: "Declarative UI toolkit for desktop, iOS, Android, and web targets.",
    category: "Framework",
    href: "https://www.jetbrains.com/lp/compose-multiplatform/",
  },
]

export default function Resources() {
  return (
    <section id="resources" className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-[#050506]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Heading with staggered left edge: padding-left 4% */}
        <div className="lg:col-span-5 sm:pl-[4%]">
          <div className="section-label">Developer Index</div>
          <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] mb-4">
            Essential Resources
          </h2>
          <p className="font-body text-[#8a8a8a] text-base leading-relaxed max-w-sm mb-6">
            Curated references, interactive sandboxes, and engineering documentation for building production Kotlin systems.
          </p>
          <div className="font-mono text-xs text-[#666666]">
            Curated by KUG Coimbatore · Updated for Kotlin 2.0
          </div>
        </div>

        {/* Right Column: 6 resource rows with solid borders */}
        <div className="lg:col-span-7 border-t border-white/[0.08]">
          {RESOURCES.map((r, i) => (
            <a
              key={i}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-white/[0.08] py-4 px-4 flex items-center justify-between hover:bg-[#141414] group transition-colors duration-150 no-underline"
            >
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-medium text-[#d4d4d4] group-hover:text-white transition-colors duration-150 text-base">
                    {r.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                    {r.category}
                  </span>
                </div>
                <span className="font-body text-xs text-[#8a8a8a] mt-1 leading-normal">
                  {r.desc}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#666666] group-hover:text-white group-hover:translate-x-1 transition-all duration-150 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
