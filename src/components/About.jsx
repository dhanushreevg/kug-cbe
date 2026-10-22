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
              {
                name: "Kodee",
                role: "Official Mascot",
                icon: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-regular-156px-more.svg",
              },
            ].map((o) => (
              <div
                key={o.name}
                className="glass rounded-xl px-5 py-3 border-l-2 border-kotlin-purple flex items-center gap-3"
              >
                {o.icon && (
                  <img
                    src={o.icon}
                    alt={o.name}
                    className="w-8 h-8 object-contain shrink-0 animate-float"
                  />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-white">
                    {o.name}
                  </span>
                  <span className="text-xs font-mono text-kotlin-purple/80 uppercase tracking-widest">
                    {o.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: glassmorphism info panel */}
        <div className="reveal glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-kotlin-light">
              What We Do
            </h3>
            <span className="text-xs font-mono text-kotlin-coral font-medium bg-kotlin-coral/10 px-2.5 py-1 rounded-full border border-kotlin-coral/20">
              ✦ 100% Free
            </span>
          </div>
          {[
            {
              icon: "🎤",
              label: "Monthly Meetups",
              detail: "In-person gatherings with talks, lightning demos, and networking",
            },
            {
              icon: "🛠",
              label: "Hands-on Workshops",
              detail: "Practical coding labs for Android, Compose, and KMP",
            },
            {
              icon: "🌐",
              label: "Online Sessions & Streams",
              detail: "Virtual deep-dives and live coding sessions",
            },
            {
              icon: "🤝",
              label: "Community Mentorship",
              detail: "Connect with Kotlin developers and leaders across Tamil Nadu",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className="font-medium text-sm text-white">{item.label}</div>
                <div className="text-xs text-white/50 mt-0.5 leading-relaxed">
                  {item.detail}
                </div>
              </div>
            </div>
          ))}

          {/* JetBrains & Kodee badge */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <img
              src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sitting.svg"
              alt="Kodee sitting"
              className="w-12 h-12 object-contain shrink-0 animate-float"
            />
            <div className="text-xs text-white/70 leading-relaxed">
              <span className="font-semibold text-white block">Official JetBrains KUG</span>
              Following official guidelines to foster a diverse, friendly, and thriving developer ecosystem in Coimbatore.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
