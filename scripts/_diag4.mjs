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
await new Promise(r => setTimeout(r, 2000))
const info = await page.evaluate(async () => {
  const { gsap } = await import("/@id/gsap")
  const kids = gsap.globalTimeline.getChildren(true, true, false)
  const anims = kids.map(k => ({
    type: k.constructor?.name,
    progress: k.progress?.(),
    paused: k.paused?.(),
    time: k.time?.(),
    dur: k.duration?.(),
    targets: k.targets?.().map(t => t.className && (typeof t.className === "string" ? t.className : t.tagName)).slice(0,3),
  }))
  return {
    version: gsap.version,
    tickerTime: gsap.ticker.time,
    tickerFrame: gsap.ticker.frame,
    tickerSleeping: gsap.ticker.sleep,
    globalPaused: gsap.globalTimeline.paused(),
    globalTime: gsap.globalTimeline.time(),
    totalChildren: kids.length,
    anims,
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
