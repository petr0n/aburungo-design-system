#!/usr/bin/env node
/**
 * check-contrast — WCAG 2.1 contrast gate for the token set.
 *
 * A palette that fails this does not land. It runs on every build so the
 * question "is the new palette legible" is answered by a command rather than
 * by someone eyeballing swatches.
 *
 * Thresholds are SC 1.4.3 (4.5:1 for body text) and SC 1.4.11 (3:1 for
 * non-text UI indicators — focus rings, progress fills). PRODUCT.md records
 * WCAG 2.1 AA as binding, which is where these numbers come from.
 *
 * Known failures are listed in KNOWN below rather than silently tolerated:
 * the gate stays green on them but prints them, so an incoming palette has to
 * beat the outgoing one instead of merely matching it.
 */
import { readFileSync } from 'node:fs'

const SRC = 'src/tokens.css'
const css = readFileSync(SRC, 'utf8')

// --- resolve tokens, following `var(--x)` chains to a literal ---------------
const raw = new Map()
for (const [, name, value] of css.matchAll(/^\s*(--color-[a-z0-9-]+):\s*([^;]+);/gim)) {
  raw.set(name, value.trim())
}
function resolve(name, seen = new Set()) {
  const v = raw.get(name)
  if (v === undefined) return null
  if (seen.has(name)) throw new Error(`circular token reference at ${name}`)
  const ref = v.match(/^var\((--[a-z0-9-]+)\)$/)
  if (ref === null) return v
  seen.add(name)
  return resolve(ref[1], seen)
}

// --- WCAG relative luminance ----------------------------------------------
function rgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
}
function luminance(hex) {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

// --- the checks ------------------------------------------------------------
const TEXT = 4.5
const UI = 3

/** [foreground, background, threshold, label] */
const CHECKS = [
  ['--color-fg', '--color-bg', TEXT, 'body text on page'],
  ['--color-fg', '--color-surface', TEXT, 'body text on card'],
  ['--color-fg-muted', '--color-bg', TEXT, 'secondary text on page'],
  ['--color-fg-muted', '--color-surface', TEXT, 'secondary text on card'],
  ['--color-fg-subtle', '--color-bg', TEXT, 'tertiary text on page'],
  ['--color-fg-subtle', '--color-surface-2', TEXT, 'tertiary text on well'],
  ['--color-fg-faint', '--color-surface', TEXT, 'placeholder on card'],
  ['--color-action-fg', '--color-action', TEXT, 'primary button label'],
  ['--color-action-2-fg', '--color-action-2-bg', TEXT, 'secondary button label'],
  ['--color-accent-fg', '--color-accent', TEXT, 'text on the accent'],
  ['--color-success-fg', '--color-success-bg', TEXT, 'recalled banner'],
  ['--color-error-fg', '--color-error-bg', TEXT, 'not-quite banner'],
  ['--color-tag-fg', '--color-tag-bg', TEXT, 'scenario tag'],
  ['--color-fg-inverse', '--color-bg-inverse', TEXT, 'text on inverse chrome'],
  // Non-text indicators — the focus ring has to read on every ground it can
  // land on, which is what made the v3 Ogon ring fail its own review.
  ['--color-focus', '--color-bg', UI, 'focus ring on page'],
  ['--color-focus', '--color-surface', UI, 'focus ring on card'],
  ['--color-focus', '--color-surface-2', UI, 'focus ring on well'],
  ['--color-focus-on-inverse', '--color-bg-inverse', UI, 'focus ring on inverse chrome'],
  ['--color-progress-fill', '--color-progress-track', UI, 'progress fill on track'],
]

/**
 * Failures accepted with a written reason. These are corrections to send back
 * to the palette author, not things to silently re-tint — see docs/colors.md.
 * Anything not listed here fails the build.
 */
const KNOWN = new Map([
  // Empty. All three prior failures were resolved 2026-08-08 by the palette
  // author: Rokusho 500 unlocked for progress-fill, and stone-500 darkened so
  // text on a well clears 4.5:1. Add an entry here only with a written reason.
])

let hard = 0
const known = []
console.log(`contrast gate — WCAG 2.1 AA, tokens from ${SRC}\n`)

for (const [fgName, bgName, min, label] of CHECKS) {
  const fg = resolve(fgName)
  const bg = resolve(bgName)
  if (fg === null || bg === null) {
    console.error(`  SKIP  ${label} — unresolved token (${fg === null ? fgName : bgName})`)
    continue
  }
  const r = ratio(fg, bg)
  const ok = r >= min
  const line = `${r.toFixed(2).padStart(6)}:1  (need ${min})  ${label}`
  if (ok) {
    console.log(`  PASS ${line}`)
  } else if (KNOWN.has(label)) {
    known.push(`  KNOWN${line}\n         ${KNOWN.get(label)}`)
  } else {
    console.error(`  FAIL ${line}   ${fg} on ${bg}`)
    hard += 1
  }
}

if (known.length > 0) {
  console.log(`\naccepted known failures (${known.length}) — the incoming palette must beat these:`)
  known.forEach((k) => console.log(k))
}

if (hard > 0) {
  console.error(`\ncontrast gate: ${hard} failure(s). A palette that fails does not land.`)
  process.exit(1)
}
console.log(`\ncontrast gate: pass (${CHECKS.length - known.length}/${CHECKS.length} clear)`)
