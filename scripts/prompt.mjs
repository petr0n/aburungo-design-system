#!/usr/bin/env node
/**
 * prompt — print one illustration prompt: the lead line plus the scene block.
 *
 *   pnpm prompt 11.1 | pbcopy
 *
 * The style comes from the attached illustrations/reference/style-reference.jpg,
 * not from written rules (restart of 2026-10-04). The scene block is the fence
 * under "### <id> ·" in illustrations/book-1/plan.md.
 */
import { readFileSync } from 'node:fs'

const id = process.argv[2]
if (id === undefined) {
  console.error('usage: pnpm prompt <scene-id>   e.g. pnpm prompt 11.1')
  process.exit(1)
}

const LEAD = 'A Japanese woodblock print in the style of the attached image, of this scene. Square, 1:1. One image only.'

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

const scene = fenceAfter('illustrations/book-1/plan.md', `### ${id} ·`)
process.stdout.write(`${LEAD}\n\n${scene}\n`)
