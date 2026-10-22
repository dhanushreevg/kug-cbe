import { useState } from "react"

export default function KodeeCompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [reactionIndex, setReactionIndex] = useState(0)

  const quickMessages = [
    "Vanakkam! Welcome to KUG Coimbatore 🚀",
    "Got questions about Kotlin Multiplatform? Ask us at the next meetup!",
    "Join the Coimbatore developer community today 💜",
    "Kotlin 2.0 is blazing fast. Have you tried the K2 compiler yet?",
  ]

  const cycleMessage = () => {
    setReactionIndex((prev) => (prev + 1) % quickMessages.length)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Expanded Companion Card */}
      {isOpen && (
        <div className="mb-3 glass-strong rounded-2xl p-5 border-kotlin-purple/30 shadow-2xl shadow-black/60 w-80 animate-fade-in flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img
                src="/assets/kotlin_mascot_2/Digital/Emoji/kodee-happy.gif"
                alt="Kodee"
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-sm text-white">Kodee Companion</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white text-xs p-1 rounded-md hover:bg-white/5 transition-colors"
              aria-label="Close Kodee popup"
            >
              ✕
            </button>
          </div>

          <div
            onClick={cycleMessage}
            className="cursor-pointer bg-kotlin-purple/10 border border-kotlin-purple/20 rounded-xl p-3 text-xs text-white/90 leading-relaxed hover:bg-kotlin-purple/15 transition-colors group"
          >
            <p className="font-sans">{quickMessages[reactionIndex]}</p>
            <span className="block mt-1 text-[10px] font-mono text-kotlin-light/70 group-hover:text-kotlin-light">
              Tap to see another tip ↻
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-1.5 pt-1">
            <a
              href="#events"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>📅 Upcoming Events</span>
              <span className="text-white/40">→</span>
            </a>
            <a
              href="#kodee"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🎨 Mascot Playground</span>
              <span className="text-white/40">→</span>
            </a>
            <a
              href="https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-kotlin-purple hover:text-kotlin-light bg-kotlin-purple/10 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>💜 Join KUG Coimbatore</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 glass-strong rounded-full p-2.5 pr-4 border-kotlin-purple/35 shadow-xl shadow-kotlin-purple/20 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open Kodee assistant"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-kotlin-purple/40 rounded-full blur-md group-hover:blur-lg transition-all animate-pulse-glow" />
          <img
            src="/assets/kotlin_mascot_2/Digital/Emoji/kodee-floating.gif"
            alt="Kodee floating"
            className="w-10 h-10 object-contain relative z-10"
          />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[11px] font-mono font-semibold text-kotlin-light leading-none">
            Kodee
          </span>
          <span className="text-[10px] text-white/60 leading-none mt-0.5">
            {isOpen ? "Close" : "Say Hi 👋"}
          </span>
        </div>
      </button>
    </div>
  )
}
