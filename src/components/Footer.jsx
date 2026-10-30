export default function Footer() {
  return (
    <footer className="bg-[#050506] border-t border-white/[0.08] py-14 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left: Logo & description */}
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/kug-logo.png"
                alt="KUG Coimbatore Logo"
                className="w-6 h-6 object-contain shrink-0"
              />
              <span className="font-display font-bold text-lg text-white tracking-tight">
                KUG Coimbatore
              </span>
            </div>
            <p className="font-body text-xs text-[#8a8a8a] leading-relaxed">
              Official JetBrains Kotlin User Group in Coimbatore, Tamil Nadu. Dedicated to modern, pragmatic software engineering.
            </p>
          </div>

          {/* Right: Nav Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-8 text-sm font-body text-[#8a8a8a]">
            <a
              href="https://kotlinlang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              kotlinlang.org
            </a>
            <a
              href="https://www.jetbrains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              JetBrains
            </a>
            <a
              href="https://kotlinlang.org/docs/kug-guidelines.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              KUG Guidelines
            </a>
            <a
              href="https://play.kotlinlang.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              Playground
            </a>
          </div>
        </div>

        {/* Bottom row: © 2024 KUG Coimbatore */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#666666]">
          <span>&copy; 2024 KUG Coimbatore. All rights reserved.</span>
          <span>Solid Slate &amp; Dust Aesthetic</span>
        </div>
      </div>
    </footer>
  )
}
