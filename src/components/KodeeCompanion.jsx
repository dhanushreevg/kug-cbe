import { useEffect, useState } from "react"

const QUICK_TIPS = [
  "Vanakkam! Welcome to KUG Coimbatore.",
  "Kotlin 2.0 default K2 compiler brings 2x speedups.",
  "Compose Multiplatform lets you share UI across iOS and Android.",
  "Coroutines offer structured concurrency without thread blocking.",
]

export default function KodeeCompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  const cycleTip = () => {
    setTipIndex((prev) => (prev + 1) % QUICK_TIPS.length)
  }

  /* The close button reads [esc], so honour the Escape key while open. */
  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  return (
    <div className="kodee-companion fixed z-30 select-none">
      {/* Expanded Dialog Box */}
      {isOpen && (
        <div className="mb-3 bg-surface border border-border rounded-xl p-4 shadow-2xl w-72 max-w-[calc(100vw-2rem)] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Kodee Terminal
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-dim hover:text-fg font-mono text-xs p-1"
              aria-label="Close Companion"
            >
              [esc]
            </button>
          </div>

          <div
            onClick={cycleTip}
            className="cursor-pointer bg-surface-2 border border-border rounded-xl p-3 hover:border-border-strong transition-colors"
          >
            <p className="font-body text-xs text-body leading-relaxed">
              {QUICK_TIPS[tipIndex]}
            </p>
            <span className="font-mono text-[11px] text-muted block mt-2">
              Next insight &gt;
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1 font-mono text-xs">
            <a
              href="#events"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-muted hover:text-fg hover:bg-surface-3 rounded-lg transition-colors flex justify-between"
            >
              <span>01. Events</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#kodee"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-muted hover:text-fg hover:bg-surface-3 rounded-lg transition-colors flex justify-between"
            >
              <span>02. Mascot Spec</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#arcade"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-muted hover:text-fg hover:bg-surface-3 rounded-lg transition-colors flex justify-between"
            >
              <span>03. Kodee Arcade 🎮</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#community"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-muted hover:text-fg hover:bg-surface-3 rounded-lg transition-colors flex justify-between"
            >
              <span>04. Join Chapter</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating trigger — 44×44 target, clears the iOS home indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-surface-2 border border-border rounded-xl flex items-center justify-center hover:border-border-strong hover:bg-surface-3 active:scale-95 transition-all duration-200 group"
        aria-label={isOpen ? "Close Kodee Companion" : "Open Kodee Companion"}
        aria-expanded={isOpen}
      >
        <img
          src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-petite-56px-24px.svg"
          alt="Kodee Companion"
          className="w-6 h-6 object-contain kodee-img group-hover:scale-110 transition-transform duration-200"
        />
      </button>
    </div>
  )
}
