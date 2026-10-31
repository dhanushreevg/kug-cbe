import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PinwheelDeco from "@/components/PinwheelDeco"
import SectionHeader from "@/components/SectionHeader"

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ────────────────────────────────────────────────────────────────
   Config array for organizers. Missing social entries are omitted automatically.
   Never invent URLs: add email/whatsapp/linkedin only when provided by owner.
   ────────────────────────────────────────────────────────────────────────── */
const ORGANIZERS = [
  {
    name: "Dhanu Shree",
    role: "Organizer",
    org: "KUG Coimbatore",
    badge: "Organizer",
    quote:
      "Building an inclusive, high-impact ecosystem for Kotlin developers and student creators across Tamil Nadu.",
    photoSrc: "/assets/dhanuu-card.png",
    photoFallback: "/assets/dhanuu.png",
    photoAlt: "Dhanu Shree — Organizer, KUG Coimbatore",
    socials: {
      email: "",
      whatsapp: "",
      linkedin: "",
      linktree: "https://linktr.ee/dhanushreedhachu",
    },
  },
  {
    name: "Sanjay S",
    role: "Co-Organizer & Tech Lead",
    org: "KUG Coimbatore",
    badge: "Co-Organizer",
    quote: "If you want to crack the system, first understand the system.",
    photoSrc: "/assets/sanjayy-card.png",
    photoFallback: "/assets/sanjayy.png",
    photoAlt: "Sanjay S — Co-Organizer & Tech Lead, KUG Coimbatore",
    socials: {
      email: "",
      whatsapp: "",
      linkedin: "",
      linktree: "https://linktr.ee/sanjayoffl24",
    },
  },
]

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const EmailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const LinktreeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 3L12 7L15 3" />
    <path d="M12 7V22" />
    <path d="M5 10H19" />
    <path d="M5 17H19" />
  </svg>
)

/* ─── OrganizerCard ─────────────────────────────────────────────────────────
   Layered, angled profile card matching the target reference format:
   1. Back panel — solid dark surface (#141414), rotated ≈ -3deg, lower-left offset
   2. Accent block — Kotlin gradient panel (#7F52FF → #C811E1) with diagonal right edge
   3. Photo — portrait cutout, anchored to bottom, rising 15–20% above the card top
   4. Text block — Space Grotesk bold name, Manrope muted role, org beneath
   5. Social row — round icon buttons (44×44px min, visible focus ring, hover brand ring)
   ────────────────────────────────────────────────────────────────────────── */
function OrganizerCard({
  name,
  role,
  org,
  badge,
  quote,
  photoSrc,
  photoFallback,
  photoAlt,
  socials = {},
  lazy = true,
}) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    /* gsap.matchMedia scopes every tween to this context, so StrictMode's
       mount → cleanup → mount cycle reverts the first run cleanly instead of
       leaving a second set of tweens stuck mid-reveal on the same elements. */
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const backPanel = el.querySelector(".org-card__back")
      const photo = el.querySelector(".org-card__photo-container")
      const content = el.querySelector(".org-card__content")
      const targets = [backPanel, photo, content].filter(Boolean)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
        /* Drop GSAP's inline opacity/transform once the reveal is done so the
           card can never get stuck in a part-hidden state. */
        onComplete: () => gsap.set(targets, { clearProps: "opacity,transform" }),
      })

      if (backPanel) {
        tl.from(
          backPanel,
          { x: -35, opacity: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
          0
        )
      }
      if (photo) {
        tl.from(
          photo,
          { y: 35, opacity: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
          0.1
        )
      }
      if (content) {
        tl.from(
          content,
          { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", immediateRender: false },
          0.25
        )
      }
    })

    return () => mm.revert()
  }, [])

  // Registered social icons in standard display order
  const SOCIAL_DEFS = [
    {
      key: "email",
      label: "Email",
      Icon: EmailIcon,
      formatHref: (val) => (val.startsWith("mailto:") ? val : `mailto:${val}`),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      formatHref: (val) =>
        val.startsWith("http")
          ? val
          : `https://wa.me/${val.replace(/[^0-9]/g, "")}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      Icon: LinkedInIcon,
      formatHref: (val) => val,
    },
    {
      key: "linktree",
      label: "Linktree",
      Icon: LinktreeIcon,
      formatHref: (val) => val,
    },
  ]

  // Filter out any link not provided or empty — never show empty or dead buttons
  const activeSocials = SOCIAL_DEFS.filter(
    (item) =>
      typeof socials[item.key] === "string" && socials[item.key].trim().length > 0
  ).map((item) => ({
    ...item,
    href: item.formatHref(socials[item.key].trim()),
  }))

  return (
    <article ref={cardRef} className="org-card">
      {/* Layer 1: Tilted dark back panel */}
      <div className="org-card__back" aria-hidden="true" />

      {/* Layer 2: Main card front surface */}
      <div className="org-card__front">
        {/* Left half: Kotlin gradient accent block + rising portrait photo */}
        <div className="org-card__visual">
          {/* Accent block with diagonal right edge via clip-path */}
          <div className="org-card__accent-wrap" aria-hidden="true">
            <div className="org-card__accent" />
          </div>

          {/* Photo anchored to bottom of accent block, rising above top edge */}
          <div className="org-card__photo-container">
            <img
              src={photoSrc}
              alt={photoAlt}
              loading={lazy ? "lazy" : "eager"}
              decoding="async"
              className="org-card__photo"
              onError={(e) => {
                if (
                  photoFallback &&
                  e.target.src !== window.location.origin + photoFallback
                ) {
                  e.target.src = photoFallback
                }
              }}
            />
          </div>
        </div>

        {/* Right half: Text block and round social buttons */}
        <div className="org-card__content">
          <div className="org-card__text">
            {badge && (
              <span className="org-card__badge">
                <span className="org-card__badge-dot" />
                {badge}
              </span>
            )}
            <h3 className="org-card__name">{name}</h3>
            <p className="org-card__role">{role}</p>
            {org && <p className="org-card__org">{org}</p>}
            {quote && (
              <blockquote className="org-card__quote">
                &ldquo;{quote}&rdquo;
              </blockquote>
            )}
          </div>

          {/* Round icon buttons row */}
          {activeSocials.length > 0 && (
            <div className="org-card__socials">
              {activeSocials.map(({ key, label, Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="org-card__social-btn"
                  aria-label={`${name}'s ${label}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── KodeeCard ─────────────────────────────────────────────────────────────
   Mascot card restyled to share the same back-panel and text layout,
   with the Kodee sitting image in full colour (no grayscale filter).
   ────────────────────────────────────────────────────────────────────────── */
function KodeeCard() {
  return (
    <article className="org-card org-card--kodee">
      <div className="org-card__back org-card__back--kodee" aria-hidden="true" />
      <div className="org-card__front org-card__front--kodee">
        <div className="org-card__visual org-card__visual--kodee">
          <div className="org-card__accent-wrap" aria-hidden="true">
            <div className="org-card__accent" />
          </div>
          <div className="org-card__photo-container org-card__photo-container--kodee">
            <img
              src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sitting.svg"
              alt="Kodee — Kotlin Official Mascot"
              loading="lazy"
              decoding="async"
              className="org-card__photo org-card__photo--kodee"
            />
          </div>
        </div>
        <div className="org-card__content">
          <div className="org-card__text">
            <span className="org-card__badge">
              <span className="org-card__badge-dot" />
              Community Mascot
            </span>
            <h3 className="org-card__name">Kodee</h3>
            <p className="org-card__role">Robotic Community Companion</p>
            <p className="org-card__org">Kotlin Official Mascot</p>
            <p className="font-body text-xs text-muted leading-relaxed mt-2 max-w-md">
              The cheerful companion cheering on Kotlin builders and developers worldwide.
            </p>
          </div>
        </div>
      </div>
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
        className="top-12 -right-24 pointer-events-none opacity-[0.03]"
        size={460}
      />

      <div className="relative z-10">
        {/* ── Section header ── */}
        <SectionHeader
          num="04"
          label="Identity & Foundation"
          title="About KUG Coimbatore"
          lede="An officially recognized JetBrains developer community in the industrial and technology hub of Western Tamil Nadu."
          className="mb-10"
        />

        {/* ── Introduction and affiliation cards ── */}
        <div className="flex flex-col gap-6 mb-16 max-w-4xl">
          <p className="font-body text-base text-body leading-relaxed">
            We connect Android developers, backend systems architects, frontend engineers, and student builders. Our focus is technical precision: mastering coroutines, shipping declarative Compose UIs, and architecting resilient cross-platform applications with Kotlin Multiplatform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="card-base p-5">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-1">
                Affiliation
              </span>
              <h3 className="font-display text-base font-bold text-fg mb-1">
                JetBrains Recognized
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Registered under the global JetBrains Kotlin Community Network.
              </p>
            </div>

            <div className="card-base p-5">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-1">
                Access
              </span>
              <h3 className="font-display text-base font-bold text-fg mb-1">
                Open &amp; Free Always
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                All community meetups, workshops, and recordings are 100% free of charge.
              </p>
            </div>
          </div>
        </div>

        {/* ── Organizers section ── */}
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest uppercase text-dim block mb-10">
            Organizers &amp; Stewards
          </span>

          {/* Profile cards — stacked on mobile/tablet, side-by-side on lg */}
          <div className="org-card-grid">
            {ORGANIZERS.map((o, i) => (
              <OrganizerCard
                key={o.name}
                {...o}
                lazy={i > 0}
              />
            ))}
          </div>

          {/* Kodee mascot — restyled as a layered card */}
          <div className="mt-16">
            <KodeeCard />
          </div>
        </div>
      </div>
    </section>
  )
}
