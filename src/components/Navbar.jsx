import { useEffect, useRef, useState } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import KugLogo from "@/components/KugLogo"

const NAV_LINKS = [
  { label: "Events", href: "#events" },
  { label: "Mascot", href: "#kodee" },
  { label: "Arcade", href: "#arcade" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#community" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const overlayRef = useRef(null)

  // Scroll-spy
  useEffect(() => {
    const sectionIds = ["events", "kodee", "arcade", "about", "community", "resources", "contact"]
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Mobile overlay: scroll lock, focus trap, Escape to close, auto-close
  // if the viewport grows to desktop while it is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const overlay = overlayRef.current
    const previousFocus = document.activeElement
    document.body.style.overflow = "hidden"

    const focusables = overlay
      ? Array.from(
          overlay.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : []

    window.requestAnimationFrame(() => focusables[0]?.focus())

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsMobileMenuOpen(false)
        return
      }
      if (event.key !== "Tab" || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("resize", onResize)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", onResize)
      document.body.style.overflow = ""
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Minimal Solid Top Bar: themed surface at full opacity with themed 1px border */}
      <header className="site-header fixed top-0 left-0 right-0 z-50 bg-void border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-10 lg:px-16 flex items-center justify-between gap-2">
          {/* Logo on the left */}
          <a href="#" className="flex items-center gap-3 group select-none min-w-0">
            <KugLogo
              alt=""
              className="w-7 h-7 shrink-0 group-hover:scale-105 transition-transform duration-200"
              aria-hidden="true"
            />
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-display font-bold text-lg text-fg tracking-tight">
                KUG
              </span>
              <span className="font-mono text-[11px] tracking-wider text-muted uppercase truncate">
                Coimbatore
              </span>
            </div>
          </a>

          {/* Desktop Nav Links on the right (hidden below 1024px) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-body text-xs tracking-wider uppercase transition-colors duration-150 py-1 ${
                    isActive
                      ? "text-fg font-medium border-b border-fg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right: theme toggle (always), CTA (desktop), hamburger (< 1024px) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />

            <a
              href="https://www.linkedin.com/groups/42835384/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex px-4 py-2.5 rounded-xl font-body font-medium text-xs text-ink bg-fg hover:bg-fg-hover transition-all duration-150 active:scale-[0.98] select-none"
            >
              Join Group
            </a>

            {/* Mobile Hamburger Button — 44×44 target */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex h-11 w-11 items-center justify-center text-muted hover:text-fg hover:border-fg transition-colors"
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Height Overlay (< 1024px), scroll-locked, focus-trapped */}
      {isMobileMenuOpen && (
        <div
          ref={overlayRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="mobile-overlay fixed inset-x-0 top-0 z-40 overflow-y-auto bg-void lg:hidden"
        >
          <div className="flex min-h-full flex-col items-start justify-center gap-5 p-6 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <div className="flex w-full items-center justify-between mb-1">
              <div className="section-label !mb-0">Navigation</div>
              <ThemeToggle />
            </div>

            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-2xl font-bold text-fg hover:text-body transition-colors py-1.5"
              >
                {link.label}
              </a>
            ))}

            <a
              href="https://www.linkedin.com/groups/42835384/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 px-6 py-3.5 rounded-xl font-body font-medium text-sm text-ink bg-fg select-none w-full text-center active:scale-[0.98] transition-transform"
            >
              Join Group on LinkedIn
            </a>
          </div>
        </div>
      )}
    </>
  )
}
