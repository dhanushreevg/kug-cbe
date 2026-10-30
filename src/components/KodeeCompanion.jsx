import { useState } from "react"

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

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Expanded Dialog Box */}
      {isOpen && (
        <div className="mb-3 bg-[#111111] border border-white/[0.08] rounded-xl p-4 shadow-2xl w-72 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#8a8a8a]">
              Kodee Terminal
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#666666] hover:text-white font-mono text-xs p-1"
              aria-label="Close Companion"
            >
              [esc]
            </button>
          </div>

          <div
            onClick={cycleTip}
            className="cursor-pointer bg-[#141414] border border-white/[0.08] rounded-xl p-3 hover:border-white/[0.18] transition-colors"
          >
            <p className="font-body text-xs text-[#d4d4d4] leading-relaxed">
              {QUICK_TIPS[tipIndex]}
            </p>
            <span className="font-mono text-[10px] text-[#8a8a8a] block mt-2">
              Next insight &gt;
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1 font-mono text-xs">
            <a
              href="#events"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-[#8a8a8a] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex justify-between"
            >
              <span>01. Events</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#kodee"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-[#8a8a8a] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex justify-between"
            >
              <span>02. Mascot Spec</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#arcade"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-[#8a8a8a] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex justify-between"
            >
              <span>03. Kodee Arcade 🎮</span>
              <span>&rarr;</span>
            </a>
            <a
              href="#community"
              onClick={() => setIsOpen(false)}
              className="py-1 px-2 text-[#8a8a8a] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex justify-between"
            >
              <span>04. Join Chapter</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating trigger with 12px radius */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-[#141414] border border-white/[0.08] rounded-xl flex items-center justify-center hover:border-white/[0.2] hover:bg-[#1a1a1a] active:scale-95 transition-all duration-200 group shadow-lg"
        aria-label="Kodee Companion Toggle"
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
