import { useSiteTheme } from "@/hooks/useTheme"
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs"

/* Sun / moon glyphs. The moon shows when the light theme is ON (pressed),
   hinting the next state is dark. */
const SunIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </svg>
)

const MoonIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

/**
 * Carbon/Paper toggle. 44×44 px target, aria-pressed, labelled with the
 * theme it switches TO. 44px target is enforced by .theme-toggle CSS.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useSiteTheme()
  const isLight = theme === "light"
  const reduceMotion = usePrefersReducedMotion()

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme (Carbon)" : "Switch to light theme (Paper)"}
      aria-pressed={isLight}
      title={isLight ? "Carbon (dark)" : "Paper (light)"}
      className={`theme-toggle ${className}`.trim()}
    >
      <span aria-hidden="true" className={reduceMotion ? "" : "transition-transform duration-200"}>
        {isLight ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="sr-only">{isLight ? "Dark" : "Light"} theme</span>
    </button>
  )
}
