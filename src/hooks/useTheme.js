import { useEffect, useState } from "react"

/**
 * Site theme store — Carbon (dark) / Paper (light).
 *
 * Single source of truth lives on <html data-theme>, written by the inline
 * script in index.html before first paint. This module subscribes React
 * components to changes and persists the choice inside try/catch.
 */

export const THEME_STORAGE_KEY = "kug-cbe-theme"

const listeners = new Set()

function readTheme() {
  if (typeof document === "undefined") return "dark"
  const attr = document.documentElement.getAttribute("data-theme")
  if (attr === "light" || attr === "dark") return attr
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  }
  return "dark"
}

export function getSiteTheme() {
  return readTheme()
}

/** Apply + persist a theme choice. Storage failures are swallowed. */
export function setSiteTheme(next) {
  const theme = next === "light" ? "light" : "dark"
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* Private mode / storage disabled — theme still applies for the session. */
  }
  document.documentElement.setAttribute("data-theme", theme)
  listeners.forEach((notify) => notify(theme))
}

function storeTheme(theme) {
  listeners.forEach((notify) => notify(theme))
}

export function subscribeTheme(notify) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

/** React hook: [theme (light|dark), setTheme]. */
export function useSiteTheme() {
  const [theme, setLocal] = useState(readTheme)

  useEffect(() => {
    const notify = (next) => setLocal(next)
    listeners.add(notify)
    // Catch external edits (e.g. another tab via storage) that bypass store.
    const onStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) storeTheme(readTheme())
    }
    window.addEventListener("storage", onStorage)
    return () => {
      listeners.delete(notify)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  return [theme, setSiteTheme]
}
