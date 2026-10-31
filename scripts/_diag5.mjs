import puppeteer from "puppeteer-core"
const BASE = "http://localhost:5173/"
const CHROME = "/usr/bin/google-chrome"
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
await page.setViewport({ width: 1440, height: 900 })
page.on("pageerror", e => console.log("PAGEERR:", e.message))
await page.goto(BASE, { waitUntil: "networkidle0" })
await new Promise(r => setTimeout(r, 3000))
await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ behavior: "instant" }))
await new Promise(r => setTimeout(r, 2000))
const info = await page.evaluate(() => {
  const gsap = window.__gsap
  const tl = window.__orgTl
  const st = window.__orgSt
  const content = document.querySelector(".org-card .org-card__content")
  return {
    version: gsap.version,
    tickerTime: gsap.ticker.time,
    tickerFrame: gsap.ticker.frame,
    globalPaused: gsap.globalTimeline.paused(),
    globalTime: gsap.globalTimeline.time(),
    tl: tl && {
      progress: tl.progress(),
      paused: tl.paused(),
      time: tl.time(),
      totalTime: tl.totalTime(),
      duration: tl.duration(),
      children: tl.getChildren().map(c => ({ cls: c.constructor?.name, p: c.progress(), paused: c.paused(), start: c.startTime(), dur: c.duration(), targets: c.targets().map(t => typeof t.className === "string" ? t.className : t.tagName) })),
    },
    st: st && {
      enabled: st.enabled,
      progress: st.progress,
      isActive: st.isActive,
      start: st.start,
      end: st.end,
      animation: !!st.animation,
      vars: { once: st.vars?.once, toggleActions: st.vars?.toggleActions },
    },
    contentOpacity: getComputedStyle(content).opacity,
    contentInline: content.getAttribute("style"),
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
