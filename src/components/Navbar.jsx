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
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200 ${
          isScrolled
            ? "bg-void/90 backdrop-blur-sm border-b border-border shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group select-none">
            <img
              src="/assets/kug-logo.png"
              alt="KUG Coimbatore Logo"
              className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-xl text-white tracking-tight">
                KUG
              </span>
              <span className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
                Coimbatore
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-body text-sm transition-colors duration-150 py-1 ${
                    isActive
                      ? "gradient-text border-b border-kotlin-indigo/40 font-medium"
                      : "text-text-muted hover:text-white"
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
              className="hidden sm:inline-flex relative px-4 py-2 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin overflow-hidden transition-all duration-200 hover:brightness-110 hover:shadow-kotlin-md active:scale-[0.97] active:brightness-90 select-none"
            >
              Join Group
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
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

      {/* Mobile Full-Height Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-void flex flex-col items-start justify-center p-8 gap-6 md:hidden">
          <div className="section-label mb-2">Navigation</div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-2xl font-bold text-white hover:text-kotlin-violet transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#community"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-6 py-3 rounded-sm font-body font-medium text-sm text-white bg-gradient-kotlin select-none w-full text-center"
          >
            Join the Group
          </a>
        </div>
      )}
    </>
  )
}
