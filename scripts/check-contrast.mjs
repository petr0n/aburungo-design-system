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
 * sitting next to the number.
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
  // The band rule and the secondary button's edge. Both were ungated, and both
  // were the only thing giving a surface its shape: the secondary fill is
  // 1.09:1 against the page, so if its border does not read, the control has no
  // boundary at all. rule-on-inverse was Ogon 700 at 2.74:1 until 2026-08-16.
  ['--color-rule-on-inverse', '--color-inverse', UI, 'band rule on inverse chrome'],
  ['--color-action-2-border', '--color-bg', UI, 'secondary button edge on page'],
  // The maru marks. These carry the outcome -- a learner reads them to find out
  // whether they got it right -- so they are text, not ornament. They drew in
  // the 500 steps until 2026-08-16: success-500 was 3.19:1 on a card and 3.00:1
  // on the page, i.e. failing even the 3:1 for a non-text indicator.
  //
  // Every ground the mark actually lands on is checked, not just the card. The
  // page number is the one that was worst, so gating only `surface` would have
  // let exactly the failure this replaced come back unnoticed. On success-bg and
  // error-bg the pairing is already covered by the banner checks above; the
  // Ai tint is AnswerResult's reveal block, which holds the Japanese.
  ['--color-success-fg', '--color-surface', TEXT, 'recalled mark on card'],
  ['--color-error-fg', '--color-surface', TEXT, 'not-quite mark on card'],
  ['--color-success-fg', '--color-bg', TEXT, 'recalled mark on page'],
  ['--color-error-fg', '--color-bg', TEXT, 'not-quite mark on page'],
  ['--color-success-fg', '--color-accent-ai-bg', TEXT, 'recalled mark on the Ai tint'],
  ['--color-error-fg', '--color-accent-ai-bg', TEXT, 'not-quite mark on the Ai tint'],
  // The four card accents, as PhraseCard and ScoreCard actually use them:
  // `bg-accent-<hue> text-accent-<hue>-fg`. None of these were gated, and the
  // four hues are nowhere near the same lightness -- Ai-iro is near-black,
  // Ogon a light gold -- so passing on one says nothing about the others.
  // Rokusho was 3.19:1 with a paper label until 2026-08-16.
  ['--color-accent-ogon-fg', '--color-accent-ogon', TEXT, 'label on the Ogon accent'],
  ['--color-accent-ai-fg', '--color-accent-ai', TEXT, 'label on the Ai accent'],
  ['--color-accent-rokusho-fg', '--color-accent-rokusho', TEXT, 'label on the Rokusho accent'],
  ['--color-accent-akane-fg', '--color-accent-akane', TEXT, 'label on the Akane accent'],
  // Sumi joined the accent set 2026-08-21 for Book Five. Gated on arrival
  // rather than later: Rokusho's pair shipped ungated for months at 3.19:1,
  // which is the reason this block exists at all.
  ['--color-accent-sumi-fg', '--color-accent-sumi', TEXT, 'label on the Sumi accent'],
  // The verdict marks on their own tinted banner. Ungated until 2026-08-21,
  // and preview/16-accent-usage.html had recorded error-500 there at 3.98:1 —
  // a known failure that sat as a note instead of a fix. At the 800 step both
  // clear comfortably.
  ['--color-success-500', '--color-success-bg', TEXT, 'correct mark on its banner'],
  ['--color-error-500', '--color-error-bg', TEXT, 'not-quite mark on its banner'],
  //
  // A card ground is deliberately NOT gated against the page, and this is where
  // that was tested rather than assumed. Adding `accent-sumi-bg vs bg` at 3:1
  // failed at 1.08:1 -- so every other accent ground was measured, and they run
  // 1.09 (Ogon) to 1.17 (Ai). The plain card is 1.06:1, the lowest of the lot,
  // and it is the surface DESIGN.md says "lifts without a shadow".
  //
  // Cards in this palette separate by warmth and hue, not by luminance ratio.
  // A 3:1 bar here flags the system's own foundation -- the same trap as the
  // raw-px rule check-adherence dropped, which "only ever fired on correct code
  // and trains people to ignore it". Do not add it back.
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
  // `ErrorState`'s panel, added 2026-08-16 when the state stopped being
  // `EmptyState` in a different type size. Its message reuses the pair already
  // gated as "not-quite banner", but the description line is `fg-muted` on the
  // Akane tint rather than on a card — a combination nothing measured before.
  ['--color-fg-muted', '--color-error-bg', TEXT, 'error panel description'],
  // The panel edge against the crest, which is what separates the two, and the
  // reason the panel does not need a `.glass` pane under it the way
  // `EmptyState` does.
  //
  // This is why `ErrorState` draws its edge in `error-fg` and not the
  // `error-border` role it started with: akane-300 on the pattern measures
  // **1.36:1**, and Akane 500 measures 2.97:1 — still short. The edge was
  // there in the markup and gone on the screen — the same silent-inert failure
  // as `bg-inverse` and the `.glass` border, caught here only because the pair
  // got gated. `error-border` is unchanged and still right for `AnswerResult`,
  // which sits on a card rather than on a crest.
  ['--color-error-fg', '#CACACA', UI, 'error panel edge on a patterned ground'],
  // The `.glass` panel — the only way fg-subtle is allowed over a pattern.
  //
  // #EDEDED stands in for the darkest field measured under the shipped glass
  // on a ground it is SUPPORTED on: 0.8469 against the 0.8522 measured on a
  // card with crest-2, so marginally conservative.
  //
  // A patterned WELL is deliberately not modelled here. It measures 4.47 and
  // fails, and brand.css bars the combination rather than re-tinting the
  // glass to cover a case that should not arise. If a well ever needs a
  // patterned ground, this gate will not catch it — read the note at .glass.
  //
  // Blur is part of the measurement: without backdrop-filter the same
  // gradient lands at 4.26, which is why brand.css ships a more opaque
  // @supports fallback rather than the same fill at another alpha.
  ['--color-fg', '#EDEDED', TEXT, 'body text on glass over a pattern'],
  ['--color-fg-heading', '#EDEDED', TEXT, 'heading on glass over a pattern'],
  ['--color-fg-subtle', '#EDEDED', TEXT, 'fine print on glass over a pattern'],
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
  // The focus ring on light grounds. Ogon 500 scores 2.26 / 2.40 / 2.08 on
  // page / card / well against the 3:1 SC 1.4.11 wants for a non-text
  // indicator.
  //
  // This is a deliberate, twice-made call by the palette author, not an
  // oversight. It was moved to Ogon 700 on 2026-08-11, which cleared every
  // ground at 4.65 / 4.95 / 4.29, and moved back on 2026-08-13 after looking
  // at both: 700 reads brown, and Ogon is the warmth of this palette. DO NOT
  // re-tint it to make this number green.
  //
  // SETTLED, do not reopen. Ogon 700 and a two-tone gold-plus-hairline ring
  // were both proposed and both rejected. These three entries are permanent
  // unless the author raises it themselves.
  [
    'focus ring on page',
    'Ogon 500, 2.26:1. Author kept the gold over the ratio, 2026-08-13. ' +
      'See src/tokens.css and docs/colors.md "The focus ring".',
  ],
  ['focus ring on card', 'Ogon 500, 2.40:1. Same call as "focus ring on page".'],
  ['focus ring on well', 'Ogon 500, 2.08:1 — the worst of the three. Same call.'],
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
