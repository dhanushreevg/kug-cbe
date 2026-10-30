import { useEffect, useState } from "react"

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

  // Spy on current section
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

  return (
    <>
      {/* Minimal Solid Top Bar: background #050506 at full opacity with 1px bottom border */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#050506] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo on the left */}
          <a href="#" className="flex items-center gap-3 group select-none">
            <img
              src="/assets/kug-logo.png"
              alt="KUG Coimbatore Logo"
              className="w-7 h-7 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                KUG
              </span>
              <span className="font-mono text-[9px] tracking-wider text-[#8a8a8a] uppercase">
                Coimbatore
              </span>
            </div>
          </a>

          {/* Desktop Nav Links on the right */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-body text-xs tracking-wider uppercase transition-colors duration-150 py-1 ${
                    isActive
                      ? "text-white font-medium border-b border-white"
                      : "text-[#8a8a8a] hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="#community"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl font-body font-medium text-xs text-[#0a0a0a] bg-white hover:bg-[#e6e6e6] transition-all duration-150 active:scale-[0.98] select-none shadow-sm"
            >
              Join Group
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#8a8a8a] hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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

      {/* Mobile Full-Height Overlay (Solid #050506) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050506] flex flex-col items-start justify-center p-8 gap-6 md:hidden">
          <div className="section-label mb-2">Navigation</div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-bold text-white hover:text-[#d4d4d4] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#community"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-6 py-3 rounded-xl font-body font-medium text-sm text-[#0a0a0a] bg-white select-none w-full text-center"
          >
            Join the Group
          </a>
        </div>
      )}
    </>
  )
}
