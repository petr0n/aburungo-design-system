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
 * This FAILS THE BUILD on any miss with no recorded reason. It did not until
 * 2026-08-10 — it had no process.exit, so it printed its findings and returned
 * 0, which made it a report wearing the word "gate".
 *
 * The escape hatch is KNOWN below: a failure ships only with a written reason
 * sitting next to the number. That map is currently empty and every check
 * passes.
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
  // A literal hex passes through. Used for the patterned-ground stand-in
  // below, which is a measurement rather than a token.
  if (name.startsWith('#')) return name
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
  // `link` is a raw value rather than a Rokusho alias for exactly this reason:
  // Rokusho 500 is 3.00:1 on the page and fails AA as text. Gate it so the
  // darkening that justifies the token cannot be undone by tidying it back to
  // var(--color-rokusho-500).
  ['--color-link', '--color-bg', TEXT, 'link on page'],
  ['--color-link', '--color-surface', TEXT, 'link on card'],
  ['--color-fg-inverse', '--color-inverse', TEXT, 'text on inverse chrome'],
  // Non-text indicators — the focus ring has to read on every ground it can
  // land on, which is what made the v3 Ogon ring fail its own review.
  ['--color-focus', '--color-bg', UI, 'focus ring on page'],
  ['--color-focus', '--color-surface', UI, 'focus ring on card'],
  ['--color-focus', '--color-surface-2', UI, 'focus ring on well'],
  ['--color-focus-on-inverse', '--color-inverse', UI, 'focus ring on inverse chrome'],
  ['--color-progress-fill', '--color-progress-track', UI, 'progress fill on track'],
  // Patterned grounds — `.emboss-bg` in src/brand.css.
  //
  // This script reads flat tokens, so it cannot see a background image. The
  // stand-in below is a measurement: both crests were rendered over page,
  // card and well at the .35 default, the composited pixels read back, and
  // the darkest luminance found was 0.5945 (crest-2 on the well). #CACACA
  // sits at 0.5906 — marginally darker, so checking against it is
  // conservative.
  //
  // Only the three roles brand.css permits on a pattern are listed.
  // fg-subtle / fg-faint (both stone-500) come to 3.47:1 and are barred by
  // the legibility rule rather than tracked as a failure here — no opacity
  // that leaves the pattern visible can carry them.
  //
  // Re-measure if a crest is added or --emboss-opacity is raised above .35.
  ['--color-fg', '#CACACA', TEXT, 'body text on a patterned ground'],
  ['--color-fg-heading', '#CACACA', TEXT, 'heading on a patterned ground'],
  ['--color-fg-muted', '#CACACA', TEXT, 'secondary text on a patterned ground'],
  // The focus ring is NOT checked against filled controls. Every interactive
  // primitive uses `ring-offset-2 ring-offset-bg`, so the ring is separated
  // from the control by page colour and reads against the page — which the
  // three checks above already cover. scripts/check-adherence.mjs enforces
  // that the offset is present; without it, focus on a primary button drops
  // to 2.25:1 and on an Akane surface to 1.03:1.
]

/**
 * Failures accepted with a written reason. These are corrections to send back
 * to the palette author, not things to silently re-tint — see docs/colors.md.
 * Anything not listed here fails the build.
 */
const KNOWN = new Map([
  // Empty, and worth keeping empty.
  //
  // History, because the pattern matters: this map has been emptied three
  // times. The first three failures were resolved by the palette author on
  // 2026-08-08. Four more were recorded on 2026-08-10, when this script first
  // gained the power to fail a build — they were the state already shipping,
  // written down rather than grandfathered in silently. All four are now gone,
  // and NONE of them needed a new decision:
  //
  //   focus ring, 3 grounds  — docs/colors.md correction #1 already said
  //                            Ogon 700; it had never been applied (2026-08-11)
  //   scenario tag           — correction #2 already said Ogon 800; likewise
  //                            never applied (2026-08-13)
  //
  // Both were filed as "the palette author's call" when they were in fact
  // corrections the palette author had already written down. Before adding an
  // entry here, check docs/colors.md — the fix may already be prescribed.
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

// Until 2026-08-10 this printed the count and exited 0 — so it was a report
// wearing the word "gate", and `pnpm build` was green no matter what the
// palette did. It now fails. The escape hatch is KNOWN above, which forces a
// written reason next to the number instead of silence.
if (hard > 0) {
  console.error(
    `\ncontrast gate: FAIL — ${hard} below target with no recorded reason.\n` +
      `Fix the value, or add an entry to KNOWN in ${process.argv[1].split('/').pop()} ` +
      `explaining why it ships.`,
  )
  process.exit(1)
}
console.log(`\ncontrast gate: pass (${CHECKS.length - known.length}/${CHECKS.length} clear)`)
