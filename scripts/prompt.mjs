#!/usr/bin/env node
/**
 * prompt — assemble one illustration prompt and print it.
 *
 *   pnpm prompt 11.1            # style block + scene 11.1 + tail
 *   pnpm prompt 11.1 --no-ref   # same, minus the "match the attached" paragraph
 *   pnpm prompt 11.1 | pbcopy   # straight to the clipboard
 *
 * Every prompt is the same three parts, each kept in exactly one place:
 *   1. the style block   illustrations/README.md, the fence under "## The style block"
 *   2. the scene block   illustrations/book-1/plan.md, the fence under "### <id> ·"
 *   3. the tail          illustrations/reference/sheet-prompt.md, the RESTATED fence
 *
 * The first pull of 2026-09-30 went out with parts 2 and 3 only -- the style
 * block lives in a second document and the copy was skipped -- and came back
 * 3:2, borderless, four colours, red as line. Correct carving, wrong rules. A
 * prompt that has to be assembled by hand from two files will be assembled
 * wrong one time in six; this assembles it.
 *
 * `--no-ref` is for image 1 of the reference sheet, which has nothing attached:
 * it drops the style block's first paragraph, the one that begins "Match the
 * attached reference image". Everything else attaches a reference and keeps it.
 */
import { readFileSync } from 'node:fs'

const [id, ...flags] = process.argv.slice(2)
if (id === undefined) {
  console.error('usage: pnpm prompt <scene-id> [--no-ref]   e.g. pnpm prompt 11.1')
  process.exit(1)
}
const noRef = flags.includes('--no-ref')

/** The first fenced block after a heading line that starts with `marker`. */
function fenceAfter(file, marker) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const at = lines.findIndex((l) => l.startsWith(marker))
  if (at === -1) throw new Error(`${file}: no heading starting "${marker}"`)
  const open = lines.indexOf('```', at)
  const close = lines.indexOf('```', open + 1)
  if (open === -1 || close === -1) throw new Error(`${file}: no fence after "${marker}"`)
  return lines.slice(open + 1, close).join('\n').trim()
}

let style = fenceAfter('illustrations/README.md', '## The style block')
if (noRef) {
  const [first, ...rest] = style.split('\n\n')
  if (!first.startsWith('Match the attached')) throw new Error('style block no longer opens with the attach paragraph; check README.md')
  style = rest.join('\n\n')
}
const scene = fenceAfter('illustrations/book-1/plan.md', `### ${id} ·`)
const tail = fenceAfter('illustrations/reference/sheet-prompt.md', '## The tail')

process.stdout.write(`${style}\n\n${scene}\n\n${tail}\n`)
