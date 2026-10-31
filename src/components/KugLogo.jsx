import { useSiteTheme } from "@/hooks/useTheme"

/**
 * KUG logo mark. Uses the small 256px derivative for chrome and swaps to the
 * "ink" variant (dark chevrons) on the Paper theme, where light-grey ink
 * would vanish (≈1.6:1 on #F5F5F5). The mark always stays visible.
 * The hero keeps its own full-resolution /assets/kug-logo.png for particle
 * sampling — this component is only for navbar/footer chrome.
 */
export default function KugLogo({ className = "", alt = "KUG Coimbatore Logo", ...rest }) {
  const [theme] = useSiteTheme()
  const src =
    theme === "light" ? "/assets/kug-logo-ink-256.png" : "/assets/kug-logo-256.png"

  return (
    <img
      src={src}
      alt={alt}
      width={256}
      height={256}
      decoding="async"
      draggable="false"
      className={`object-contain ${className}`.trim()}
      {...rest}
    />
  )
}
