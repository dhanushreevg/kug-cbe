import puppeteer from "puppeteer-core"
const BASE = "http://localhost:5173/"
const CHROME = "/usr/bin/google-chrome"
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on("pageerror", e => errors.push("PageError: " + e.message))
page.on("console", m => { if (m.type() === "error") errors.push("Console: " + m.text()) })
await page.goto(BASE, { waitUntil: "networkidle0" })
await new Promise(r => setTimeout(r, 3000))
const h = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < h; y += 400) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await new Promise(r => setTimeout(r, 150))
}
await new Promise(r => setTimeout(r, 1500))
// report any element still at ~0 opacity that isn't decorative
const hidden = await page.evaluate(() => {
  const out = []
  document.querySelectorAll("#about *, main section *").forEach(el => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    if (r.width > 40 && r.height > 20 && parseFloat(cs.opacity) < 0.15 && cs.visibility !== "hidden" && cs.display !== "none") {
      out.push({ cls: typeof el.className === "string" ? el.className : el.tagName, op: cs.opacity, tag: el.tagName })
    }
  })
  return out.slice(0, 60)
})
console.log("errors", errors)
console.log("hidden count", hidden.length, JSON.stringify(hidden.slice(0, 40), null, 1))
await page.screenshot({ path: "/tmp/opencode/shots/full-desktop.png", fullPage: true })
await browser.close()
