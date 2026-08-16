#!/usr/bin/env node
/**
 * check-commit-msg — rejects AI attribution footers in commit messages.
 *
 * The rule "no AI footers or watermarks" existed in the shared memory file and
 * in the consuming app's CLAUDE.md. It was not in this repo's CLAUDE.md, and
 * neither location is read at the moment a commit message is written. The
 * result was 58 commits carrying `Co-Authored-By: Claude ...` — a rule stated
 * twice and broken every single time.
 *
 * That is the same failure mode as the lightning-bolt mark: prose describing a
 * rule does not enforce it. So this is a check, installed as a `commit-msg`
 * hook by scripts/install-hooks.sh and run in CI over the branch's commits.
 *
 * Usage:
 *   node scripts/check-commit-msg.mjs <path-to-COMMIT_EDITMSG>   # hook mode
 *   node scripts/check-commit-msg.mjs --range origin/main..HEAD  # CI mode
 */
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

/**
 * Matched case-insensitively against whole messages. Deliberately broad on the
 * generated-with line: the exact wording has varied (emoji or not, link or
 * plain), and a pattern that only catches one spelling is how this recurs.
 */
const FORBIDDEN = [
  [/^\s*co-authored-by:\s*claude\b/im, 'Co-Authored-By: Claude — AI attribution trailer'],
  [/generated with\s*\[?claude/i, '"Generated with Claude Code" footer'],
  [/🤖/u, 'robot emoji watermark'],
  [/\bwith help from (claude|an? (ai|llm))\b/i, 'AI attribution phrase'],
]

function offences(message) {
  return FORBIDDEN.filter(([re]) => re.test(message)).map(([, label]) => label)
}

const args = process.argv.slice(2)
let failures = []

if (args[0] === '--range') {
  const range = args[1] ?? 'origin/main..HEAD'
  // %H%x00%B%x00 — NUL-delimited so a message body can contain anything.
  const out = execFileSync('git', ['log', '--format=%H%x00%B%x00', range], {
    encoding: 'utf8',
  })
  const parts = out.split('\0')
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const sha = parts[i].trim()
    if (sha === '') continue
    const found = offences(parts[i + 1])
    if (found.length > 0) failures.push([sha.slice(0, 8), found])
  }
} else {
  const path = args[0]
  if (path === undefined) {
    console.error('usage: check-commit-msg.mjs <COMMIT_EDITMSG> | --range <range>')
    process.exit(2)
  }
  const found = offences(readFileSync(path, 'utf8'))
  if (found.length > 0) failures.push(['(this commit)', found])
}

if (failures.length > 0) {
  console.error('\ncommit message check: FAIL\n')
  for (const [sha, found] of failures) {
    console.error(`  ${sha}`)
    for (const f of found) console.error(`      ${f}`)
  }
  console.error(
    '\nThis project does not put AI attribution in commit messages.\n' +
      'Remove the trailer and commit again. Do not add an allowlist here.\n',
  )
  process.exit(1)
}

console.log('commit message check: no AI attribution present')
