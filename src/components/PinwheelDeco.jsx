export default function PinwheelDeco({ className = "", size = 360 }) {
  return (
    <img
      /* Decorative: the 256px derivative is plenty at ≤ 512 CSS px and costs
         17 KB instead of the 598 KB hero-sampler original. Lazy + async keeps
         it out of the initial-load window. */
      src="/assets/kug-logo-256.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable="false"
      className={`pinwheel-deco pointer-events-none select-none object-contain ${className}`}
      style={{
        filter: "var(--pinwheel-filter)",
        opacity: 0.05,
      }}
    />
  )
}
