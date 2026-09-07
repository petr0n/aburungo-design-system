#!/usr/bin/env node
/**
 * make-crest-tile — turn one full-size crest render into a repeat tile.
 *
 *   node scripts/make-crest-tile.mjs assets/clan-symbol-flower.png assets/clan-symbol3.png --alpha .46
 *   node scripts/make-crest-tile.mjs assets/silhouette.png assets/clan-symbol4.png --key-white --alpha .4
 *
 * `clan-symbol1.png` and `clan-symbol2.png` arrived pre-tiled from Affinity and
 * nothing in the repo could make a third to match. This is that step, so the
 * next crest the author draws does not need the layout rebuilt by hand.
 *
 * The layout is the one baked into the existing two: a 160px tile carrying the
 * motif twice on the diagonal, at half size. Each copy is inset from the tile
 * edge, so the repeat is seamless without wrap-around copies.
 *
 * `--key-white` converts a silhouette on a white ground into the black-on-alpha
 * the `.emboss-bg` rule expects — alpha from inverted luminance, colour flat
 * black. Without it the white ground tiles as opaque paint and the warm stone
 * underneath stops existing.
 *
 * `--alpha <n>` scales the finished alpha channel. This is how a crest is
 * brought to the weight of the existing two, and it belongs HERE rather than
 * in a per-crest `--emboss-opacity` override: the opacity knob is public, a
 * call site can raise it, and the contrast gate cannot see when one does.
 * Weight baked into the tile leaves one default (.35) for all five crests and
 * one worst case for the gate to model. Measured, not guessed — the same
 * source at .35 ran to 0.4468 (blossom) and 0.3318 (the keyed silhouettes)
 * against 0.5879 for crest-2, which is what the legibility rule is set by.
 *
 * Chrome does the raster work: it is already a dependency for `pnpm shots`, and
 * an image library is not.
 */
import { writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import puppeteer from 'puppeteer-core'
import { findChrome, serveRepo } from './lib/harness.mjs'

const TILE = 160
const PORT = 6097

const [src, out, ...flags] = process.argv.slice(2)
if (src === undefined || out === undefined) {
  console.error('usage: make-crest-tile.mjs <src.png> <out.png> [--key-white]')
  process.exit(1)
}
const keyWhite = flags.includes('--key-white')
const alphaAt = flags.indexOf('--alpha')
const alpha = alphaAt === -1 ? 1 : Number(flags[alphaAt + 1])
if (!Number.isFinite(alpha) || alpha <= 0 || alpha > 1) {
  console.error('--alpha takes a number in (0, 1]')
  process.exit(1)
}

const server = await serveRepo({ port: PORT })
const browser = await puppeteer.launch({ executablePath: await findChrome(), args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })

  const dataUrl = await page.evaluate(
    async ({ src, tile, keyWhite, alpha }) => {
      const img = new Image()
      img.src = '/' + src.split('/').map(encodeURIComponent).join('/')
      await img.decode()

      const half = tile / 2
      const c = document.createElement('canvas')
      c.width = tile
      c.height = tile
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, half, half)
      ctx.drawImage(img, half, half, half, half)

      if (keyWhite || alpha !== 1) {
        const d = ctx.getImageData(0, 0, tile, tile)
        const p = d.data
        for (let i = 0; i < p.length; i += 4) {
          if (keyWhite) {
            const lum = 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2]
            // Un-drawn pixels are already transparent; keep them that way.
            p[i + 3] = p[i + 3] === 0 ? 0 : 255 - lum
            p[i] = p[i + 1] = p[i + 2] = 0
          }
          p[i + 3] = Math.round(p[i + 3] * alpha)
        }
        ctx.putImageData(d, 0, 0)
      }
      return c.toDataURL('image/png')
    },
    { src, tile: TILE, keyWhite, alpha },
  )

  await writeFile(out, Buffer.from(dataUrl.split(',')[1], 'base64'))
  console.log(
    `${basename(out)}  ${TILE}x${TILE}  from ${basename(src)}` +
      `${keyWhite ? '  white-keyed' : ''}${alpha === 1 ? '' : `  alpha x${alpha}`}`,
  )
} finally {
  await browser.close()
  server.close()
}
