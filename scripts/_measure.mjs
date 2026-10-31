import puppeteer from "puppeteer-core"
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--hide-scrollbars"] })
const page = await browser.newPage()
await page.evaluateOnNewDocument(() => localStorage.setItem("kug-cbe-theme", "light"))
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ behavior: "instant" }))
await new Promise(r => setTimeout(r, 2000))
const info = await page.evaluate(() => {
  return [...document.querySelectorAll(".org-card")].map(card => {
    const q = s => { const el = card.querySelector(s); if(!el) return null; const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom} }
    return { card:q(".org-card__front"), visual:q(".org-card__visual"), cont:q(".org-card__photo-container"), img:q(".org-card__photo"), src: card.querySelector("img")?.getAttribute("src"), natural: (()=>{const im=card.querySelector("img");return im?[im.naturalWidth,im.naturalHeight]:null})() }
  })
})
console.log(JSON.stringify(info,null,2))
await browser.close()
