#!/usr/bin/env node
/**
 * shots-responsive — render every flow at the four gate widths.
 *
 * Phase 3's eight-point gate has one point no script can settle: "renders at
 * 375 / 768 / 1024 / 1440". This does the rendering so the human part is
 * looking rather than driving a browser twenty-eight times.
 *
 * 375 is the smallest phone still worth supporting (iPhone SE), 768 a portrait
 * tablet, 1024 a landscape tablet, 1440 a laptop. The product is phone-first;
 * the wide widths are checked because the harness is viewed on a desktop and a
 * layout that only works at 390 will look broken to whoever reviews it.
 *
 * Output: scripts/.shots-out/responsive/ (gitignored), plus an index.html that
 * lays each surface out as a row of four so the comparison is one scroll.
 *
 *   node scripts/shots-responsive.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { findChrome, serveRepo } from './lib/harness.mjs'

const PORT = 6090
const OUT = 'scripts/.shots-out/responsive'
const WIDTHS = [375, 768, 1024, 1440]

const SURFACES = [
  ['flashcard-prompt', 'Flashcard · prompt', '/ui_kits/flows/?flow=flashcard&state=round&step=prompt'],
  ['flashcard-reveal', 'Flashcard · reveal', '/ui_kits/flows/?flow=flashcard&state=round&step=reveal'],
  ['flashcard-summary', 'Flashcard · summary', '/ui_kits/flows/?flow=flashcard&state=round&step=summary'],
  ['flashcard-empty', 'Flashcard · empty', '/ui_kits/flows/?flow=flashcard&state=empty'],
  ['flashcard-error', 'Flashcard · error', '/ui_kits/flows/?flow=flashcard&state=error'],
  ['kana-chart', 'Kana · chart', '/ui_kits/flows/?flow=kana&state=chart'],
  ['kana-drill', 'Kana · drill', '/ui_kits/flows/?flow=kana&state=drill'],
  ['kana-keyboard', 'Kana · keyboard', '/ui_kits/flows/?flow=kana&state=keyboard'],
  ['kana-result', 'Kana · result', '/ui_kits/flows/?flow=kana&state=result'],
  ['fill-romaji', 'Fill · romaji', '/ui_kits/flows/?flow=fill&state=romaji'],
  ['fill-kana', 'Fill · kana grid', '/ui_kits/flows/?flow=fill&state=kana'],
  ['fill-review', 'Fill · review', '/ui_kits/flows/?flow=fill&state=review'],
  ['lessons-list', 'Lessons · list', '/ui_kits/flows/?flow=lessons&state=list'],
  ['lessons-empty', 'Lessons · empty', '/ui_kits/flows/?flow=lessons&state=empty'],
]

// The mobile kit is deliberately NOT swept. Its frame is a fixed 402px iPhone,
// so every surface reported +51 at 375 -- a fact about the device mockup, not
// about the product, and the exact mistake the `?phone=` note above records.
// A "375px iPhone 16 Pro" is not a thing. The four flows it renders are already
// covered here through the flows harness, which narrows its shell; the two
// screens that exist only there, landing and sign-in, are checked by
// check-touch-targets instead.

await mkdir(OUT, { recursive: true })
const server = await serveRepo({ port: PORT })
const browser = await puppeteer.launch({
  executablePath: await findChrome(), headless: true, args: ['--no-sandbox'],
})

let overflowed = 0
const rows = []

for (const [id, label, path] of SURFACES) {
  const shots = []
  for (const width of WIDTHS) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
    // The phone shell is fixed-width chrome; at 375 a 390px shell cannot fit
    // and reports an overflow that says nothing about the product. Narrow the
    // shell to the viewport so the sweep measures the screen, not the frame.
    const phone = Math.min(width - 48, 390)
    const sep = path.includes('?') ? '&' : '?'
    await page.goto(`http://localhost:${PORT}${path}${sep}phone=${phone}`, {
      waitUntil: 'networkidle0', timeout: 45000,
    })
    await new Promise((r) => setTimeout(r, 700))

    // Two questions, and only the second is the product's: did the page
    // scroll sideways, and did anything overflow the phone screen itself.
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement.scrollWidth - document.documentElement.clientWidth
      const screen = document.querySelector('[data-phone]')
      const inner = screen === null ? 0 : screen.scrollWidth - screen.clientWidth
      return Math.max(doc, inner)
    })
    const file = `${id}-${width}.png`
    await page.screenshot({ path: `${OUT}/${file}`, fullPage: true })
    if (overflow > 1) overflowed += 1
    shots.push({ width, file, overflow: overflow > 1 ? overflow : 0 })
    await page.close()
  }
  rows.push({ label, shots })
  const bad = shots.filter((s) => s.overflow > 0)
  console.log(
    `  ${bad.length === 0 ? 'ok  ' : 'WIDE'} ${label.padEnd(22)}` +
      (bad.length === 0 ? '' : bad.map((s) => ` ${s.width}px +${s.overflow}`).join('')),
  )
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Responsive sweep — Phase 3 gate</title>
<style>
 body{margin:0;padding:24px;font:14px/1.5 system-ui,sans-serif;background:#F7F6F1;color:#2D2D2D}
 h1{font-size:20px;margin:0 0 4px;color:#1F3A66}
 p.lede{color:#57534C;max-width:90ch;margin:0 0 24px}
 h2{font-size:15px;margin:28px 0 8px;color:#1F3A66}
 .row{display:flex;gap:14px;align-items:flex-start;overflow-x:auto;padding-bottom:8px}
 figure{margin:0;flex:0 0 auto}
 figcaption{font:12px ui-monospace,monospace;color:#6B665E;margin-bottom:4px}
 img{border:1px solid #CFC9B9;background:#fff;display:block;height:420px;width:auto}
 .wide{color:#6f1616;font-weight:700}
</style></head><body>
<h1>Responsive sweep — Phase 3 gate</h1>
<p class="lede">Every flow state at 375 / 768 / 1024 / 1440. Generated by
<code>node scripts/shots-responsive.mjs</code>. A caption marked <span class="wide">WIDE</span> means the
document scrolled horizontally at that width — something did not fit and pushed the page out.
Images are scaled to a common height, so the phone shell looks larger at narrow widths; compare layout,
not size.</p>
${rows
  .map(
    (r) => `<h2>${r.label}</h2>\n<div class="row">${r.shots
      .map(
        (s) =>
          `<figure><figcaption>${s.width}px${s.overflow > 0 ? ` <span class="wide">WIDE +${s.overflow}</span>` : ''}</figcaption>` +
          `<img src="${s.file}" alt="${r.label} at ${s.width}px" loading="lazy"></figure>`,
      )
      .join('')}</div>`,
  )
  .join('\n')}
</body></html>
`
await writeFile(`${OUT}/index.html`, html)

await browser.close()
server.close()
console.log(
  `\n${SURFACES.length * WIDTHS.length} renders -> ${OUT}/index.html` +
    `\n${overflowed} overflowed horizontally\n`,
)
