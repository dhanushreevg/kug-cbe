import { useState } from "react"

const MASCOT_MOODS = [
  {
    id: "waving",
    label: "Wave 👋",
    svg: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-waving.svg",
    speech: "Vanakkam, Coimbatore! 👋 Welcome to KUG CBE!",
    badge: "Official Mascot",
  },
  {
    id: "jumping",
    label: "Celebrate 🚀",
    svg: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-jumping.svg",
    speech: "Ready for hands-on Kotlin workshops & meetups? 🎉",
    badge: "Excited",
  },
  {
    id: "in-love",
    label: "Love 💜",
    svg: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-in-love.svg",
    speech: "Crafting modern Android & Multiplatform apps with love!",
    badge: "Community First",
  },
  {
    id: "sitting",
    label: "Focus ☕",
    svg: "/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-sitting.svg",
    speech: "Zero boilerplate, pure productivity. That's Kotlin.",
    badge: "Zen Mode",
  },
]

export default function HeroMascotCard() {
  const [activeMood, setActiveMood] = useState(MASCOT_MOODS[0])
  const [isWiggling, setIsWiggling] = useState(false)

  const handleMascotClick = () => {
    setIsWiggling(true)
    setTimeout(() => setIsWiggling(false), 800)
    // Cycle to next mood
    const nextIndex = (MASCOT_MOODS.findIndex((m) => m.id === activeMood.id) + 1) % MASCOT_MOODS.length
    setActiveMood(MASCOT_MOODS[nextIndex])
  }

  return (
    <div className="reveal relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 mascot-glow-intense rounded-full scale-125 pointer-events-none -z-10 animate-pulse-glow" />

      {/* Floating speech bubble */}
      <div className="mb-4 w-full max-w-sm">
        <div className="speech-bubble rounded-2xl px-5 py-3 text-sm text-white/90 font-medium transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-kotlin-purple animate-ping" />
            <span className="text-xs font-mono text-kotlin-light uppercase tracking-wider">
              Kodee says:
            </span>
            <span className="ml-auto text-[10px] font-mono text-white/40 bg-white/5 rounded px-2 py-0.5">
              {activeMood.badge}
            </span>
          </div>
          <p className="text-sm font-sans leading-snug">{activeMood.speech}</p>
        </div>
      </div>

      {/* Mascot Glass Stage */}
      <div className="relative glass-card w-full p-8 flex flex-col items-center justify-center border-kotlin-purple/25 shadow-2xl shadow-kotlin-purple/10 overflow-hidden group">
        {/* Subtle decorative grid background in card */}
        <div className="absolute inset-0 bg-[radial-gradient(#7F52FF_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Floating Tech Badges */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs font-mono text-kotlin-light border-kotlin-purple/30 shadow-sm animate-float">
          <span>🤖</span>
          <span>Android & Compose</span>
        </div>
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs font-mono text-kotlin-light border-kotlin-purple/30 shadow-sm animate-float-slow">
          <span>🌐</span>
          <span>Multiplatform</span>
        </div>

        {/* Mascot Center Illustration */}
        <div
          onClick={handleMascotClick}
          className={`relative z-10 my-4 cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95 ${
            isWiggling ? "animate-wiggle" : "animate-float"
          }`}
          title="Click to interact with Kodee!"
        >
          <img
            key={activeMood.id}
            src={activeMood.svg}
            alt={`Kodee Mascot - ${activeMood.label}`}
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-[0_15px_30px_rgba(127,82,255,0.45)] transition-opacity duration-300 animate-fade-in"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-0.5 text-[11px] font-mono text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to change mood! ✨
          </div>
        </div>

        {/* Mood Selector Buttons */}
        <div className="relative z-20 mt-4 flex flex-wrap justify-center gap-2 w-full pt-4 border-t border-white/10">
          {MASCOT_MOODS.map((mood) => {
            const isActive = activeMood.id === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMood(mood)}
                className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 ${
                  isActive
                    ? "bg-kotlin-purple text-white font-semibold shadow-md shadow-kotlin-purple/40 scale-105 border border-kotlin-purple"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <span>{mood.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
