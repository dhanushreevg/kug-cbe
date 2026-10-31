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
    <section
      id="resources"
      className="max-w-7xl mx-auto bg-void px-5 sm:px-10 lg:px-16 py-[clamp(4rem,8vw,8rem)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: numbered rail + heading. Below 1024px the heading
            column stacks above the list (already the natural order here). */}
        <div className="lg:col-span-5 sm:pl-[4%]">
          <SectionHeader
            num="06"
            label="Developer Index"
            title="Essential Resources"
            className="mb-4"
          />
          <div className="flex items-start justify-between gap-4 mt-2">
            <div className="min-w-0">
              <p className="font-body text-muted text-base leading-relaxed max-w-sm mb-4">
                Curated references, interactive sandboxes, and engineering documentation for building production Kotlin systems.
              </p>
              <div className="font-mono text-xs text-dim">
                Curated by KUG Coimbatore · Updated for Kotlin 2.0
              </div>
            </div>

            {/* Kodee sharing mascot cleanly placed beside description, never overlapping heading */}
            <img
              src="/assets/kotlin_mascot_2/Digital/PNG/Kodee-sharing-96.png"
              alt="Kodee sharing resources"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              width={96}
              height={96}
              className="kodee-img h-12 w-12 sm:h-14 sm:w-14 shrink-0 object-contain select-none mt-1"
            />
          </div>
        </div>

        {/* Right Column: 6 resource rows — ≥56px tap targets on touch. */}
        <div className="lg:col-span-7 border-t border-border">
          {RESOURCES.map((r, i) => (
            <a
              key={i}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[56px] border-b border-border py-4 px-4 sm:px-5 flex items-center justify-between hover:bg-surface-2 group transition-colors duration-150 no-underline"
            >
              <div className="flex flex-col pr-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display font-medium text-body group-hover:text-fg transition-colors duration-150 text-base">
                    {r.title}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-dim border border-border px-1.5 py-0.5 rounded-md">
                    {r.category}
                  </span>
                </div>
                <span className="font-body text-xs text-muted mt-1 leading-normal">
                  {r.desc}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-dim group-hover:text-fg group-hover:translate-x-1 transition-all duration-150 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
