export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <img
            src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sitting.svg"
            alt="Kodee sitting"
            className="w-10 h-10 object-contain shrink-0 animate-float"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-white">
              KUG Coimbatore
            </span>
            <span className="text-xs text-white/45 font-mono">
              Coimbatore, Tamil Nadu · Powered by Kotlin & Kodee 💜
            </span>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
          <a
            href="https://kotlinlang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kotlin-light transition-colors"
          >
            kotlinlang.org
          </a>
          <a
            href="https://www.jetbrains.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kotlin-light transition-colors"
          >
            JetBrains
          </a>
          <a
            href="https://kotlinlang.org/docs/kug-guidelines.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kotlin-light transition-colors"
          >
            KUG Guidelines
          </a>
          <a
            href="https://play.kotlinlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-kotlin-light transition-colors"
          >
            Playground
          </a>
        </nav>
      </div>
    </footer>
  )
}
