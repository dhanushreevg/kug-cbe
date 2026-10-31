/**
 * Image asset pipeline for the KUG CBE theme/responsive upgrade.
 *
 * Targets produced:
 *  - public/assets/kug-logo-256.png       256px logo for navbar + footer
 *  - public/assets/kug-logo-ink-256.png   256px logo: dark ink chevrons for the light theme
 *  - src/assets/organizers/*.{webp,jpg}   480/960 widths, JPEG fallback, each < 80KB
 *
 * Full-resolution kug-logo.png stays untouched (hero particle sampling source).
 */
import sharp from "sharp"
import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outOrganizers = path.join(root, "src", "assets", "organizers")
mkdirSync(outOrganizers, { recursive: true })

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`

/* ── kug-logo 256px (navbar/footer) ─────────────────────────────────────── */
await sharp(path.join(root, "public/assets/kug-logo.png"))
  .resize(256, 256, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true, effort: 9 })
  .toFile(path.join(root, "public/assets/kug-logo-256.png"))

/* ── kug-logo ink variant for the light theme ──────────────────────────────
   The chevrons are light grey (#C5C4C4) and vanish on Paper (#F5F5F5) with a
   ~1.6:1 ratio. Remap low-saturation pixels down to dark ink while keeping
   the Kotlin-gradient "K" untouched. */
const logoRaw = await sharp(path.join(root, "public/assets/kug-logo.png"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const ink = Buffer.from(logoRaw.data)
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
for (let i = 0; i < ink.length; i += 4) {
  if (ink[i + 3] === 0) continue
  const r = ink[i]
  const g = ink[i + 1]
  const b = ink[i + 2]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max
  // Saturation ramp: fully grey pixels cook down to #3B3A3A ink, the
  // gradient "K" (high saturation) passes through untouched. Alpha follows
  // the same ramp so soft edges stay soft.
  const t = clamp(1.6 - sat * 3.2, 0, 1) // 1 = grey -> ink, 0 = colour
  ink[i] = Math.round(r * (1 - t) + (58 * t))
  ink[i + 1] = Math.round(g * (1 - t) + (58 * t))
  ink[i + 2] = Math.round(b * (1 - t) + (58 * t))
  if (t > 0 && ink[i + 3] > 8 && sat < 0.6) {
    ink[i + 3] = Math.round(ink[i + 3] * (1 - t * 0.25))
  }
}

await sharp(ink, {
  raw: { width: logoRaw.info.width, height: logoRaw.info.height, channels: 4 },
})
  .resize(256, 256, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true, effort: 9 })
  .toFile(path.join(root, "public/assets/kug-logo-ink-256.png"))

/* ── organizer portraits: 480/960 WebP + JPEG fallback ───────────────────── */
const portraits = [
  { name: "dhanuu", src: path.join(root, "src/assets/dhanuu.jpeg") },
  { name: "sanjayy", src: path.join(root, "src/assets/sanjayy.png") },
]

for (const portrait of portraits) {
  for (const width of [480, 960]) {
    // Height follows the 591x1004 source aspect (portrait).
    const base = sharp(portrait.src).resize(width, null, { withoutEnlargement: false })
    let webp = await base.clone().webp({ quality: 72, effort: 5 }).toBuffer()
    if (webp.length > 80 * 1024) {
      webp = await base.clone().webp({ quality: 60, effort: 5 }).toBuffer()
    }
    await sharp(webp).toFile(path.join(outOrganizers, `${portrait.name}-${width}.webp`))

    let jpg = await base.clone().jpeg({ quality: 72, mozjpeg: true }).toBuffer()
    if (jpg.length > 80 * 1024) {
      jpg = await base.clone().jpeg({ quality: 58, mozjpeg: true }).toBuffer()
    }
    await sharp(jpg).toFile(path.join(outOrganizers, `${portrait.name}-${width}.jpg`))

    const meta = await sharp(path.join(outOrganizers, `${portrait.name}-${width}.webp`)).metadata()
    console.log(
      `${portrait.name}-${width}: ${meta.width}x${meta.height} webp=${kb(webp.length)} jpg=${kb(jpg.length)}`
    )
  }
}

/* ── 96px web variants of the large 3334px Kodee PNGs (in-love, sharing,
   waving, jumping) — direct use would be 118–137KB per image ── */
for (const name of ["in-love", "sharing", "waving", "jumping"]) {
  await sharp(path.join(root, `public/assets/kotlin_mascot_2/Digital/PNG/Kodee_Assets_Digital_Kodee-${name}.png`))
    .resize(96, 96, { fit: "inside" })
    .png({ compressionLevel: 9, palette: true, effort: 9 })
    .toFile(path.join(root, `public/assets/kotlin_mascot_2/Digital/PNG/Kodee-${name}-96.png`))
}

/* ── kodee-sitting at 96px: the About KodeeCard mark (123KB original is too
   heavy for a 40px slot) ── */
await sharp(path.join(root, "public/assets/kotlin_mascot_2/Digital/PNG/Kodee_Assets_Digital_Kodee-sitting.png"))
  .resize(96, 96, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true, effort: 9 })
  .toFile(path.join(root, "public/assets/kotlin_mascot_2/Digital/PNG/Kodee-sitting-96.png"))

console.log("Image pipeline complete.")
