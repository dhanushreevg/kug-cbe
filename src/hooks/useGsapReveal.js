import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useGsapReveal(selector = ".reveal", deps = []) {
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const els = document.querySelectorAll(selector)

    if (reduceMotion) {
      els.forEach((el) => {
        el.style.opacity = "1"
        el.style.transform = "none"
      })
      return
    }

    // Reveal elements with 0.08s stagger
    const triggers = []

    const anim = gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: els[0] || document.body,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    )

    if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)

    return () => {
      triggers.forEach((t) => t.kill())
      anim.kill()
    }
  }, deps)
}
