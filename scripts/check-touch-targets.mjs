#!/usr/bin/env node
/**
 * check-touch-targets — the half of Phase 3's gate a script can actually do.
 *
 * `CLAUDE.md`: "Touch targets ≥ 44px. `active:` states required. No hover-only
 * affordances." Nothing checked any of it, so the plan recorded all three as
 * needing a human at a screen. Two of them do not.
 *
 * Touch targets are MEASURED, not inferred from class names. `min-h-[44px]` on
 * a control that a parent clips, or a 44px box whose hit area is an inner span,
 * both read as correct in the source and are wrong on the device. So this
 * renders the harnesses and reads the boxes back.
 *
 * Hover-only is a source check: an element whose class list has a `hover:`
 * variant and no `active:` counterpart is a mouse affordance on a thumb-first
 * product.
 *
 *   node scripts/check-touch-targets.mjs
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'
import { findChrome, serveRepo } from './lib/harness.mjs'

const PORT = 6091
const MIN = 44

/** Surfaces that render real components. The JSX mirrors are checked too —
 *  they are what the storybook shows, and they drift. */
const SURFACES = [
  ['flows · flashcard', '/ui_kits/flows/?flow=flashcard&state=round&step=prompt'],
  ['flows · flashcard summary', '/ui_kits/flows/?flow=flashcard&state=round&step=summary'],
  ['flows · kana drill', '/ui_kits/flows/?flow=kana&state=drill'],
  ['flows · kana keyboard', '/ui_kits/flows/?flow=kana&state=keyboard'],
  ['flows · fill romaji', '/ui_kits/flows/?flow=fill&state=romaji'],
  ['flows · fill kana', '/ui_kits/flows/?flow=fill&state=kana'],
  ['flows · lessons', '/ui_kits/flows/?flow=lessons&state=list'],
  ['flows · error', '/ui_kits/flows/?flow=flashcard&state=error'],
  // The book surfaces. Plan task 3.1 — every new surface joins this list, and
  // the checkpoint is checked on two books rather than one because the band
  // hue changes what sits under a control.
  ['book one · chapter opener', '/ui_kits/flows/?flow=book-one&state=opener'],
  ['book one · lesson ch1', '/ui_kits/flows/?flow=book-one&state=lesson-early'],
  ['book one · lesson ch11', '/ui_kits/flows/?flow=book-one&state=lesson-late'],
  ['book one · final checkpoint', '/ui_kits/flows/?flow=book-one&state=final'],
  // Book Four as the second sample: it and Book One are the two light-ink
  // bands, and a control's edge against Ogon is the case least like the Sumi
  // chrome everything else was measured on.
  ['book four · chapter opener', '/ui_kits/flows/?flow=book-four&state=opener'],
  ['book four · final checkpoint', '/ui_kits/flows/?flow=book-four&state=final'],
  ['book · checkpoint one', '/ui_kits/flows/?flow=checkpoint&state=one'],
  ['book · checkpoint four', '/ui_kits/flows/?flow=checkpoint&state=four'],
  // The mobile kit, since 2026-08-17. It renders the same flow definitions
  // inside an iPhone frame, and its two onboarding screens exist nowhere else
  // -- the landing screen's primary CTA was an unstyled `variant="accent"`
  // that measured as a bare text node for as long as the kit existed.
  ['mobile · landing', '/ui_kits/mobile/?screen=landing'],
  ['mobile · sign in', '/ui_kits/mobile/?screen=signin'],
  ['mobile · flashcard', '/ui_kits/mobile/?screen=flashcard&state=round'],
  ['mobile · kana keyboard', '/ui_kits/mobile/?screen=kana&state=keyboard'],
  ['mobile · lessons', '/ui_kits/mobile/?screen=lessons&state=list'],
]

/**
 * Storybook is hash-routed, and `/storybook/` alone renders only the first
 * story -- Primitives/Button/Primary. Measuring that told us nothing about the
 * other twenty components, and it showed: FillInput's MIRROR kept the 36px mode
 * picker after the real component was fixed, which is precisely the drift this
 * check exists to catch.
 *
 * `window.STORIES` is the registry index.html routes from, so the list comes
 * from the same place the sidebar does and cannot fall behind it.
 */
async function storybookHashes(page) {
  await page.goto(`http://localhost:${PORT}/storybook/`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  const found = await page.evaluate(() => {
    const out = []
    for (const section of window.STORIES ?? []) {
      for (const component of section.components) {
        for (const story of Object.keys(component.stories)) {
          out.push({
            label: `${component.name} · ${story}`,
            hash: `#${encodeURIComponent(section.title)}/${encodeURIComponent(component.name)}/${encodeURIComponent(story)}`,
          })
        }
      }
    }
    return out
  })

  // An empty walk is a broken gate, not a clean one.
  //
  // On 2026-08-26 the storybook stopped being a browser-JSX page and
  // `window.STORIES` went away with it. This function returned `[]`, the gate
  // measured nothing, printed `ok  storybook · 0 stories`, and the run still
  // said "0 undersized" -- with 212 of the 334 controls it used to cover
  // silently gone. A check that cannot find its subject must say so.
  if (found.length === 0) {
    throw new Error(
      'check-touch-targets: the storybook exposed no stories. ' +
        'storybook/main.tsx must set `window.STORIES` -- see the note there.',
    )
  }
  return found
}

/** Measure every interactive box inside `scope`, returning the undersized. */
const PROBE = (min) => {
  const sel = 'button, a[href], input:not([type=hidden]), select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
  const out = []
  let seen = 0
  // Measure the product, not the tool around it. `[data-phone]` is the flow
  // harness's screen; `.sb-canvas` is the storybook's story area. The
  // storybook's own chrome -- the Grid/Solid toggle, the Controls tabs, the
  // args panel -- is a dev tool nobody uses with a thumb, and counting it
  // reported 11 failures that were not product at all.
  const scope = document.querySelector('[data-phone]') ?? document.querySelector('.sb-canvas')
  for (const el of document.querySelectorAll(sel)) {
    if (scope !== null && !scope.contains(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue // not rendered in this state
    seen += 1
    if (r.height + 0.5 < min || r.width + 0.5 < min) {
      out.push({
        tag: el.tagName.toLowerCase(),
        label: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 34),
        w: Math.round(r.width), h: Math.round(r.height),
      })
    }
  }
  return { out, seen }
}

const server = await serveRepo({ port: PORT })
const browser = await puppeteer.launch({
  executablePath: await findChrome(), headless: true, args: ['--no-sandbox'],
})

let failures = 0
let measured = 0

console.log(`\ntouch targets — measured at a phone width, minimum ${MIN}px\n`)

for (const [label, path] of SURFACES) {
  const page = await browser.newPage()
  // 390px is the iPhone 15/16 logical width; the harness phone shell matches it.
  await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 2 })
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle0', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 900))

  const small = await page.evaluate(PROBE, MIN)

  measured += small.seen
  if (small.out.length === 0) {
    console.log(`  ok    ${label.padEnd(28)} ${small.seen} controls`)
  } else {
    failures += small.out.length
    console.log(`  FAIL  ${label.padEnd(28)} ${small.seen} controls`)
    for (const c of small.out) {
      console.log(`          ${String(c.w).padStart(3)}x${String(c.h).padEnd(3)}  <${c.tag}> ${c.label}`)
    }
  }
  await page.close()
}

// ── Every storybook story, i.e. every JSX mirror ─────────────────────────
{
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 2 })
  const stories = await storybookHashes(page)
  let bad = 0
  for (const { label, hash } of stories) {
    await page.goto(`http://localhost:${PORT}/storybook/${hash}`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 260))
    const small = await page.evaluate(PROBE, MIN)
    measured += small.seen
    if (small.out.length > 0) {
      bad += small.out.length
      failures += small.out.length
      console.log(`  FAIL  storybook · ${label}`)
      for (const c of small.out) {
        console.log(`          ${String(c.w).padStart(3)}x${String(c.h).padEnd(3)}  <${c.tag}> ${c.label}`)
      }
    }
  }
  console.log(`  ${bad === 0 ? 'ok  ' : 'FAIL'}  ${`storybook · ${stories.length} stories`.padEnd(28)}`)
  await page.close()
}

await browser.close()
server.close()

// ── Hover without active, from source ────────────────────────────────────
console.log('\nhover-only affordances — source scan\n')

async function collect(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await collect(p)))
    else if (/\.(tsx|jsx)$/.test(e.name)) out.push(p)
  }
  return out
}

let hoverOnly = 0
for await (const file of [...(await collect('src/components')), 'ui_kits/mobile/components.jsx']) {
  const src = await readFile(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    if (!line.includes('hover:')) return
    // A hover variant is fine when the same class list also presses.
    if (line.includes('active:')) return
    // group-hover on a decorative child is not an affordance by itself.
    if (/group-hover:|hover:underline/.test(line) && !/\bhover:bg-|\bhover:text-/.test(line)) return
    hoverOnly += 1
    console.log(`  FAIL  ${file}:${i + 1}`)
    console.log(`          ${line.trim().slice(0, 96)}`)
  })
}
if (hoverOnly === 0) console.log('  ok    no hover variant without an active counterpart')

console.log(`\n${measured} controls measured · ${failures} undersized · ${hoverOnly} hover-only\n`)
process.exit(failures + hoverOnly > 0 ? 1 : 0)
