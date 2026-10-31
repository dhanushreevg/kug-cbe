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
for (let i = 0; i < 8; i++) {
  await new Promise(r => setTimeout(r, 500))
  const s = await page.evaluate(() => {
    const c = document.querySelector(".org-card .org-card__content")
    const p = document.querySelector(".org-card .org-card__photo-container")
    return { t: performance.now(), content: c && getComputedStyle(c).opacity, photo: p && getComputedStyle(p).opacity, scrollY: window.scrollY }
  })
  console.log(i, JSON.stringify(s))
}
// sample rAF rate
const raf = await page.evaluate(() => new Promise(res => {
  let n = 0; const t0 = performance.now()
  const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick); else res({ n, dt: performance.now() - t0 }) }
  requestAnimationFrame(tick)
}))
console.log("raf", raf)
await browser.close()
