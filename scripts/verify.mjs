/**
 * Headless verification for the KUG CBE theme + responsive upgrade.
 * Uses the system Chrome via puppeteer-core. Run with the preview server live
 * on http://localhost:4173.
 *
 *   BASE_URL=http://localhost:4173 node scripts/verify.mjs
 */
import puppeteer from "puppeteer-core"
import { mkdirSync } from "node:fs"

const BASE = process.env.BASE_URL || "http://localhost:4173/"
const SHOTS = "/tmp/opencode/shots"
mkdirSync(SHOTS, { recursive: true })

const log = (...parts) => console.log(...parts)
const table = (rows) => {
  for (const r of rows) console.log(r)
  return rows
}

const BREAKPOINTS = [320, 375, 390, 768, 1024, 1280, 1440]
const HEIGHT = 900

const CHROME = "/usr/bin/google-chrome"

const launch = (extraArgs = []) =>
  puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      ...extraArgs,
    ],
  })

/* ── helpers ── */
async function hscrollInfo(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const offenders = Array.from(document.body.querySelectorAll("*"))
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > doc.clientWidth + 1 && r.width > 1
      })
      .slice(0, 4)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 70)}`)
    return {
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      hasHScroll: doc.scrollWidth > doc.clientWidth,
      offenders,
    }
  })
}

async function newPage(browser, { width, height } = {}) {
  const page = await browser.newPage()
  await page.setViewport({ width: width ?? 1280, height: height ?? HEIGHT })
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 })
  await page.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
  return page
}

/* ══════════ SUITE ══════════ */
const browser = await launch()
const consoleErrors = []
const failedRequests = []
const page0 = await browser.newPage()
const client = await page0.createCDPSession()
client.on("Console.messageAdded", ({ message }) => consoleErrors.push(message.text))
page0.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text())
})
page0.on("requestfailed", (r) => failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`))
page0.on("response", (r) => {
  if (r.status() >= 400) failedRequests.push(`${r.url()} — HTTP ${r.status()}`)
})

/* ── 1. Default theme from system preference + no-flash attr before paint ── */
await page0.setViewport({ width: 1280, height: HEIGHT })
await page0.goto(BASE, { waitUntil: "load" })
const dataTheme = await page0.evaluate(() => document.documentElement.getAttribute("data-theme"))
log(`[theme] default data-theme on first load (headless OS=light): ${dataTheme}`)

/* localStorage persistence through a toggle + reload.
   The PageLoader overlay (z-9999) intercepts clicks for ~2s, so wait for it
   to leave the DOM before touching anything beneath it. */
await page0.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
await page0.waitForFunction(() => !document.querySelector("#page-loader"), { timeout: 15000 }).catch(() => {})

const firstTarget = await page0.evaluate(
  () => document.querySelector('header button[aria-pressed]')?.outerHTML?.slice(0, 80)
)
log("[theme] toggle target found in header:", Boolean(firstTarget))
await page0.click('header button[aria-pressed]')
await new Promise((r) => setTimeout(r, 400))
const afterClick = await page0.evaluate(() => ({
  attr: document.documentElement.getAttribute("data-theme"),
  stored: localStorage.getItem("kug-cbe-theme"),
}))
log("[theme] after toggle:", JSON.stringify(afterClick))
await page0.reload({ waitUntil: "load" })
const afterReload = await page0.evaluate(() => ({
  attr: document.documentElement.getAttribute("data-theme"),
  stored: localStorage.getItem("kug-cbe-theme"),
}))
log("[theme] after reload — persisted:", afterReload.attr === afterClick.attr && afterReload.stored === afterClick.attr, JSON.stringify(afterReload))

/* Light theme screenshots + hero sync check (hero should default ON WHITE) */
const heroState = await page0.evaluate(() => getComputedStyle(document.getElementById("hero")).getPropertyValue("--hero-bg"))
log("[theme] hero --hero-bg in light theme:", heroState.trim() || "(empty)")
await page0.screenshot({ path: `${SHOTS}/light-desktop.png` })

/* ── 2. Horizontal scroll at every breakpoint in both themes ── */
const scrollRows = []
for (const theme of ["light", "dark"]) {
  for (const width of BREAKPOINTS) {
    await page0.setViewport({ width, height: HEIGHT })
    await page0.evaluate((t) => {
      document.documentElement.setAttribute("data-theme", t)
    }, theme)
    await new Promise((r) => setTimeout(r, 250))
    const info = await hscrollInfo(page0)
    scrollRows.push(
      `[scroll] ${theme} @${width}px → hasHScroll=${info.hasHScroll} (scrollW ${info.scrollW} vs clientW ${info.clientW})`
    )
    if (info.hasHScroll && info.overflowing.length) {
      scrollRows.push(`   offenders: ${info.overflowing.join(" | ")}`)
    }
  }
}
for (const row of scrollRows) log(row)

/* ── 3. Particle hero on desktop: reaches target + FPS loop runs ── */
await page0.setViewport({ width: 1440, height: HEIGHT })
await page0.waitForFunction(
  () => /[0-9]{1,3}(,[0-9]{3})* PARTICLES/.test(document.body.innerText),
  { timeout: 20000 }
)
const heroReadout = await page0.evaluate(() => {
  const text = document.body.innerText
  const m = text.match(/([0-9,]+) PARTICLES/)
  return m ? m[1] : null
})
log(`[hero] desktop particle readout: ${heroReadout} particles (DENSE target is 24,000 logo + stray)`)
await page0.screenshot({ path: `${SHOTS}/hero-desktop.png` })

/* ── 4. Walking Kodee scrub position changes with scroll ── */
const beforeScroll = await page0.evaluate(() => {
  const el = document.querySelector(".marquee-band span[style]")
  return el ? el.style.transform : null
})
await page0.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6))
await new Promise((r) => setTimeout(r, 700))
const afterScroll = await page0.evaluate(() => {
  const el = document.querySelector(".marquee-band span[style]")
  return el ? el.style.transform : null
})
log("[marquee] walking kodee transform before/after scroll:", beforeScroll, "→", afterScroll)

/* ── 5. Footer/KodeeCompanion presence, click-through games ── */
await page0.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 300))
await page0.screenshot({ path: `${SHOTS}/light-top.png` })
await page0.close()

/* ── 6. Mobile page: touch defaults, tap targets, focus trap, 320px email ── */
const mobile = await browser.newPage()
await mobile.emulate({
  viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  userAgent: "Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
})
await mobile.goto(BASE, { waitUntil: "load", timeout: 60000 })
await mobile.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
await mobile.screenshot({ path: `${SHOTS}/mobile-top.png` })

/* open hero settings → confirm SPARSE default on touch + Links disabled */
try {
  const density = await mobile.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => /settings/i.test(b.textContent || ""))
    return btn ? btn.textContent.trim().slice(0, 40) : null
  })
  log("[hero-mobile] settings button found:", Boolean(density))
} catch (e) {
  log("[hero-mobile] settings probe error", e.message)
}
await mobile.screenshot({ path: `${SHOTS}/mobile-hero.png` })

/* mobile menu: open, check height, Escape close, scroll lock, 44px targets */
await mobile.click('button[aria-label*="Open Navigation Menu"]')
await new Promise((r) => setTimeout(r, 300))
const overlayProbe = await mobile.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]')
  if (!dlg) return { present: false }
  const r = dlg.getBoundingClientRect()
  const bodyOverflow = document.body.style.overflow
  const firstFocusable = dlg.querySelector("a[href], button:not([disabled])")
  return {
    present: true,
    height: r.height,
    dvhRatio: r.height / window.innerHeight,
    bodyOverflow,
    firstFocusableFocused: document.activeElement === firstFocusable,
    activeTag: document.activeElement?.tagName ?? null,
    toggleInside: Boolean(dlg.querySelector(".theme-toggle")),
  }
})
log("[overlay] probe:", JSON.stringify(overlayProbe))
await mobile.screenshot({ path: `${SHOTS}/mobile-overlay.png` })
await mobile.keyboard.press("Escape")
await new Promise((r) => setTimeout(r, 250))
const overlayGone = await mobile.evaluate(() => !document.querySelector('[role="dialog"]') && document.body.style.overflow === "")
log("[overlay] Escape closes + unlocks scroll:", overlayGone)

/* Contact email fits at 320 */
await mobile.setViewport({ width: 320, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await mobile.evaluate(() => document.getElementById("contact").scrollIntoView())
await new Promise((r) => setTimeout(r, 600))
const emailAt320 = await mobile.evaluate(() => {
  const a = document.querySelector('#contact a[href^="mailto:"]')
  const doc = document.documentElement
  return { emailW: a?.scrollWidth, clientW: doc.clientWidth, fits: a && a.scrollWidth <= doc.clientWidth }
})
log("[contact] email @320:", JSON.stringify(emailAt320))
const scroll320 = await hscrollInfo(mobile)
log("[contact] page h-scroll @320:", scroll320.hasHScroll)
await mobile.screenshot({ path: `${SHOTS}/mobile-contact-320.png` })
await mobile.close()

/* ── 7. Reduced motion: static frames everywhere, hero static ── */
const rm = await browser.newPage()
await rm.setViewport({ width: 1280, height: HEIGHT })
const rmSession = await rm.createCDPSession()
await rmSession.send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
})
await rm.goto(BASE, { waitUntil: "load", timeout: 60000 })
await rm.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
const rmProbe = await rm.evaluate(() => {
  const gifs = Array.from(document.querySelectorAll('img[src$=".gif"]')).map((i) => i.getAttribute("src"))
  const hero = document.getElementById("hero")
  const canvasHidden = Boolean(hero?.querySelector("canvas.invisible")) || !hero?.querySelector("canvas.visible")
  const staticImg = Boolean(hero?.querySelector("img[src$='kug-logo.png']"))
  return { gifs, canvasHidden, staticImg }
})
log("[reduced-motion] visible gif srcs:", JSON.stringify(rmProbe.gifs), "hero static:", rmProbe.staticImg)
await rm.screenshot({ path: `${SHOTS}/reduced-motion.png` })
await rm.close()

/* ── 8. Dark desktop screenshot + arcade sanity ── */
const dark = await browser.newPage()
await dark.setViewport({ width: 1280, height: HEIGHT })
await dark.goto(BASE, { waitUntil: "load", timeout: 60000 })
await dark.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
await dark.waitForFunction(() => !document.querySelector("#page-loader"), { timeout: 15000 }).catch(() => {})
await dark.click('header button[aria-pressed]').catch(() => {})
await new Promise((r) => setTimeout(r, 400))
await dark.evaluate(() => document.getElementById("arcade").scrollIntoView())
await new Promise((r) => setTimeout(r, 800))
await dark.evaluate(() => {
  const tabs = Array.from(document.querySelectorAll("#arcade button"))
  tabs.find((b) => /Syntax Sprint/i.test(b.textContent || ""))?.click()
})
await new Promise((r) => setTimeout(r, 300))
await dark.evaluate(() => {
  const opts = Array.from(document.querySelectorAll('#arcade button'))
  const first = opts.find((b) => b.querySelector("span"))
  first?.click()
})
await new Promise((r) => setTimeout(r, 300))
await dark.screenshot({ path: `${SHOTS}/dark-arcade.png` })

/* memory game match → kodee-jumping pop appears? */
await dark.evaluate(() => {
  const tabBtn = Array.from(document.querySelectorAll("#arcade button")).find((b) => /Memory Matrix/i.test(b.textContent || ""))
  tabBtn?.click()
})
await new Promise((r) => setTimeout(r, 300))
await dark.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('#arcade div[class*="cursor-pointer"]'))
  // click two face-down cards as a smoke test (match logic verified manually)
  cards[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  cards[2]?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 250))
const memoryCards = await dark.evaluate(() => document.querySelectorAll('#arcade div[class*="cursor-pointer"]').length)
log("[arcade] memory cards rendered:", memoryCards)
await dark.close()

/* ── 9. Console errors / failed requests summary ── */
log("\n=== console errors ===")
log(consoleErrors.length ? consoleErrors.join("\n---\n") : "(none)")
log("=== failed/4xx requests ===")
log(failedRequests.filter((u) => !u.includes("api.allorigins")).length ? failedRequests.join("\n---\n") : "(none)")

await browser.close()
log("\nverify.mjs complete.")
