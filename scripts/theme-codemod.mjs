/**
 * One-off codemod: swap hard-coded hex Tailwind classes for theme tokens.
 * Longest match first so hover:/group-hover: prefixes with arbitrary values
 * are handled before their shorter base strings.
 */
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const PAIRS = [
  // arbitrary hover backgrounds (longest first)
  ["hover:bg-[#e6e6e6]", "hover:bg-fg-hover"],
  ["hover:bg-[#181818]", "hover:bg-surface-3"],
  ["hover:bg-[#1a1a1a]", "hover:bg-surface-3"],
  ["hover:bg-[#1a1a1a]", "hover:bg-surface-3"],
  // borders with alpha, longest first
  ["hover:border-white/[0.25]", "hover:border-border-strong"],
  ["border-white/[0.25]", "border-border-strong"],
  ["border-white/[0.2]", "border-border-strong"],
  ["border-white/[0.18]", "border-border-strong"],
  ["hover:border-white/[0.16]", "hover:border-border-mid"],
  ["border-white/[0.16]", "border-border-mid"],
  ["border-white/[0.15]", "border-border-mid"],
  ["border-white/[0.14]", "border-border-mid"],
  ["border-white/[0.12]", "border-border-mid"],
  ["hover:border-white/[0.08]", "hover:border-border"],
  ["border-white/[0.08]", "border-border"],
  // solid whites
  ["hover:border-white", "hover:border-fg"],
  ["border-white", "border-fg"],
  ["text-white", "text-fg"],
  ["bg-white", "bg-fg"],
  // text colours
  ["text-[#0a0a0a]", "text-ink"],
  ["text-[#d4d4d4]", "text-body"],
  ["text-[#8a8a8a]", "text-muted"],
  ["text-[#666666]", "text-dim"],
  // solids
  ["bg-[#050506]", "bg-void"],
  ["bg-[#111111]", "bg-surface"],
  ["bg-[#141414]", "bg-surface-2"],
  ["bg-[#161616]", "bg-surface-2"],
  ["bg-[#181818]", "bg-surface-3"],
  ["bg-[#1a1a1a]", "bg-surface-3"],
  ["bg-[#222222]", "bg-surface-4"],
]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (/\.(jsx|js)$/.test(name)) files.push(full)
  }
  return files
}

for (const file of walk(path.join(root, "src"))) {
  if (file.includes("styles/")) continue
  if (file.includes("scripts/")) continue
  const original = readFileSync(file, "utf8")
  let next = original
  for (const [from, to] of PAIRS) next = next.split(from).join(to)
  if (next !== original) {
    writeFileSync(file, next)
    console.log("codemod", path.relative(root, file))
  }
}
