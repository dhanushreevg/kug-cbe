import PinwheelDeco from "@/components/PinwheelDeco"
import dhanuPhoto from "../assets/dhanuu.jpeg"
import sanjayPhoto from "../assets/sanjayy.png"

/* ─── OrganizerProfile ──────────────────────────────────────────────────────
   Editorial profile with solid #141414 dark panel, 12px radius, no glass/blur.
   ────────────────────────────────────────────────────────────────────────── */
function OrganizerProfile({ photo, alt, name, role, org, badge, accentClass, quote }) {
  return (
    <article className="organizer-profile group relative w-full max-w-[580px] mx-auto lg:mx-0">
      {/* Portrait - anchored to left with 12px radius */}
      <div
        className="organizer-portrait relative overflow-hidden"
        style={{
          width: "clamp(280px, 38vw, 360px)",
          height: "clamp(340px, 48vw, 440px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "#111111",
        }}
      >
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {/* Subtle bottom vignette for contrast */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.7) 100%)" }}
        />
      </div>

      {/* Information panel - solid #141414, 12px radius, zero glass */}
      <div
        className="organizer-panel absolute"
        style={{
          left: "clamp(90px, 16vw, 140px)",
          bottom: "-clamp(70px, 10vw, 90px)",
          width: "clamp(320px, 46vw, 460px)",
          minHeight: "clamp(165px, 22vw, 200px)",
          borderRadius: "12px",
          background: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 16px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="relative h-full flex flex-col justify-center px-7 sm:px-9 py-6 sm:py-7">
          {/* Badge */}
          <span className={`inline-flex self-start mb-3 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-2.5 py-1 rounded-lg bg-[#1a1a1a] border border-white/[0.08] ${accentClass || "text-[#d4d4d4]"}`}>
            {badge}
          </span>

          {/* Name */}
          <h3
            className="font-display font-bold text-white leading-[1.05] mb-1.5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
          >
            {name}
          </h3>

          {/* Role */}
          <p className="font-body text-base text-[#d4d4d4] leading-snug">
            {role}
          </p>

          {/* Org */}
          {org && (
            <p className="font-mono text-xs sm:text-sm text-[#8a8a8a] mt-1">{org}</p>
          )}
        </div>
      </div>

      {/* Spacer to account for absolutely positioned panel */}
      <div
        style={{
          height: "clamp(140px, 18vw, 170px)",
          marginTop: "clamp(80px, 12vw, 110px)",
        }}
      />

      {/* Quote area */}
      {quote && (
        <div className="mt-6 ml-auto max-w-[420px] pr-2">
          <div className="relative pl-6 border-l-2 border-white/[0.15]">
            <p className="font-body text-sm sm:text-base text-[#8a8a8a] italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

/* ─── KodeeCard ─────────────────────────────────────────────────────────────
   Compact mascot entry — solid card aesthetic
   ────────────────────────────────────────────────────────────────────────── */
function KodeeCard() {
  return (
    <article className="card-base flex flex-row items-center gap-4 px-5 py-4 w-full max-w-md">
      <div
        className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-lg font-mono font-bold text-white bg-[#222222] border border-white/[0.08] select-none"
        aria-hidden="true"
      >
        λ
      </div>

      <div className="min-w-0">
        <div className="font-display font-semibold text-white text-sm">Kodee</div>
        <div className="font-body text-xs text-[#8a8a8a] mt-0.5 leading-snug">
          Robotic Community Companion
        </div>
      </div>

      <span className="ml-auto shrink-0 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-lg bg-[#1a1a1a] text-[#8a8a8a] border border-white/[0.08]">
        Mascot
      </span>
    </article>
  )
}

/* ─── About ─────────────────────────────────────────────────────────────── */
export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-[#050506] overflow-hidden"
    >
      {/* Decorative low opacity GDG aperture pinwheel in background */}
      <PinwheelDeco
        className="top-12 -right-24 pointer-events-none opacity-[0.03]"
        size={460}
      />

      <div className="relative z-10">
        {/* ── Section header ── */}
        <div className="section-label">Identity &amp; Foundation</div>
        <h2
          className="section-heading font-display font-bold text-white leading-none tracking-[-0.03em] max-w-3xl mb-8"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          About <span className="text-white">KUG Coimbatore</span>
        </h2>

        {/* ── Introduction and affiliation cards ── */}
        <div className="flex flex-col gap-6 mb-16 max-w-4xl">
          <p className="font-body text-base text-[#d4d4d4] leading-relaxed">
            Kotlin User Group Coimbatore is an officially recognized JetBrains developer community based in the industrial and technology hub of Western Tamil Nadu.
          </p>
          <p className="font-body text-base text-[#8a8a8a] leading-relaxed">
            We connect Android developers, backend systems architects, frontend engineers, and student builders. Our focus is technical precision: mastering coroutines, shipping declarative Compose UIs, and architecting resilient cross-platform applications with Kotlin Multiplatform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="card-base p-5">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8a8a8a] block mb-1">
                Affiliation
              </span>
              <h4 className="font-display text-base font-bold text-white mb-1">
                JetBrains Recognized
              </h4>
              <p className="font-body text-xs text-[#8a8a8a] leading-relaxed">
                Registered under the global JetBrains Kotlin Community Network.
              </p>
            </div>

            <div className="card-base p-5">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8a8a8a] block mb-1">
                Access
              </span>
              <h4 className="font-display text-base font-bold text-white mb-1">
                Open &amp; Free Always
              </h4>
              <p className="font-body text-xs text-[#8a8a8a] leading-relaxed">
                All community meetups, workshops, and recordings are 100% free of charge.
              </p>
            </div>
          </div>
        </div>

        {/* ── Organizers section ── */}
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest uppercase text-[#666666] block mb-10">
            Organizers &amp; Stewards
          </span>

          {/* Profile cards - two columns on desktop */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-12 items-start">
            <OrganizerProfile
              photo={dhanuPhoto}
              alt="Dhanu Shree — Organizer, KUG Coimbatore"
              name="Dhanu Shree"
              role="Organizer"
              org="KUG Coimbatore"
              badge="Organizer"
              accentClass="text-[#d4d4d4]"
            />

            <OrganizerProfile
              photo={sanjayPhoto}
              alt="Sanjay — Co-Organizer & Tech Lead, KUG Coimbatore"
              name="Sanjay"
              role="Co-Organizer &amp; Tech Lead"
              badge="Co-Organizer"
              accentClass="text-[#d4d4d4]"
              quote="If you want to crack the system, first understand the system."
            />
          </div>

          {/* Kodee mascot — compact secondary entry */}
          <div className="mt-20">
            <KodeeCard />
          </div>
        </div>
      </div>
    </section>
  )
}
