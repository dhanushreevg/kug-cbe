import { useState, useEffect } from "react"

export default function PageLoader({ onFinish }) {
  const [count, setCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const TOTAL_DURATION = 3000 // 3 seconds total loading time
    const startTime = performance.now()
    let animationFrameId
    let exitTimeoutId
    let cleanupTimeoutId

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / TOTAL_DURATION)
      const currentPercent = Math.min(100, Math.floor(progress * 100))

      setCount(currentPercent)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        setCount(100)
        // Smooth transition out after reaching 100%
        exitTimeoutId = setTimeout(() => {
          setIsExiting(true)
          cleanupTimeoutId = setTimeout(() => {
            setIsDone(true)
            document.body.style.overflow = ""
            if (onFinish) onFinish()
          }, 600)
        }, 120)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (exitTimeoutId) clearTimeout(exitTimeoutId)
      if (cleanupTimeoutId) clearTimeout(cleanupTimeoutId)
      document.body.style.overflow = ""
    }
  }, [onFinish])

  if (isDone) return null

  const formatted = String(count).padStart(3, "0")

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void text-white select-none transition-all duration-600 ease-out ${
        isExiting
          ? "opacity-0 -translate-y-6 scale-98 pointer-events-none"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-64 h-64 rounded-full bg-kotlin-violet/15 blur-3xl pointer-events-none" />

      {/* Pill header */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 border border-border/80 text-[11px] font-mono tracking-widest text-text-muted uppercase mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-kotlin-violet animate-pulse" />
        <span>Kotlin User Group · CBE</span>
      </div>

      {/* Kodee Loading Mascot */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-kotlin blur-xl opacity-25 animate-pulse-dim" />
        <img
          src="/assets/kotlin_mascot_2/Digital/Emoji/kodee-loading.gif"
          alt="Kodee Loading"
          width="128"
          height="128"
          className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 object-contain select-none pointer-events-none drop-shadow-[0_8px_24px_rgba(155,89,245,0.25)]"
        />
      </div>

      {/* Progress percentage */}
      <div className="relative z-10 mt-6 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
        {formatted}<span className="text-kotlin-violet text-2xl sm:text-3xl font-semibold ml-0.5">%</span>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-52 sm:w-64 h-1.5 bg-surface-3 rounded-full overflow-hidden mt-4 border border-border/60">
        <div
          className="h-full bg-gradient-kotlin rounded-full transition-all duration-75 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>

      {/* Status subtext */}
      <div className="relative z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim mt-3.5">
        {count < 100 ? "Loading experience..." : "Ready"}
      </div>
    </div>
  )
}

