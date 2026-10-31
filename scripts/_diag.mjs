import puppeteer from "puppeteer-core"
const BASE = "http://localhost:5173/"
const CHROME = "/usr/bin/google-chrome"
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
await page.setViewport({ width: 1440, height: 900 })
page.on("console", m => console.log("PAGE:", m.type(), m.text()))
page.on("pageerror", e => console.log("PAGEERR:", e.message))
await page.goto(BASE, { waitUntil: "networkidle0" })
await new Promise(r => setTimeout(r, 3000))
await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ behavior: "instant" }))
await new Promise(r => setTimeout(r, 3000))
const info = await page.evaluate(() => {
  const out = {}
  document.querySelectorAll(".org-card").forEach((card, i) => {
    const cs = (sel) => {
      const el = card.querySelector(sel)
      if (!el) return null
      const s = getComputedStyle(el)
      return { opacity: s.opacity, transform: s.transform, display: s.display, visibility: s.visibility, height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width }
    }
    const r = card.getBoundingClientRect()
    out[i] = {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      front: cs(".org-card__front"),
      content: cs(".org-card__content"),
      photoContainer: cs(".org-card__photo-container"),
      photo: cs(".org-card__photo"),
      img: (() => { const im = card.querySelector("img"); return im ? { src: im.currentSrc, complete: im.complete, nw: im.naturalWidth, nh: im.naturalHeight, rect: im.getBoundingClientRect().toJSON() } : null })(),
    }
  })
  return out
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
