/**
 * Walker scrub verification: drives the scroll so the KodeeStage tween is
 * mid-walk at each breakpoint, then asserts containment + captures a shot.
 *   node scripts/walker-check.mjs
 */
import { chromium } from "playwright-core"
import { mkdirSync } from "node:fs"

const BASE = process.env.BASE_URL || "http://localhost:4173/"
const SHOTS = "/tmp/opencode/audit-shots"
mkdirSync(SHOTS, { recursive: true })
const WIDTHS = [320, 390, 768, 1024, 1440]

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true })
let fails = 0
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: "load" })
  await page.waitForFunction(() => !document.querySelector("#page-loader"), null, { timeout: 30000 })
  await page.waitForTimeout(700)

  // Scroll the walker lane to ~45% through its scrub window.
  const mid = await page.evaluate(() => {
    const lane = document.querySelector(".kodee-lane")
    if (!lane) return null
    const r = lane.getBoundingClientRect()
    const offset = window.scrollY + r.top
    return Math.max(0, Math.round(offset - window.innerHeight * (1 - 0.45)))
  })
  if (mid === null) { console.log(`✗ ${w}: lane missing`); fails++; await ctx.close(); continue }
  await page.evaluate((y) => window.scrollTo(0, y), mid)
  await page.waitForTimeout(650) // scrub catch-up

  const state = await page.evaluate(() => {
    const lane = document.querySelector(".kodee-lane")
    const span = lane?.querySelector("span")
    const img = span?.querySelector("img")
    if (!lane || !span || !img) return null
    const l = lane.getBoundingClientRect()
    const r = img.getBoundingClientRect()
    const rect = (el) => el.getBoundingClientRect()
    return {
      walker: { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom) },
      lane: { left: Math.round(l.left), right: Math.round(l.right), top: Math.round(l.top), height: Math.round(l.height) },
      inside: r.left >= l.left - 1 && r.right <= l.right + 1 && r.top >= l.top - 1 && r.bottom <= l.bottom + 1,
      fullyOnScreen: r.left >= 0 && r.right <= window.innerWidth && r.top >= 0 && r.bottom <= window.innerHeight,
      overflow: getComputedStyle(lane).overflow,
      childOverflow: getComputedStyle(document.querySelector("main")).overflow,
    }
  })
  if (!state) { console.log(`✗ ${w}: walker missing`); fails++; await ctx.close(); continue }

  const pass = state.inside && state.fullyOnScreen
  console.log(`${pass ? "PASS" : "FAIL"} ${w}px mid-walk walker ${JSON.stringify(state.walker)} lane ${JSON.stringify(state.lane)} overflow=${state.overflow}`)
  if (!pass) fails += 1
  await page.screenshot({ path: `${SHOTS}/walker-${w}.png`, clip: { x: 0, y: Math.max(0, state.lane.top - 20), width: w, height: Math.min(800, state.lane.height + 40) } })
  await ctx.close()
}
await browser.close()
console.log(fails === 0 ? "\nWALKER: all breakpoints clean." : `\nWALKER: ${fails} failures.`)
process.exitCode = fails === 0 ? 0 : 1
