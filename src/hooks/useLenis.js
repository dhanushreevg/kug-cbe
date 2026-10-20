import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"

let lenisInstance = null

export function useLenis() {
  useEffect(() => {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time)
        requestAnimationFrame(raf)
      }
    }
    requestAnimationFrame(raf)

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy()
        lenisInstance = null
      }
    }
  }, [])

  return lenisInstance
}
