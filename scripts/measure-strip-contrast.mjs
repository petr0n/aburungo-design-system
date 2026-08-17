#!/usr/bin/env node
/**
 * measure-strip-contrast — read composited pixels off a rendered page.
 *
 * The scenario-card strip is a crest image over an accent fill. Token maths
 * cannot see that: it knows the accent's hex and nothing about what the crest
 * does to it. So this renders the page, reads the strip's pixels back, and
 * contrasts the WORST ground pixel against the known foreground token.
 *
 * Foreground is taken from the token rather than sampled, because text is
 * antialiased and its edge pixels are blends, not the colour anyone reads.
 *
 *   node scripts/measure-strip-contrast.mjs
 */
import puppeteer from 'puppeteer-core'
import { findChrome, serveRepo } from './lib/harness.mjs'

const PORT = 6097
const PAGE = '/preview/_sandbox/scenario-2-tag-contrast.html'

const server = await serveRepo({ port: PORT })
const browser = await puppeteer.launch({
  executablePath: await findChrome(), headless: true, args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1300, height: 1500, deviceScaleFactor: 2 })
await page.goto(`http://localhost:${PORT}${PAGE}`, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))

const shot = await page.screenshot({ encoding: 'base64', fullPage: true })

const results = await page.evaluate(async (b64) => {
  const img = new Image()
  img.src = 'data:image/png;base64,' + b64
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.width; c.height = img.height
  c.getContext('2d').drawImage(img, 0, 0)
  const ctx = c.getContext('2d')
  const dpr = img.width / document.documentElement.scrollWidth

  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const lum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255)
  const ratio = (a, b) => { const [x, y] = [a, b].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const hexLum = (h) => {
    const m = h.trim().replace('#', '')
    const n = m.length === 3 ? m.split('').map((ch) => ch + ch).join('') : m
    return lum(parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16))
  }
  const cs = getComputedStyle(document.documentElement)
  const token = (n) => cs.getPropertyValue(n).trim()

  const out = []
  for (const probe of document.querySelectorAll('[data-probe]')) {
    const key = probe.dataset.probe
    const strip = probe.closest('.strip')
    const sr = strip.getBoundingClientRect()
    const tr = probe.getBoundingClientRect()
    const sy = window.scrollY, sx = window.scrollX

    // Sample the strip, skipping the tag's own box: this is the GROUND.
    const lums = []
    for (let y = sr.top + 6; y < sr.bottom - 6; y += 2) {
      for (let x = sr.left + 4; x < sr.right - 4; x += 2) {
        if (x > tr.left - 3 && x < tr.right + 3 && y > tr.top - 3 && y < tr.bottom + 3) continue
        const d = ctx.getImageData(Math.round((x + sx) * dpr), Math.round((y + sy) * dpr), 1, 1).data
        lums.push(lum(d[0], d[1], d[2]))
      }
    }
    if (lums.length === 0) continue
    lums.sort((a, b) => a - b)
    const lo = lums[Math.floor(lums.length * 0.02)]
    const hi = lums[Math.floor(lums.length * 0.98)]

    // Foreground: the pill's fill, or the label colour, from the token.
    const isPill = probe.classList.contains('t-paper')
    const fgLum = isPill ? hexLum(token('--stone-0')) : hexLum(getComputedStyle(probe).color.match(/\d+/g)
      ? '#' + getComputedStyle(probe).color.match(/\d+/g).slice(0, 3)
          .map((n) => Number(n).toString(16).padStart(2, '0')).join('') : '#000000')

    // Worst case: whichever ground extreme sits closest to the foreground.
    const worst = Math.min(ratio(fgLum, lo), ratio(fgLum, hi))
    out.push({ key, worst: Math.round(worst * 100) / 100, isPill,
      spread: Math.round((hi - lo) * 1000) / 1000 })
  }

  // Ground-only strips: report the mean luminance so the spread is visible.
  for (const el of document.querySelectorAll('[data-out^="ground-"]')) {
    const strip = el.closest('.col').querySelector('.strip')
    const r = strip.getBoundingClientRect()
    const lums = []
    for (let y = r.top + 6; y < r.bottom - 6; y += 2)
      for (let x = r.left + 6; x < r.right - 6; x += 2) {
        const d = ctx.getImageData(Math.round((x + window.scrollX) * dpr), Math.round((y + window.scrollY) * dpr), 1, 1).data
        lums.push(lum(d[0], d[1], d[2]))
      }
    lums.sort((a, b) => a - b)
    out.push({ key: el.dataset.out, meanLum: Math.round(lums[Math.floor(lums.length / 2)] * 1000) / 1000 })
  }
  return out
}, shot)

console.log('\nmeasured from rendered pixels — crest over accent\n')
for (const r of results) {
  if (r.meanLum !== undefined) { console.log(`  ${r.key.padEnd(18)} median luminance ${r.meanLum}`); continue }
  const need = r.isPill ? 3 : 4.5
  const verdict = r.worst >= need ? 'PASS' : 'FAIL'
  console.log(`  ${verdict}  ${String(r.worst).padStart(6)}:1  (need ${need})  ${r.key}`)
}
console.log()

await browser.close()
server.close()
