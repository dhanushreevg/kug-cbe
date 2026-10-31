import puppeteer from "puppeteer-core"
import { mkdirSync } from "node:fs"
import path from "node:path"

const BASE = "http://localhost:4173/"
const SHOTS_DIR = "/home/sanjay/.gemini/antigravity-ide/brain/7d0846f4-7073-41c4-a581-90c48c48b930/shots"
mkdirSync(SHOTS_DIR, { recursive: true })

const CHROME = "/usr/bin/google-chrome"

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
    ],
  })

  const errors = []

  const viewports = [
    { name: "mobile-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "mobile-320", width: 320, height: 640 },
  ]

  for (const vp of viewports) {
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("kug-cbe-theme", "dark")
    })
    page.on("pageerror", (err) => errors.push(`[${vp.name}] PageError: ${err.message}`))
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`[${vp.name}] ConsoleError: ${msg.text()}`)
    })

    await page.setViewport({ width: vp.width, height: vp.height })
    await page.goto(BASE, { waitUntil: "networkidle0" })

    // Wait for preloader to finish and fade out completely
    await new Promise((r) => setTimeout(r, 2600))

    // Scroll through all cards in #about to trigger GSAP reveals
    await page.evaluate(async () => {
      const cards = document.querySelectorAll(".org-card")
      for (const card of cards) {
        card.scrollIntoView({ behavior: "instant", block: "center" })
        await new Promise((r) => setTimeout(r, 60))
      }
      const el = document.getElementById("about")
      if (el) el.scrollIntoView({ behavior: "instant" })
    })

    // Wait for GSAP transitions to settle
    await new Promise((r) => setTimeout(r, 700))

    // Check horizontal scroll
    const hscroll = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }
    })

    console.log(`[${vp.name}] (W: ${vp.width}): scrollWidth=${hscroll.scrollWidth}, clientWidth=${hscroll.clientWidth}, hasHScroll=${hscroll.hasHScroll}`)

    // Take screenshot of #about section
    const aboutEl = await page.$("#about")
    if (aboutEl) {
      const shotPath = path.join(SHOTS_DIR, `organizers-${vp.name}.png`)
      await aboutEl.screenshot({ path: shotPath })
      console.log(`Saved screenshot: ${shotPath}`)
    }

    await page.close()
  }

  // Check with touch emulation (hover: none)
  {
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("kug-cbe-theme", "dark")
    })
    const client = await page.target().createCDPSession()
    await client.send("Emulation.setEmulatedMedia", {
      features: [{ name: "hover", value: "none" }],
    })
    await page.setViewport({ width: 390, height: 844, hasTouch: true })
    await page.goto(BASE, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 2600))
    await page.evaluate(async () => {
      const cards = document.querySelectorAll(".org-card")
      for (const card of cards) {
        card.scrollIntoView({ behavior: "instant", block: "center" })
        await new Promise((r) => setTimeout(r, 60))
      }
      const el = document.getElementById("about")
      if (el) el.scrollIntoView({ behavior: "instant" })
    })
    await new Promise((r) => setTimeout(r, 700))

    const aboutEl = await page.$("#about")
    if (aboutEl) {
      const shotPath = path.join(SHOTS_DIR, "organizers-touch-390.png")
      await aboutEl.screenshot({ path: shotPath })
      console.log(`Saved touch screenshot: ${shotPath}`)
    }
    await page.close()
  }

  await browser.close()

  console.log("\n--- Verification Summary ---")
  console.log(`Total console/page errors: ${errors.length}`)
  if (errors.length > 0) {
    errors.forEach((e) => console.error(" - " + e))
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
