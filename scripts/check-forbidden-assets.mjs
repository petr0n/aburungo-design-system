#!/usr/bin/env node
/**
 * Blocks the Supabase lightning-bolt mark from ever re-entering this repo.
 *
 * It is not the AburunGo logo and never was.  It shipped in the initial commit,
 * was described as the brand mark in README and preview prose, and was revived
 * more than once from old branches and commits because those descriptions read
 * as authoritative.  History was purged on 2026-08-07; this keeps it purged.
 *
 * Three independent checks, because renaming or recoloring defeats any one:
 *
 *   1. content hash  — the exact blob, under any filename
 *   2. path data     — the bolt outline, even recolored or re-exported
 *   3. references    — any path still pointing at the deleted file
 *
 * Run: node scripts/check-forbidden-assets.mjs
 * Wired into `pnpm build` and `.git/hooks/pre-commit`.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

/** git hash-object of the original assets/logo.svg. */
const FORBIDDEN_BLOB = '27c8291bf5d310dd09c65c037989c5283516cc05'

/**
 * Opening path coordinates of the bolt outline.  Survives recoloring, resizing
 * and re-export, because the geometry is what is trademarked — not the fill.
 */
const FORBIDDEN_PATH_SIGNATURES = ['M25.946 44.938', 'M25.842 44.938']

/** The deleted filename.  Any surviving reference is a broken link anyway. */
const FORBIDDEN_REFERENCE = 'logo.svg'

/** Files that may legitimately discuss the ban without tripping it. */
const ALLOWLIST = [
  'scripts/check-forbidden-assets.mjs',
  'CLAUDE.md',
]

function tracked() {
  return execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .filter((f) => f !== '' && !ALLOWLIST.includes(f))
}

function hashOf(file) {
  return execFileSync('git', ['hash-object', file], { encoding: 'utf8' }).trim()
}

const violations = []

for (const file of tracked()) {
  let hash
  try {
    hash = hashOf(file)
  } catch {
    continue // vanished between ls-files and now
  }

  if (hash === FORBIDDEN_BLOB) {
    violations.push(`${file} — IS the forbidden mark (exact blob match)`)
    continue
  }

  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    continue // binary or unreadable; the hash check already covered it
  }

  for (const sig of FORBIDDEN_PATH_SIGNATURES) {
    if (text.includes(sig)) {
      violations.push(`${file} — contains the forbidden bolt outline (${sig})`)
    }
  }

  if (text.includes(FORBIDDEN_REFERENCE)) {
    violations.push(`${file} — references the deleted ${FORBIDDEN_REFERENCE}`)
  }
}

if (violations.length > 0) {
  console.error('\n  BLOCKED — the Supabase mark is not the AburunGo logo.\n')
  for (const v of violations) console.error(`    ✗ ${v}`)
  console.error(`
  The AburunGo mark is the ア hanko:
    · CSS      .hanko / .maru in src/brand.css
    · raster   assets/logo-a-128.png, assets/logo-a-tile.png

  If you reached this by checking out an old branch or cherry-picking an old
  commit, the file came with it.  Delete it — do not restore it.
`)
  process.exit(1)
}

console.log('brand check: no forbidden mark present')
