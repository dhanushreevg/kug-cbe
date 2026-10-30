import { useEffect, useState } from "react"

/**
 * Media query hooks used by the responsive/motion feature set.
 * Both are SSR-guarded and listener-clean.
 */

function subscribe(query, onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const mq = window.matchMedia(query)
  if (mq.addEventListener) {
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }
  mq.addListener(onChange)
  return () => mq.removeListener(onChange)
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const update = () => setMatches(window.matchMedia(query).matches)
    update()
    const unsubscribe = subscribe(query, update)
    return unsubscribe
  }, [query])

  return matches
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/** True on touch-first devices (no reliable hover, coarse pointer). */
export function useIsTouchDevice() {
  return useMediaQuery(
    '(pointer: coarse), (hover: none) and (pointer: coarse)'
  )
}
