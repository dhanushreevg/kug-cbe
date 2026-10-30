import { useEffect, useRef, useState } from "react"
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMotionPrefs"

/* ─── Static frames ──────────────────────────────────────────────────────── */
/* Under prefers-reduced-motion every GIF renders as a still PNG frame.      */
export const KODEE_FRAMES = {
  petite: "/assets/kotlin_mascot_2/Digital/PNG/Kodee_Assets_Digital_Kodee-petite-56px-24px.png",
  welcoming: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-welcoming.png",
  excited: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-excited.png",
  pleased: "/assets/kotlin_mascot_2/Digital/Emoji/png/kodee-pleased.png",
}

const GIF_DIR = "/assets/kotlin_mascot_2/Digital/Emoji"
export const KODEE_GIFS = {
  /* Re-encoded as a 38 KB animated WebP (49 frames) — the 131 KB original
     GIF broke the <100 KB per-image budget. Visually identical. */
  loading: `${GIF_DIR}/kodee-loading.webp`,
  walking: `${GIF_DIR}/kodee-walking.gif`,
  greetings: `${GIF_DIR}/kodee-greetings.gif`,
  floating: `${GIF_DIR}/kodee-floating.gif`,
  happy: `${GIF_DIR}/kodee-happy.gif`,
}

/**
 * KodeeGif — a GIF that obeys the house rules:
 *  - prefers-reduced-motion: renders the PNG frame instead of the GIF,
 *  - off-screen: paused by swapping to the frame via IntersectionObserver
 *    (restored automatically when it scrolls back into view),
 *  - `staticBelowNarrow`: below 640px always renders the frame (kept for the
 *    hero greeting, so the layout never shifts on small screens),
 *  - first frame preload is never lazy when `eager` is set.
 */
export default function KodeeGif({
  gif,
  frame,
  alt = "",
  className = "",
  staticBelowNarrow = false,
  offscreenPause = true,
  eager = false,
  ...rest
}) {
  const reducedMotion = usePrefersReducedMotion()
  const narrow = useMediaQuery("(max-width: 639px)")
  const imgRef = useRef(null)
  const [visible, setVisible] = useState(true)

  const staticMode =
    reducedMotion || (staticBelowNarrow && narrow) || !gif

  useEffect(() => {
    if (staticMode || !offscreenPause) return
    const el = imgRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "180px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [staticMode, offscreenPause])

  const paused = offscreenPause && !visible
  const src = staticMode || paused ? frame : gif

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      className={`select-none ${className}`.trim()}
      {...rest}
    />
  )
}
