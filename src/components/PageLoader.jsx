import { useState, useEffect } from "react"

const LOADING_STEPS = [
  { at: 0, text: "Initializing Kotlin User Group..." },
  { at: 30, text: "Waking up Kodee & community..." },
  { at: 65, text: "Compiling Coimbatore experiences..." },
  { at: 92, text: "Ready to explore! 💜" },
]

export default function PageLoader({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(LOADING_STEPS[0].text)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Disable body scroll while loading
    document.body.style.overflow = "hidden"

    let currentProgress = 0
    const interval = setInterval(() => {
      // Smooth dynamic increments
      const increment = Math.floor(Math.random() * 8) + 4
      currentProgress = Math.min(100, currentProgress + increment)
      setProgress(currentProgress)

      // Update text based on progress
      const matched = [...LOADING_STEPS].reverse().find((s) => currentProgress >= s.at)
      if (matched) {
        setStatusText(matched.text)
      }

      if (currentProgress >= 100) {
        clearInterval(interval)
        // Start exit animation after reaching 100%
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            setIsDone(true)
            document.body.style.overflow = ""
            if (onFinish) onFinish()
          }, 650) // exit animation duration
        }, 400) // slight hold at 100%
      }
    }, 60)

    return () => {
      clearInterval(interval)
      document.body.style.overflow = ""
    }
  }, [onFinish])

  if (isDone) return null

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070709] text-white select-none transition-all duration-700 ease-out ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none filter blur-sm"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full mascot-glow-intense opacity-60 pointer-events-none animate-pulse-glow" />

      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#7F52FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Center content container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Kodee Loading GIF Animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-kotlin-purple/30 rounded-full blur-xl scale-125 animate-pulse-glow" />
          <img
            src="/assets/kotlin_mascot_2/Digital/Emoji/kodee-loading.gif"
            alt="Kodee Loading Animation"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(127,82,255,0.4)]"
          />
        </div>

        {/* Wordmark & Title */}
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 24H0V0h24L12 12Z" fill="#7F52FF" />
          </svg>
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.25em] text-kotlin-light">
            KUG Coimbatore
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
          Kotlin <span className="kotlin-gradient-text">User Group</span>
        </h2>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mb-3 relative p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-kotlin-purple via-kotlin-light to-kotlin-coral transition-all duration-150 ease-out shadow-[0_0_12px_rgba(127,82,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text & percentage */}
        <div className="flex items-center justify-between w-56 sm:w-64 text-xs font-mono">
          <span className="text-white/50 truncate max-w-[190px] text-left">
            {statusText}
          </span>
          <span className="text-kotlin-light font-semibold tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom subtle footnote */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/30 tracking-widest uppercase">
        Coimbatore, Tamil Nadu · Powered by Kotlin
      </div>
    </div>
  )
}
