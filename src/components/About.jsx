import PinwheelDeco from "@/components/PinwheelDeco"

export default function About() {
  return (
    <section id="about" className="relative py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void overflow-hidden">
      {/* Decorative low opacity GDG aperture pinwheel in background */}
      <PinwheelDeco
        className="top-12 -right-24 pointer-events-none opacity-[0.05]"
        size={460}
      />

      <div className="relative z-10">
        <div className="section-label">Identity &amp; Foundation</div>
        <h2 className="section-heading font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.03em] max-w-3xl mb-8">
          About <span className="gradient-text">KUG Coimbatore</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p className="font-body text-base text-text-body leading-relaxed max-w-2xl">
              Kotlin User Group Coimbatore is an officially recognized JetBrains developer community based in the industrial and technology hub of Western Tamil Nadu.
            </p>
            <p className="font-body text-base text-text-muted leading-relaxed max-w-2xl">
              We connect Android developers, backend systems architects, frontend engineers, and student builders. Our focus is technical precision: mastering coroutines, shipping declarative Compose UIs, and architecting resilient cross-platform applications with Kotlin Multiplatform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="card-base p-5">
                <span className="font-mono text-xs uppercase tracking-wider text-kotlin-pink block mb-1">
                  Affiliation
                </span>
                <h4 className="font-display text-base font-bold text-white mb-1">
                  JetBrains Recognized
                </h4>
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  Registered under the global JetBrains Kotlin Community Network.
                </p>
              </div>

              <div className="card-base p-5">
                <span className="font-mono text-xs uppercase tracking-wider text-kotlin-indigo block mb-1">
                  Access
                </span>
                <h4 className="font-display text-base font-bold text-white mb-1">
                  Open &amp; Free Always
                </h4>
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  All community meetups, workshops, and recordings are 100% free of charge.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest uppercase text-text-dim">
              Organizers &amp; Stewards
            </span>
            <div className="card-base p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="font-display font-medium text-white text-base">
                    Dhanu Shree V G
                  </div>
                  <div className="font-mono text-xs text-text-dim">
                    Lead Organizer · KUG Coimbatore
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-surface-2 text-kotlin-pink border border-border">
                  Organizer
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="font-display font-medium text-white text-base">
                    Sanjay S
                  </div>
                  <div className="font-mono text-xs text-text-dim">
                    Co-Organizer &amp; Tech Lead
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-surface-2 text-kotlin-violet border border-border">
                  Co-Organizer
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-medium text-white text-base">
                    Kodee
                  </div>
                  <div className="font-mono text-xs text-text-dim">
                    Robotic Community Companion
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-surface-2 text-kotlin-indigo border border-border">
                  Mascot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
