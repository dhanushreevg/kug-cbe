import { useState, useEffect } from "react"

export default function PageLoader({ onFinish }) {
  const [count, setCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const TOTAL_DURATION = 1600 // Snappy loading time
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
        exitTimeoutId = setTimeout(() => {
          setIsExiting(true)
          cleanupTimeoutId = setTimeout(() => {
            setIsDone(true)
            document.body.style.overflow = ""
            if (onFinish) onFinish()
          }, 400)
        }, 100)
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050506] text-white select-none transition-all duration-400 ease-out ${
        isExiting
          ? "opacity-0 -translate-y-4 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      {/* Pill header */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] border border-white/[0.08] text-[11px] font-mono tracking-widest text-[#8a8a8a] uppercase mb-6 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>Kotlin User Group · CBE</span>
      </div>

      {/* Kodee Loading Mascot */}
      <div className="relative z-10 flex items-center justify-center">
        <img
          src="/assets/kotlin_mascot_2/Digital/Emoji/kodee-loading.gif"
          alt="Kodee Loading"
          width="128"
          height="128"
          className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain select-none pointer-events-none filter grayscale opacity-90"
        />
      </div>

      {/* Progress percentage */}
      <div className="relative z-10 mt-6 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
        {formatted}<span className="text-[#8a8a8a] text-2xl font-semibold ml-0.5">%</span>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-52 sm:w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-4 border border-white/[0.08]">
        <div
          className="h-full bg-white rounded-full transition-all duration-75 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>

      {/* Status subtext */}
      <div className="relative z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-[#666666] mt-3.5">
        {count < 100 ? "Loading experience..." : "Ready"}
      </div>
    </div>
  )
}
