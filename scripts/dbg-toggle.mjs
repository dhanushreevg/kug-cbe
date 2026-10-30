import puppeteer from "puppeteer-core"
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars", "--force-device-scale-factor=1"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto("http://localhost:4173/", { waitUntil: "load", timeout: 60000 })
await page.waitForSelector("#page-loader", { hidden: true, timeout: 15000 }).catch(() => {})
const probes = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button[aria-pressed]"))
  return btns.map((b) => ({
    label: b.getAttribute("aria-label"),
    pressed: b.getAttribute("aria-pressed"),
    rect: JSON.stringify(b.getBoundingClientRect().toJSON().slice ? b.getBoundingClientRect().toJSON() : {}),
    classes: String(b.className).slice(0, 80),
    inOverlay: Boolean(b.closest('[role="dialog"]')),
  }))
})
console.log("aria-pressed buttons:", JSON.stringify(probes, null, 1))
await page.click("button[aria-pressed]").catch((e) => console.log("click error:", e.message))
await new Promise((r) => setTimeout(r, 500))
console.log("after click:", await page.evaluate(() => ({ attr: document.documentElement.getAttribute("data-theme"), stored: localStorage.getItem("kug-cbe-theme") })))
await browser.close()
