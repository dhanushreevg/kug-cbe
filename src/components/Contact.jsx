import PinwheelDeco from "@/components/PinwheelDeco"

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

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 px-6 sm:px-10 lg:px-16 bg-void overflow-hidden">
      {/* Decorative low opacity GDG aperture pinwheel in background */}
      <PinwheelDeco
        className="-bottom-20 -left-20 pointer-events-none opacity-[0.03]"
        size={400}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* kodee-waving.png — revealed on scroll with the existing .reveal flow */}
        <img
          src="/assets/kotlin_mascot_2/Digital/PNG/Kodee-waving-96.png"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          width={96}
          height={96}
          className="reveal kodee-img h-16 w-16 sm:h-20 sm:w-20 mx-auto object-contain select-none mb-2"
        />
        <div className="section-label mx-auto mb-4">Direct Communication</div>
        <h2 className="section-heading font-display font-bold text-fg text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-[-0.03em] mb-4">
          Initiate Contact
        </h2>
        <p className="font-body text-muted text-base max-w-lg mx-auto leading-relaxed mb-10">
          Interested in giving a talk, hosting our next session at your company campus, or supporting the community? Reach out directly.
        </p>

        {/* Primary Contact: Email in solid white */}
        <div className="mb-12">
          <a
            href="mailto:kugcoimbatore@gmail.com"
            className="inline-block max-w-full break-words font-mono text-[clamp(1rem,5vw,3rem)] font-bold text-fg hover:text-body transition-colors duration-150 select-all"
          >
            kugcoimbatore@gmail.com
          </a>
        </div>

        {/* Social / Ecosystem Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 border-t border-border pt-8">
          <a
            href="https://kotlinlang.org/community/user-groups/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-muted hover:text-fg transition-colors duration-150"
          >
            <span>JetBrains KUG Directory</span>
            <ArrowRight className="w-4 h-4 text-dim" />
          </a>

          <a
            href="https://github.com/JetBrains/kotlin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-muted hover:text-fg transition-colors duration-150"
          >
            <span>Kotlin GitHub Repository</span>
            <ArrowRight className="w-4 h-4 text-dim" />
          </a>

          <a
            href="https://twitter.com/kotlin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-muted hover:text-fg transition-colors duration-150"
          >
            <span>Kotlin On X / Twitter</span>
            <ArrowRight className="w-4 h-4 text-dim" />
          </a>
        </div>
      </div>
    </section>
  )
}
