import { useEffect, useState } from "react"

const EVENT = {
  image: "/assets/kug-popup.png",
  title: "KUG Coimbatore Developers Meetup",
  date: "December 20, 2026 · CBE",
  link: "https://luma.com/7kvusrr5",
}

const DISMISSED_KEY = "kug-event-notification-dismissed"

export default function EventNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let isDismissed = false
    try {
      isDismissed =
        window.sessionStorage.getItem(DISMISSED_KEY) === "true"
    } catch {
      // Storage can be blocked by browser privacy settings.
    }

    if (isDismissed) return undefined

    const timer = window.setTimeout(() => setIsVisible(true), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return undefined

    const onKeyDown = (event) => {
      if (event.key === "Escape") dismissNotification()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isVisible])

  const dismissNotification = () => {
    // Delete this sessionStorage check to show the card on every page load.
    // Change sessionStorage to localStorage to keep it dismissed across sessions.
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "true")
    } catch {
      // The notification still dismisses for the current render if storage is blocked.
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside
      className="event-notification fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-40 rounded-xl border border-border-strong bg-surface-2 p-3 shadow-2xl sm:bottom-[6rem] sm:left-auto sm:right-6 sm:w-[min(100%-3rem,24rem)] sm:p-4"
      role="status"
      aria-live="polite"
      aria-label="New event notification"
    >
      <button
        type="button"
        aria-label="Close notification"
        onClick={dismissNotification}
        className="tap-44 absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-3 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      </button>

      <div className="flex items-start gap-3 pr-7">
        <img
          src={EVENT.image}
          alt="Kotlin Developers Meetup Coimbatore"
          className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            New Event
          </p>
          <h2 className="mt-1 font-display text-sm font-bold leading-snug text-fg">
            {EVENT.title}
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted">{EVENT.date}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 pl-[84px]">
        <a
          href={EVENT.link}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-44 inline-flex items-center justify-center rounded-lg bg-fg px-3 py-2 font-body text-xs font-semibold text-ink transition-colors hover:bg-fg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        >
          Register on Luma
        </a>
        <button
          type="button"
          onClick={dismissNotification}
          className="tap-44 inline-flex items-center rounded-lg px-1 py-2 font-body text-xs text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        >
          Maybe later
        </button>
      </div>
    </aside>
  )
}
