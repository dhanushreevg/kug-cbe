import puppeteer from "puppeteer-core"
const BASE = "http://localhost:5173/"
const CHROME = "/usr/bin/google-chrome"
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: "networkidle0" })
const paths = ["/@id/gsap", "/node_modules/.vite/deps/gsap.js"]
for (const p of paths) {
  const r = await page.evaluate(async (p) => {
    try { const m = await import(p); return { ok: true, keys: Object.keys(m).slice(0,10) } } catch (e) { return { ok: false, err: String(e) } }
  }, p)
  console.log(p, r)
}
await browser.close()
