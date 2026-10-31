/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER — editorial system
   ---------------------------------------------------------------------------
   Every section gets the same header grammar: a numbered left rail
   (mono number + Kotlin-gradient rule + label) and the heading to the right.
   On mobile the rail stacks above the heading ("no. → label → heading"),
   keeping the reading order identical at every breakpoint.

   `centered` renders the header centred instead — used only by Contact,
   which keeps its own centred layout identity (with the same numbering).
   The h2 keeps the `section-heading` class so the App-level SplitText
   character stagger keeps wiring up, and the responsive h2 scale follows
   the type system: clamp(1.75rem, 3.6vw, 3rem).
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SectionHeader({
  num,
  label,
  title,
  lede,
  centered = false,
  className = "",
}) {
  const rail = (
    <div className={`section-rail ${centered ? "" : "md:w-36 lg:w-44 md:shrink-0 md:border-l md:border-border md:pl-5"}`}>
      <span className="section-rail__num">{num}</span>
      <span className="section-rail__lbl">{label}</span>
    </div>
  )

  const heading = (
    <div className="min-w-0">
      <h2
        className={`section-heading font-display font-bold text-fg leading-[1.05] tracking-[-0.03em] ${
          centered ? "type-display" : "text-[clamp(1.75rem,3.6vw,3rem)]"
        } ${lede ? (centered ? "mb-5" : "mb-4") : ""}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`body-copy font-body text-muted leading-relaxed ${
            centered
              ? "max-w-lg mx-auto"
              : "max-w-xl mt-1"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  )

  if (centered) {
    return (
      <header className={`relative ${className}`}>
        <div className="flex items-baseline justify-center gap-3 mb-4">
          <span className="font-mono text-[0.75rem] font-bold uppercase tracking-[0.12em] text-fg">
            {num}
          </span>
          <span aria-hidden="true" className="font-mono text-[0.75rem] text-dim">·</span>
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-muted">
            {label}
          </span>
        </div>
        {heading}
      </header>
    )
  }

  return (
    <header
      className={`flex flex-col gap-3 sm:gap-5 md:flex-row md:items-start md:gap-14 ${className}`}
    >
      {rail}
      {heading}
    </header>
  )
}
