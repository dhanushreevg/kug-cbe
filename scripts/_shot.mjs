import puppeteer from "puppeteer-core"

const BASE = "http://localhost:5173/"
const OUT = "/tmp/opencode/shots"
const CHROME = "/usr/bin/google-chrome"

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-device-scale-factor=1"],
})

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
]

for (const vp of viewports) {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "dark"))
  await page.setViewport({ width: vp.width, height: vp.height })
  await page.goto(BASE, { waitUntil: "networkidle0" })
  await new Promise(r => setTimeout(r, 3000))
  await page.evaluate(async () => {
    const cards = document.querySelectorAll(".org-card")
    for (const card of cards) {
      card.scrollIntoView({ behavior: "instant", block: "center" })
      await new Promise(r => setTimeout(r, 80))
    }
    document.getElementById("about")?.scrollIntoView({ behavior: "instant" })
  })
  await new Promise(r => setTimeout(r, 1000))
  const about = await page.$("#about")
  await about.screenshot({ path: `${OUT}/about-${vp.name}.png` })
  const card = await page.$(".org-card")
  await card.screenshot({ path: `${OUT}/card-${vp.name}.png` })
  console.log("saved", vp.name)
  await page.close()
}

await browser.close()
