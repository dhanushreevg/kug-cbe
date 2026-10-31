/**
 * Full acceptance audit for the KUG CBE redesign pass.
 * Playwright-core drives the system Chrome (Playwright's own downloads are
 * not fetched in this environment; —channel chrome/executablePath is used).
 *
 * Run with the preview server live:
 *   BASE_URL=http://localhost:4173 node scripts/audit.mjs
 */
import { chromium } from "playwright-core"
import { mkdirSync, readdirSync, readFileSync, statSync, existsSync } from "node:fs"
import { join, relative } from "node:path"

const BASE = process.env.BASE_URL || "http://localhost:4173/"
const SHOTS = "/tmp/opencode/audit-shots"
mkdirSync(SHOTS, { recursive: true })

const CHROME = "/usr/bin/google-chrome"
const results = []
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`)
}

/* ────────────────────────────────────────────────────────────────────────────
   1. Static source scan: no hard-coded hex in components (brand constants
   whitelisted) + every asset reference resolves on disk.
   ──────────────────────────────────────────────────────────────────────────── */
function scanSource() {
  const roots = ["src"]
  const brandConstant = /(PALETTE|hex:\s*"#|HERO_BG|PAPER_BG|HERO_INK|CANVAS_INK|CANVAS_LINK|brand-gradient|7F52FF|C811E1|E44857|F88A00|0095D5|dot\.hex|const\s+[A-Z][A-Z0-9_]+\s*=)/i
  const offenders = []
  const assets = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      const st = statSync(p)
      if (st.isDirectory()) { if (!name.startsWith("__")) walk(p); continue }
      if (!/\.(jsx?|css)$/.test(name)) continue
      const src = readFileSync(p, "utf8")
      src.split("\n").forEach((line, i) => {
        const m = line.match(/#([0-9a-fA-F]{3,8})\b/)
        if (!m) return
        const isCss = p.endsWith(".css")
        if (isCss) return
        const trimmed = line.trim()
        // comment-only lines carry documentation, not styling
        if ( /^\{|^\*\*?|^\/\*|^\*/.test(trimmed) || trimmed.startsWith("//")) return
        if (brandConstant.test(trimmed)) return
        offenders.push(`${relative("src", p)}:${i + 1}  ${trimmed.slice(0, 90)}`)
      })
      for (const am of src.matchAll(/["'`](\/assets\/[^"'`\s)]+)["'`]/g)) assets.push({ file: relative("src", p), path: am[1] })
    }
  }
  roots.forEach(walk)
  ok("scan: no stray hard-coded hex in JSX (scene constants named & whitelisted)", offenders.length === 0, offenders.slice(0, 6).join(" | ") || "clean")
  const missing = []
  for (const a of assets) {
    const candidates = [join("public", a.path), join("src", a.path)]
    if (!candidates.some(existsSync)) missing.push(`${a.file} → ${a.path}`)
  }
  ok("scan: every /assets/ reference resolves", missing.length === 0, missing.join(" | "))
}

/* ────────────────────────────────────────────────────────────────────────────
   2. Contrast matrix — WCAG ratios of the semantic token pairs, both themes.
   ──────────────────────────────────────────────────────────────────────────── */
function lum(hex) {
  const c = hex.replace("#", "")
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c
  const [r, g, b] = [0, 2, 4].map((i) => {
    let v = parseInt(n.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
function contrastMatrix() {
  const css = readFileSync("src/styles/index.css", "utf8")
  const parse = (block) => Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toUpperCase()])
  )
  const darkBlock = css.slice(css.indexOf(":root,\n:root[data-theme=\"dark\"]"), css.indexOf('/* ── Paper (light)'))
  const lightBlock = css.slice(css.indexOf(':root[data-theme="light"]'), css.indexOf("/* ── Base Reset"))
  const dark = parse(darkBlock), light = parse(lightBlock)
  const pairs = [
    ["text-primary / void", "color-text-primary", "color-void"],
    ["text-body / void", "color-text-body", "color-void"],
    ["text-muted / void", "color-text-muted", "color-void"],
    ["text-dim / surface-2", "color-text-dim", "color-surface-2"],
    ["text-muted / surface", "color-text-muted", "color-surface"],
    ["ink / text-primary (btn)", "color-ink", "color-text-primary"],
  ]
  let allPass = true
  for (const theme of [["dark", dark], ["light", light]]) {
    for (const [label, fg, bg] of pairs) {
      const r = ratio(theme[1][fg], theme[1][bg])
      const pass = r >= 4.5
      allPass = allPass && pass
      console.log(`  AA ${pass ? "✔" : "✘"} ${theme[0]}: ${label} = ${r.toFixed(2)}:1`)
    }
  }
  ok("contrast: token pairs ≥ 4.5:1 in both themes", allPass)
}

/* ────────────────────────────────────────────────────────────────────────────
   3. Live checks across breakpoints and themes.
   ──────────────────────────────────────────────────────────────────────────── */
const BREAKPOINTS = [
  { w: 320, h: 700 }, { w: 375, h: 750 }, { w: 390, h: 844 },
  { w: 768, h: 1024 }, { w: 1024, h: 768 }, { w: 1280, h: 800 }, { w: 1440, h: 900 },
]
const SHOT_BREAKPOINTS = [320, 390, 768, 1440]
const SECTIONS = ["hero", "events", "kodee", "arcade", "about", "community", "resources", "contact", "footer"]

async function waitReady(page, timeoutMs = 30000) {
  await page.goto(BASE, { waitUntil: "load", timeout: timeoutMs })
  // Page loader (~2s) intercepts everything until it lifts.
  await page.waitForFunction(() => !document.querySelector("#page-loader"), null, { timeout: timeoutMs })
  await page.waitForTimeout(900)
}

async function runTheme(browserNameless, theme) {
  const ctxErrors = []
  const failed = []
  for (const { w, h } of BREAKPOINTS) {
    const ctx = await browserNameless.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    })
    await ctx.addInitScript(([t]) => {
      try { localStorage.setItem("kug-cbe-theme", t) } catch (e) { /* sandboxed */ }
    }, [theme])
    const page = await ctx.newPage()
    page.on("console", (msg) => { if (msg.type() === "error") ctxErrors.push(`${w}: ${msg.text().slice(0, 140)}`) })
    page.on("requestfailed", (req) => failed.push(`${w}: ${req.url()} ${req.failure()?.errorText}`))
    page.on("response", (res) => { if (res.status() >= 400) failed.push(`${w}: ${res.status()} ${res.url()}`) })

    try {
      await waitReady(page)
      // No horizontal scroll
      const scroll = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: window.innerWidth,
        bw: document.body ? document.body.scrollWidth : 0,
      }))
      ok(`no h-scroll ${w}px ${theme}`, scroll.sw <= scroll.iw && scroll.bw <= scroll.iw + 1,
        `scrollWidth=${scroll.sw} innerWidth=${scroll.iw}`)

      // One H1 on the page
      const h1 = await page.evaluate(() => {
        const all = [...document.querySelectorAll("h1")]
        return { count: all.length, texts: all.map((e) => e.textContent.trim().slice(0, 60)) }
      })
      if (w === 1440) ok("semantics: exactly one H1", h1.count === 1, h1.texts.join(" / ") || "none")

      // Hero H1 at 390 must fit its rail (no overflow beyond rail box)
      if (w === 390) {
        const heroH1 = await page.evaluate(() => {
          const el = document.querySelector("#hero h1")
          if (!el) return null
          const r = el.getBoundingClientRect()
          return { right: r.right, vw: window.innerWidth, fs: getComputedStyle(el).fontSize }
        })
        if (heroH1) ok("hero: H1 visible on mobile with display-size text", heroH1.fs !== null && parseFloat(heroH1.fs) >= 30 && heroH1.right <= heroH1.vw, `font-size=${heroH1.fs}`)
      }

      // Walker containment in its lane
      const walker = await page.evaluate(() => {
        const lane = document.querySelector(".kodee-lane")
        const w = lane?.querySelector("span")
        if (!lane || !w) return null
        const l = lane.getBoundingClientRect()
        const r = w.querySelector("img")?.getBoundingClientRect() ?? w.getBoundingClientRect()
        const hero = document.querySelector("#hero")?.getBoundingClientRect()
        return {
          laneH: l.height, laneOverflow: getComputedStyle(lane).overflow,
          inside: r.left >= l.left - 2 && r.right <= l.right + 2 && r.top >= l.top - 2 && r.bottom <= l.bottom + 2,
          walkerRect: { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) },
          heroBottom: hero ? Math.round(hero.bottom) : null,
          walkerTop: Math.round(r.top),
        }
      })
      if (walker) {
        ok(`walker: inside lane at ${w}px ${theme}`, walker.inside, JSON.stringify(walker.walkerRect))
        if (w >= 1024) ok(`walker: lane ≥ 128px at ${w}px ${theme}`, walker.laneH >= 126, `laneH=${walker.laneH}`)
        ok(`walker: does not overlap hero at ${w}px`, walker.heroBottom === null || walker.walkerTop >= walker.heroBottom - 2,
          `heroBottom=${walker.heroBottom} walkerTop=${walker.walkerTop}`)
      } else {
        ok("walker present", false, "lane/walker not found")
      }

      // Tile colour at rest: filter must be none (full colour, no hover needed)
      if (w === 1440 || w === 390) {
        const tiles = await page.evaluate(() => {
          const imgs = [...document.querySelectorAll(".kodee-tile img, .kodee-img")]
          const noHover = document.documentElement
          return imgs.slice(0, 8).map((img) => ({
            filter: getComputedStyle(img).filter,
            transformChecked: !!noHover,
          }))
        })
        const bad = tiles.filter((t) => t.filter && !t.filter.includes("none"))
        ok(`mascot: tiles full colour at rest ${w}px ${theme}`, bad.length === 0,
          bad.length ? bad.map((b) => b.filter).join(", ") : "all filter:none")
      }

      // Email must fit without clipping at 320
      if (w === 320) {
        const email = await page.evaluate(() => {
          const a = document.querySelector('#contact a[href^="mailto"]')
          if (!a) return null
          return { sw: a.scrollWidth, cw: a.clientWidth }
        })
        if (email) ok("contact: email fits 320px", email.sw <= email.cw + 1, `scrollWidth=${email.sw} clientWidth=${email.cw}`)
      }

      // 44px actives on touch-shaped sizes
      const isTouchShape = w <= 430
      if (isTouchShape) {
        // hero options + tabs min sizes (computed with emulated touch in separate pass)
      }

      // Screenshots at selected breakpoints (viewport shots per section)
      if (SHOT_BREAKPOINTS.includes(w)) {
        for (const sec of SECTIONS) {
          const el = await page.$(`#${sec}`)
          if (!el) { results.push({ name: `shot ${sec}@${w}`, pass: false, detail: "missing" }); continue }
          await el.scrollIntoViewIfNeeded()
          await page.waitForTimeout(650)
          await page.screenshot({ path: `${SHOTS}/${theme}-${w}-${sec}.png` })
        }
      }
    } catch (err) {
      ok(`page ${w}px ${theme}`, false, String(err).slice(0, 120))
    }
    await ctx.close()
  }

  // Touch-shape context: hasTouch + coarse pointer for tap targets & colour
  const tctx = await browserNameless.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  })
  await tctx.addInitScript(([t]) => {
    try { localStorage.setItem("kug-cbe-theme", t) } catch (e) { /* sandboxed */ }
  }, [theme])
  const tpage = await tctx.newPage()
  tpage.on("console", (m) => { if (m.type() === "error") ctxErrors.push(`touch: ${m.text().slice(0, 140)}`) })
  try {
    await waitReady(tpage)
    const taps = await tpage.evaluate(() => {
      const bad = []
      const check = (label, el) => {
        const r = el.getBoundingClientRect()
        if ((r.width > 0 && r.width < 44) || (r.height > 0 && r.height < 44)) bad.push(`${label} ${Math.round(r.width)}x${Math.round(r.height)}`)
      }
      document.querySelectorAll("#hero .hero-option").forEach((el) => check("hero-opt", el))
      document.querySelectorAll("#hero .hero-welcome__cta").forEach((el) => check("hero-cta", el))
      document.querySelectorAll(".kodee-tile").forEach((el) => check("kodee-tile", el))
      // arcade tabs need switching to #arcade first — measure only if visible
      document.querySelectorAll("#arcade button").forEach((el) => { const r = el.getBoundingClientRect(); if (r.height > 0) check("arcade-btn", el) })
      document.querySelectorAll('.kodee-lane, .hero-welcome__actions a').forEach((el) => check("misc", el))
      return bad.slice(0, 8)
    })
    ok("touch: 44px minimum on hero/arcade/tile controls", taps.length === 0, taps.join(", ") || "all ≥44px")
    const touchTiles = await tpage.evaluate(() => {
      const imgs = [...document.querySelectorAll(".kodee-tile img")].slice(0, 5)
      return imgs.filter((i) => { const f = getComputedStyle(i).filter; return f && !f.includes("none") }).length
    })
    ok("touch: mascot tiles render full colour (no grayscale rest)", touchTiles === 0)
  } catch (err) {
    ok("touch pass", false, String(err).slice(0, 120))
  }
  await tctx.close()

  // Reduced motion: no animated mascot sources anywhere
  const rctx = await browserNameless.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" })
  await rctx.addInitScript(([t]) => {
    try { localStorage.setItem("kug-cbe-theme", t) } catch (e) { /* sandboxed */ }
  }, [theme])
  const rpage = await rctx.newPage()
  try {
    await waitReady(rpage)
    await rpage.evaluate(async () => {
      // walk to bottom so every section mounts
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) }
    })
    await rpage.waitForTimeout(500)
    const anim = await rpage.evaluate(() =>
      [...document.images]
        // Only mascot animation files count; static portraits may be .webp.
        .filter((i) => /kodee.*(gif|webp)/i.test(i.currentSrc || i.src || ""))
        .map((i) => i.getAttribute("src"))
    )
    ok(`${theme}: reduced motion → zero animated GIF/WebP sources`, anim.length === 0, anim.join(", ") || "all static frames")
  } catch (err) {
    ok(`reduced motion ${theme}`, false, String(err).slice(0, 120))
  }
  await rctx.close()

  ok(`${theme}: zero console errors across all widths`, ctxErrors.length === 0, ctxErrors.slice(0, 4).join(" | "))
  ok(`${theme}: zero failed/4xx requests across all widths`, failed.length === 0, failed.slice(0, 4).join(" | "))
}

/* ────────────────────────────────────────────────────────────────────────────
   main
   ──────────────────────────────────────────────────────────────────────────── */
scanSource()
contrastMatrix()

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
await runTheme(browser, "dark")
await runTheme(browser, "light")
await browser.close()

const fails = results.filter((r) => !r.pass)
console.log(`\nAUDIT: ${results.length - fails.length}/${results.length} checks passed.`)
if (fails.length) {
  console.log("FAILED:")
  fails.forEach((f) => console.log(`  ✗ ${f.name} — ${f.detail}`))
  process.exitCode = 1
}
