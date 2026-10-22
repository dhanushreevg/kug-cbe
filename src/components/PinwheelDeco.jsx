export default function PinwheelDeco({ className = "", size = 360 }) {
  return (
    <img
      src="/assets/kug-logo.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={`pinwheel-deco pointer-events-none select-none object-contain ${className}`}
      style={{
        filter: "grayscale(1) brightness(0.85)",
        opacity: 0.05,
      }}
    />
  )
}
