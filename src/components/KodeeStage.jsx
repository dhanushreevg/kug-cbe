import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs"
import KodeeGif, { KODEE_GIFS, KODEE_FRAMES } from "@/components/KodeeGif"

/* ═══════════════════════════════════════════════════════════════════════════
   KODEE STAGE — the mascot's own layout box
   ---------------------------------------------------------------------------
   Owns the walking Kodee's lane. Previously the walker lived inside the
   marquee band, whose overflow-hidden clipped its bottom and edges and let
   it overlap the hero's mode bar. Now:

   · KodeeStage renders its own lane BETWEEN the hero and the marquee band.
   · The lane never clips (no overflow-hidden anywhere up the chain) and is
     tall enough to clear the GIF at every breakpoint — 72px on mobile for
     the 64px walker, 128px on tablet+ (walker ≤ 80px), with horizontal
     padding so no edge pixel is cut.
   · The lane sits entirely below the hero (separate stacking context,
     z-index 10), so it can never overlap the hero's controls.
   · Motion is transform-only — a translate3d scrub driven by ScrollTrigger
     that walks Kodee from the lane's left padding to just inside its right
     edge, so every pixel of the mascot stays inside the stage.
   · Under prefers-reduced-motion the walker is a static first frame resting
     near the left edge — a still, visible mascot, no scrub.
   ═══════════════════════════════════════════════════════════════════════════ */

const WALK_CLEAR = 8 // px of horizontal padding kept clear on each side

export default function KodeeStage() {
  const laneRef = useRef(null)
  const walkerRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined
    const el = walkerRef.current
    const lane = laneRef.current
    if (!el || !lane) return undefined

    /* The walk range stays INSIDE the lane: from the left padding to just
       clear of the right edge. The mascot is therefore fully visible at
       rest — no half-cut entrance, no out-of-bounds pixels at any point. */
    const tween = gsap.fromTo(
      el,
      { x: WALK_CLEAR },
      {
        x: () => Math.max(WALK_CLEAR, lane.offsetWidth - el.offsetWidth - WALK_CLEAR),
        ease: "none",
        scrollTrigger: {
          trigger: lane,
          start: "top bottom",
          end: "top top",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      }
    )

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill()
      tween.kill()
      gsap.set(el, { clearProps: "x" })
    }
  }, [reducedMotion])

  return (
    <div
      ref={laneRef}
      className="kodee-lane"
      aria-hidden="true"
    >
      <span
        ref={walkerRef}
        className={`pointer-events-none z-10 select-none ${
          reducedMotion
            ? "ml-[8%]"
            : "will-change-transform"
        }`}
      >
        {/* Full colour on first paint, touch included — kodee-img applies
            no grayscale, and hover only ever adds a scale, never colour. */}
        <KodeeGif
          gif={KODEE_GIFS.walking}
          frame={KODEE_FRAMES.petite}
          alt=""
          eager
          className="kodee-img h-16 w-16 lg:h-20 lg:w-20 object-contain"
        />
      </span>
    </div>
  )
}
