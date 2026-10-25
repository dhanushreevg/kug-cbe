import PinwheelDeco from "@/components/PinwheelDeco"
import dhanuPhoto from "../assets/dhanuu.jpeg"
import sanjayPhoto from "../assets/sanjayy.png"

/* ─── OrganizerCard ─────────────────────────────────────────────────────────
   Editorial profile: large portrait with an overlapping info panel that rises
   ~56 px into the bottom of the image, creating a deliberate composition.
   ────────────────────────────────────────────────────────────────────────── */
function OrganizerCard({ photo, alt, name, role, org, badge, accentClass, quote }) {
  return (
    <article className="organizer-card group flex flex-col w-full sm:w-[17.5rem] shrink-0">
      {/* Portrait */}
      <div className="relative w-full overflow-hidden rounded-sm" style={{ height: "22rem" }}>
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* bottom vignette blends portrait into panel */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(10,10,15,0.6) 100%)" }}
        />
      </div>

      {/* Info panel — negative top margin creates the overlap */}
      <div
        className="relative mx-3 rounded-sm border border-border-mid bg-surface overflow-hidden"
        style={{ marginTop: "-3.5rem" }}
      >
        {/* gradient accent line at panel top */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "var(--gradient-kotlin-h)", opacity: 0.75 }}
        />

        <div className="pt-5 pb-5 px-5">
          {/* Badge */}
          <span className={`inline-block mb-3 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-surface-3 border border-border ${accentClass}`}>
            {badge}
          </span>

          {/* Name */}
          <h3
            className="font-display font-bold text-white leading-tight mb-1"
            style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.65rem)" }}
          >
            {name}
          </h3>

          {/* Role */}
          <p className="font-body text-sm text-text-muted leading-snug">
            {role}
          </p>

          {/* Org */}
          {org && (
            <p className="font-mono text-xs text-text-dim mt-0.5">{org}</p>
          )}

          {/* Quote */}
          {quote && (
            <blockquote className="mt-4 pt-4 border-t border-border">
              <span className={`font-mono text-[10px] tracking-widest uppercase block mb-1.5 ${accentClass}`}>
                // quote
              </span>
              <p className="font-body text-sm text-text-muted italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── KodeeCard ─────────────────────────────────────────────────────────────
   Compact mascot entry — visually coordinated but intentionally secondary.
   ────────────────────────────────────────────────────────────────────────── */
function KodeeCard() {
  return (
    <article className="card-base flex flex-row items-center gap-4 px-5 py-4 w-full">
      {/* Lambda glyph as Kotlin-flavored avatar */}
      <div
        className="w-10 h-10 shrink-0 rounded-sm flex items-center justify-center text-lg font-mono font-bold text-white select-none"
        style={{ background: "var(--gradient-kotlin)", opacity: 0.9 }}
        aria-hidden="true"
      >
        λ
      </div>

      <div className="min-w-0">
        <div className="font-display font-semibold text-white text-sm">Kodee</div>
        <div className="font-body text-xs text-text-muted mt-0.5 leading-snug">
          Robotic Community Companion
        </div>
      </div>

      <span className="ml-auto shrink-0 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-surface-3 text-kotlin-indigo border border-border">
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
      className="relative py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto bg-void overflow-hidden"
    >
      {/* Decorative low opacity GDG aperture pinwheel in background */}
      <PinwheelDeco
        className="top-12 -right-24 pointer-events-none opacity-[0.05]"
        size={460}
      />

      <div className="relative z-10">
        {/* ── Section header ── */}
        <div className="section-label">Identity &amp; Foundation</div>
        <h2
          className="section-heading font-display font-bold text-white leading-none tracking-[-0.03em] max-w-3xl mb-8"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          About <span className="gradient-text">KUG Coimbatore</span>
        </h2>

        {/* ── Two-column grid: description left, organizers right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left — intro + affiliation cards */}
          <div className="lg:col-span-6 flex flex-col gap-6">
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

          {/* Right — organizer profiles */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="font-mono text-xs tracking-widest uppercase text-text-dim">
              Organizers &amp; Stewards
            </span>

            {/* Profile cards row — wraps vertically on mobile */}
            <div className="flex flex-row flex-wrap gap-6 items-start">
              <OrganizerCard
                photo={dhanuPhoto}
                alt="Dhanu Shree — Organizer, KUG Coimbatore"
                name="Dhanu Shree"
                role="Organizer"
                org="KUG Coimbatore"
                badge="Organizer"
                accentClass="text-kotlin-pink"
              />

              <OrganizerCard
                photo={sanjayPhoto}
                alt="Sanjay — Co-Organizer & Tech Lead, KUG Coimbatore"
                name="Sanjay"
                role="Co-Organizer &amp; Tech Lead"
                badge="Co-Organizer"
                accentClass="text-kotlin-violet"
                quote="If you want to crack the system, first understand the system."
              />
            </div>

            {/* Kodee mascot — compact secondary entry */}
            <KodeeCard />
          </div>
        </div>
      </div>
    </section>
  )
}
