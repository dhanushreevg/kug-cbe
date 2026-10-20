const resources = [
  {
    icon: "📖",
    title: "Kotlin Docs",
    desc: "Official language reference, tutorials, and guides from JetBrains.",
    href: "https://kotlinlang.org/docs/home.html",
  },
  {
    icon: "▶",
    title: "Kotlin Playground",
    desc: "Try Kotlin directly in your browser. No setup needed.",
    href: "https://play.kotlinlang.org/",
  },
  {
    icon: "🌐",
    title: "KUG Guidelines",
    desc: "JetBrains' official guide for running a Kotlin User Group.",
    href: "https://kotlinlang.org/docs/kug-guidelines.html",
  },
  {
    icon: "💬",
    title: "Kotlin Slack",
    desc: "Join the global Kotlin community on Slack.",
    href: "https://slack-chats.kotlinlang.org/",
  },
  {
    icon: "🎬",
    title: "Kotlin YouTube",
    desc: "Conference talks, tutorials, and KotlinConf sessions.",
    href: "https://www.youtube.com/@Kotlin",
  },
  {
    icon: "🛠",
    title: "JetBrains Tools",
    desc: "IntelliJ IDEA, Android Studio, and the full JetBrains suite.",
    href: "https://www.jetbrains.com/",
  },
]

export default function Resources() {
  return (
    <section id="resources" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase">
          Curated
        </span>
        <h2 className="reveal text-4xl md:text-6xl font-bold mt-2">
          Resources
        </h2>
        <p className="reveal text-white/50 mt-4 max-w-xl">
          Everything you need to start and grow with Kotlin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r, i) => (
          <a
            key={i}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal glass-card p-5 flex flex-col gap-3 no-underline group cursor-pointer"
          >
            <span className="text-2xl">{r.icon}</span>
            <h3 className="font-semibold text-base group-hover:text-kotlin-light transition-colors">
              {r.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">{r.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
