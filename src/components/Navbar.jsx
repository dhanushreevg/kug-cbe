import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const navItems = navRef.current?.querySelectorAll(".nav-anim-item")
    if (navItems && navItems.length > 0) {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reduceMotion) {
        navItems.forEach((el) => {
          el.style.opacity = "1"
          el.style.transform = "none"
        })
        return
      }

      gsap.fromTo(
        navItems,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      )
    }
  }, [])

  const navLinks = [
    { label: "Events", href: "#events" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
    { label: "Community", href: "#community" },
    { label: "Contact", href: "#contact" },
  ]

  const handleLinkClick = (e, href) => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b border-white/5 ${
        isScrolled ? "glass-strong bg-kotlin-dark/90 shadow-lg shadow-black/20" : "glass-strong"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        {/* Left: Wordmark */}
        <a
          href="#"
          className="nav-anim-item flex items-center gap-2.5 font-semibold text-white tracking-tight hover:opacity-90 transition-opacity"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 24H0V0h24L12 12Z" fill="#7F52FF" />
          </svg>
          <span className="text-base font-semibold">KUG Coimbatore</span>
        </a>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-anim-item text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Join CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-anim-item glass-btn rounded-full px-4 py-2 text-sm font-semibold text-kotlin-purple inline-flex items-center gap-1.5"
          >
            <span>Join Us</span>
            <span>→</span>
          </a>

          {/* Hamburger button (mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong border-b border-white/10 px-6 py-6 animate-fade-in flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-base font-medium text-white/80 hover:text-white transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
