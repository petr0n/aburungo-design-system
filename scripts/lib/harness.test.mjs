#!/usr/bin/env node
/**
 * Self-check for scripts/lib/harness.mjs. No framework: `node` runs it.
 *
 *   node scripts/lib/harness.test.mjs
 *
 * It exists for `safeResolve`. The first version of that containment check was
 * `full.startsWith(resolve('.'))`, which also accepts a *sibling* directory
 * whose name merely begins with the root — `/srv/app` admitting
 * `/srv/app-backup`. That is the kind of bug that reads as correct and is only
 * caught by asserting it, so it is asserted here.
 */
import assert from 'node:assert/strict'
import { resolve, sep } from 'node:path'
import { safeResolve } from './harness.mjs'

const root = resolve('.')
const leaf = root.split(sep).pop()

const allowed = ['/index.html', '/preview/03-color.html', '/', '/src/tokens.css']
const denied = [
  '/../../etc/passwd',
  '/%2e%2e/%2e%2e/etc/passwd',
  `/../${leaf}-bad/secrets`, // the sibling-prefix case
  '/preview/../../etc/hosts',
  '/../',
]

for (const p of allowed) {
  assert.notEqual(safeResolve(root, p), null, `should serve ${p}`)
}
for (const p of denied) {
  assert.equal(safeResolve(root, p), null, `should refuse ${p}`)
}

// The root itself is not a file, and must not resolve to one.
assert.equal(safeResolve(root, '/..'), null, 'should refuse the parent of root')

// Query strings and fragments are not part of the path.
assert.equal(
  safeResolve(root, '/index.html?flow=lessons#top'),
  safeResolve(root, '/index.html'),
  'query and fragment should be stripped',
)

console.log(`harness self-check: ok (${allowed.length + denied.length + 2} assertions)`)
