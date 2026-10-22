import { useState, useEffect } from "react"

export default function PageLoader({ onFinish }) {
  const [count, setCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    let current = 0
    let timer = null

    const step = () => {
      // Counter slows down significantly as it approaches 100
      let delay = 20
      let increment = 2

      if (current < 40) {
        increment = Math.floor(Math.random() * 5) + 3
        delay = 25
      } else if (current < 75) {
        increment = Math.floor(Math.random() * 4) + 2
        delay = 35
      } else if (current < 90) {
        increment = Math.floor(Math.random() * 3) + 1
        delay = 60
      } else if (current < 98) {
        increment = 1
        delay = 120
      } else {
        increment = 1
        delay = 200
      }

      current = Math.min(100, current + increment)
      setCount(current)

      if (current >= 100) {
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            setIsDone(false)
            document.body.style.overflow = ""
            if (onFinish) onFinish()
          }, 600)
        }, 150)
      } else {
        timer = setTimeout(step, delay)
      }
    }

    timer = setTimeout(step, 50)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [onFinish])

  if (isDone) return null

  // Format as 3-digit padded monospace number (e.g., 000, 042, 100)
  const formatted = String(count).padStart(3, "0")

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void text-white select-none transition-all duration-600 ease-in-out ${
        isExiting
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white tabular-nums">
        {formatted}
      </div>
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-text-dim mt-4">
        Kotlin User Group · CBE
      </div>
    </div>
  )
}
