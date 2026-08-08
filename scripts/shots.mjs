#!/usr/bin/env node
/**
 * shots — render the design surfaces headlessly and save PNGs.
 *
 * This is a repo asset, not a scratch file. Design review here is done by
 * looking at rendered screens, so the thing that renders them belongs in
 * version control with a `pnpm` entry — not rebuilt from memory each session.
 *
 *   pnpm shots                  # every surface
 *   pnpm shots storybook kana   # only surfaces whose name matches
 *
 * Output: scripts/.shots-out/ (gitignored).
 *
 * Serves the repo root over http.server first. The harnesses do NOT work from
 * file:// — the token sheet and JSX are fetched relative to the server root.
 */
import { createServer } from 'node:http'
import { readFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import puppeteer from 'puppeteer-core'

const PORT = 6099
const OUT = 'scripts/.shots-out'

/** name, path, viewport */
const SURFACES = [
  ['storybook', '/storybook/', 1280, 900],
  ['uikit-mobile', '/ui_kits/mobile/', 430, 900],
  ['uikit-app', '/ui_kits/app/', 1280, 900],
  ['uikit-desktop', '/ui_kits/desktop-explore.html', 1440, 900],
  ['flow-prompt', '/ui_kits/flows/?state=round&step=prompt', 1280, 1100],
  ['flow-reveal', '/ui_kits/flows/?state=round&step=reveal', 1280, 1100],
  ['flow-summary', '/ui_kits/flows/?state=round&step=summary', 1280, 1100],
  ['flow-loading', '/ui_kits/flows/?state=loading', 1280, 1100],
  ['flow-empty', '/ui_kits/flows/?state=empty', 1280, 1100],
  ['flow-error', '/ui_kits/flows/?state=error', 1280, 1100],
  ['flow-checked', '/ui_kits/flows/?state=checked', 1280, 1100],
  ['brand', '/preview/03-color-brand.html', 760, 260],
  ['semantic', '/preview/05-color-semantic.html', 760, 180],
  ['buttons', '/preview/15-buttons.html', 760, 200],
  ['inputs', '/preview/17-inputs.html', 760, 240],
  ['badges', '/preview/20-badges.html', 760, 200],
  ['progress', '/preview/24-progress.html', 760, 240],
  ['progress-contrast', '/preview/28-progress-contrast.html', 1080, 780],
  ['sandbox-surfaces', '/preview/_sandbox/surfaces-1-current.html', 900, 420],
  ['sandbox-vibrancy', '/preview/_sandbox/vibrancy-1-before-after.html', 1000, 560],
  ['sandbox-kana', '/preview/_sandbox/kana-2-green.html', 1180, 400],
  ['sandbox-phrasecard', '/preview/_sandbox/phrasecard-1-colour.html', 1200, 520],
  ['sandbox-resolved', '/preview/_sandbox/phrasecard-2-resolved.html', 1120, 760],
  ['sandbox-accents', '/preview/_sandbox/phrasecard-3-accents.html', 1180, 620],
  ['phrasecard', '/preview/22-phrase-card.html', 760, 320],
  ['kana-key', '/preview/23-kana-key.html', 760, 260],
  ['empty-state', '/preview/25-empty-state.html', 760, 260],
]

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jsx': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2',
}

/** Chrome comes from puppeteer's cache; `npx impeccable` populates it. */
async function findChrome() {
  const base = join(homedir(), '.cache/puppeteer/chrome-headless-shell')
  if (!existsSync(base)) {
    throw new Error(
      'No cached Chrome. Run:  npx puppeteer browsers install chrome-headless-shell',
    )
  }
  const versions = (await readdir(base)).sort()
  const bin = join(base, versions.at(-1), 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell')
  if (!existsSync(bin)) throw new Error(`Chrome not at expected path: ${bin}`)
  return bin
}

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  try {
    const body = await readFile(resolve('.' + p))
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})

const filters = process.argv.slice(2)
const wanted = SURFACES.filter((s) => filters.length === 0 || filters.some((f) => s[0].includes(f)))
if (wanted.length === 0) {
  console.error(`No surface matches ${filters.join(', ')}. Known: ${SURFACES.map((s) => s[0]).join(', ')}`)
  process.exit(1)
}

await mkdir(OUT, { recursive: true })
await new Promise((r) => server.listen(PORT, r))
const browser = await puppeteer.launch({
  executablePath: await findChrome(), headless: true, args: ['--no-sandbox'],
})

let failed = 0
for (const [name, path, w, h] of wanted) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('requestfailed', (r) => errors.push(`404 ${r.url().replace(`http://localhost:${PORT}`, '')}`))
  try {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle0', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 1200))
    // Report the resolved palette so a blank render is obvious from the log.
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim(),
    )
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
    const note = errors.length > 0 ? `  ⚠ ${errors.slice(0, 2).join('; ')}` : ''
    if (errors.length > 0) failed += 1
    console.log(`  ${name.padEnd(18)} accent=${(accent || '(unset)').padEnd(9)}${note}`)
  } catch (err) {
    failed += 1
    console.error(`  ${name.padEnd(18)} FAILED — ${err.message}`)
  }
  await page.close()
}

await browser.close()
server.close()
console.log(`\n${wanted.length} surface(s) -> ${OUT}/`)
if (failed > 0) console.error(`${failed} had errors.`)
