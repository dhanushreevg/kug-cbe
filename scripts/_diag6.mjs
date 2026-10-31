import puppeteer from "puppeteer-core"
const BASE = "http://localhost:5173/"
const CHROME = "/usr/bin/google-chrome"
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: "networkidle0" })
await new Promise(r => setTimeout(r, 3000))
await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ behavior: "instant" }))
await new Promise(r => setTimeout(r, 1500))
const info = await page.evaluate(() => {
  const card = document.querySelector(".org-card")
  const q = (s) => { const el = card.querySelector(s); const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { r: { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height }, pos: cs.position, height: cs.height, bottom: cs.bottom, top: cs.top, overflow: cs.overflow } }
  return { card: (() => { const r = card.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: r.height } })(), front: q(".org-card__front"), visual: q(".org-card__visual"), accentWrap: q(".org-card__accent-wrap"), photoContainer: q(".org-card__photo-container"), photo: q(".org-card__photo") }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
