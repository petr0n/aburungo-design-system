#!/usr/bin/env node
/**
 * Self-check for applyKanaModifier in src/lib/kanaData.ts. No framework:
 *
 *   node scripts/lib/kana.test.mjs
 *
 * It exists because the ゛ ゜ 小 keys REPLACED the voiced and small boards. If
 * the tables miss an entry, that character stops being typeable at all, and
 * nothing else in the build would notice -- the keyboard still renders, the
 * key is just dead. So the real invariant is asserted here: every character
 * the old boards offered is still reachable by marking a character on the
 * basic board, and nothing new appeared.
 *
 * esbuild (already a devDependency) transpiles the TS in memory, so this does
 * not depend on dist/ having been built -- lint runs before tsup.
 */
import assert from 'node:assert/strict'
import { build } from 'esbuild'

const bundled = await build({
  entryPoints: ['src/lib/kanaData.ts'],
  bundle: true,
  format: 'esm',
  write: false,
  logLevel: 'silent',
})
const source = bundled.outputFiles[0].text
const {
  applyKanaModifier,
  HIRAGANA_BASIC,
  HIRAGANA_VOICED,
  HIRAGANA_SMALL,
  KATAKANA_BASIC,
  KATAKANA_VOICED,
} = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
)

const cells = (rows) => rows.flat().filter((c) => c !== null)
const MARKS = ['dakuten', 'handakuten', 'small']

/** Everything the marks can produce from the basic board. */
function reachable(basic) {
  const out = new Set()
  for (const base of cells(basic)) {
    for (const mark of MARKS) {
      const marked = applyKanaModifier(base, mark)
      if (marked !== null) out.add(marked)
    }
  }
  return out
}

// 1. Coverage: the boards that were removed are still fully reachable.
const fromHiragana = reachable(HIRAGANA_BASIC)
for (const kana of [...cells(HIRAGANA_VOICED), ...cells(HIRAGANA_SMALL)]) {
  assert.ok(
    fromHiragana.has(kana),
    `${kana} was on a board that no longer exists and no mark produces it`,
  )
}

// 2. The same holds in katakana, which is folded through hiragana rather than
//    given its own table -- so a fold bug shows up here and only here.
const fromKatakana = reachable(KATAKANA_BASIC)
for (const kana of cells(KATAKANA_VOICED)) {
  assert.ok(fromKatakana.has(kana), `katakana ${kana} is unreachable`)
}
assert.equal(applyKanaModifier('カ', 'dakuten'), 'ガ')
assert.equal(applyKanaModifier('ハ', 'handakuten'), 'パ')
assert.equal(applyKanaModifier('ツ', 'small'), 'ッ')
assert.equal(applyKanaModifier('ウ', 'dakuten'), 'ヴ')

// 3. Marks that do not apply return null, which is what disables the key. A
//    key that silently does nothing is the failure this prevents.
assert.equal(applyKanaModifier('あ', 'dakuten'), null)
assert.equal(applyKanaModifier('か', 'handakuten'), null)
assert.equal(applyKanaModifier('か', 'small'), null)
assert.equal(applyKanaModifier('', 'dakuten'), null)

// 4. Only the last character is marked: the keyboard hands over the whole
//    buffer and means "the one just typed".
assert.equal(applyKanaModifier('さか', 'dakuten'), 'が')

console.log(
  `kana modifier self-check: ok (${fromHiragana.size} hiragana, ${fromKatakana.size} katakana reachable)`,
)
