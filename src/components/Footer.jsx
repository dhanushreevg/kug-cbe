import KugLogo from "@/components/KugLogo"

export default function Footer() {
  return (
    <footer className="bg-void border-t border-border py-14 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left: Logo & description */}
          <div className="flex flex-col gap-2 max-w-sm min-w-0">
            <div className="flex items-center gap-2.5">
              <KugLogo
                alt=""
                aria-hidden="true"
                className="w-7 h-7 shrink-0"
              />
              <span className="font-display font-bold text-lg text-fg tracking-tight">
                KUG Coimbatore
              </span>
            </div>
            <p className="font-body text-xs text-muted leading-relaxed">
              Official JetBrains Kotlin User Group in Coimbatore, Tamil Nadu. Dedicated to modern, pragmatic software engineering.
            </p>
          </div>

          {/* Right: Nav Links — wrap cleanly into rows at tablet width */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-body text-muted">
            <a
              href="https://kotlinlang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg active:text-fg transition-colors duration-150 inline-flex items-center py-1.5"
            >
              kotlinlang.org
            </a>
            <a
              href="https://www.jetbrains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg active:text-fg transition-colors duration-150 inline-flex items-center py-1.5"
            >
              JetBrains
            </a>
            <a
              href="https://kotlinlang.org/docs/kug-guidelines.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg active:text-fg transition-colors duration-150 inline-flex items-center py-1.5"
            >
              KUG Guidelines
            </a>
            <a
              href="https://play.kotlinlang.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg active:text-fg transition-colors duration-150 inline-flex items-center py-1.5"
            >
              Playground
            </a>
          </div>
        </div>

        {/* Bottom row: © 2024 KUG Coimbatore */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-dim">
          <span>&copy; 2024 KUG Coimbatore. All rights reserved.</span>
          <span>Solid Slate &amp; Dust Aesthetic</span>
        </div>
      </div>
    </footer>
  )
}
