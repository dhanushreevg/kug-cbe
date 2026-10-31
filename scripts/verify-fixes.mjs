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

  // 1. Mobile 400x650 Dark
  {
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("kug-cbe-theme", "dark")
    })
    await page.setViewport({ width: 400, height: 650, hasTouch: true })
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
    await new Promise((r) => setTimeout(r, 600))

    const aboutEl = await page.$("#about")
    if (aboutEl) {
      await aboutEl.screenshot({ path: path.join(SHOTS_DIR, "organizers-mobile-new-dark.png") })
      console.log("Saved organizers-mobile-new-dark.png")
    }
    await page.close()
  }

  // 2. Mobile 400x650 Light (matching user's DevTools screenshot)
  {
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("kug-cbe-theme", "light")
    })
    await page.setViewport({ width: 400, height: 650, hasTouch: true })
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
    await new Promise((r) => setTimeout(r, 600))

    const aboutEl = await page.$("#about")
    if (aboutEl) {
      await aboutEl.screenshot({ path: path.join(SHOTS_DIR, "organizers-mobile-new-light.png") })
      console.log("Saved organizers-mobile-new-light.png")
    }
    await page.close()
  }

  // 3. Desktop 1440x900 - Essential Resources section
  {
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("kug-cbe-theme", "light") // Test in light mode like Image 3
    })
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(BASE, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 2600))

    await page.evaluate(() => {
      const el = document.getElementById("resources")
      if (el) el.scrollIntoView({ behavior: "instant" })
    })
    await new Promise((r) => setTimeout(r, 600))

    const resEl = await page.$("#resources")
    if (resEl) {
      await resEl.screenshot({ path: path.join(SHOTS_DIR, "resources-fix-desktop-light.png") })
      console.log("Saved resources-fix-desktop-light.png")
    }

    // Also in dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem("kug-cbe-theme", "dark")
    })
    await new Promise((r) => setTimeout(r, 300))
    if (resEl) {
      await resEl.screenshot({ path: path.join(SHOTS_DIR, "resources-fix-desktop-dark.png") })
      console.log("Saved resources-fix-desktop-dark.png")
    }
    await page.close()
  }

  // 4. Horizontal scroll check at 320px
  {
    const page = await browser.newPage()
    await page.setViewport({ width: 320, height: 600 })
    await page.goto(BASE, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 2600))
    const hscroll = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }))
    console.log(`320px HScroll: scrollWidth=${hscroll.scrollWidth}, clientWidth=${hscroll.clientWidth}, hasHScroll=${hscroll.hasHScroll}`)
    await page.close()
  }

  // 5. Verify Meta Tags in rendered DOM
  {
    const page = await browser.newPage()
    await page.goto(BASE, { waitUntil: "networkidle0" })
    const metas = await page.evaluate(() => {
      const tags = Array.from(document.querySelectorAll("meta"))
      return tags.map((t) => ({
        name: t.getAttribute("name"),
        property: t.getAttribute("property"),
        content: t.getAttribute("content"),
      })).filter((m) => m.property?.startsWith("og:") || m.name?.startsWith("twitter:") || m.name === "description")
    })
    console.log("\nVerified Meta Tags in Head:")
    console.log(JSON.stringify(metas, null, 2))
    await page.close()
  }

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
