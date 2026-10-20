export default function About() {
  return (
    <section id="about" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-6">
          <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase">
            Who We Are
          </span>
          <h2 className="reveal text-4xl md:text-5xl font-bold leading-tight">
            About<br />KUG Coimbatore
          </h2>
          <p className="reveal text-white/60 leading-relaxed text-base">
            KUG Coimbatore is an officially recognised JetBrains Kotlin User Group based
            in Coimbatore, Tamil Nadu. We bring together developers, students, and
            tech enthusiasts passionate about Kotlin and its ecosystem — from Android
            and backend to Kotlin Multiplatform.
          </p>
          <p className="reveal text-white/60 leading-relaxed text-base">
            Whether you are just starting out or shipping production Kotlin code, this
            is your local home base. We host meetups, workshops, live coding sessions,
            and talks — all free and open to everyone.
          </p>

          {/* Organizer cards */}
          <div className="reveal flex flex-wrap gap-3 mt-2">
            {[
              { name: "Dhanu Shree V G", role: "Organizer" },
              { name: "Sanjay S", role: "Co-Organizer" },
            ].map((o) => (
              <div
                key={o.name}
                className="glass rounded-xl px-5 py-3 border-l-2 border-kotlin-purple flex flex-col gap-0.5"
              >
                <span className="font-semibold text-sm text-white">
                  {o.name}
                </span>
                <span className="text-xs font-mono text-kotlin-purple/80 uppercase tracking-widest">
                  {o.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: glassmorphism info panel */}
        <div className="reveal glass-card p-8 flex flex-col gap-6">
          <h3 className="font-semibold text-lg text-kotlin-light">
            What We Do
          </h3>
          {[
            {
              icon: "🎤",
              label: "Monthly Meetups",
              detail: "In-person gatherings with talks and demos",
            },
            {
              icon: "🛠",
              label: "Hands-on Workshops",
              detail: "Practical sessions for all experience levels",
            },
            {
              icon: "🌐",
              label: "Online Sessions",
              detail: "Livestreams and virtual deep-dives",
            },
            {
              icon: "🤝",
              label: "Community Networking",
              detail: "Connect with Kotlin developers across Tamil Nadu",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-white/45 mt-0.5">
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
