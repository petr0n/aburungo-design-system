// Facts for a handoff: is each component real, exported, built, and where
// does the app already use or duplicate it. Usage:
//   node .claude/skills/handoff-to-app/scan.mjs Button PhraseCard
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ADS = new URL('../../../', import.meta.url).pathname
const APP = join(ADS, '../aburungo')
const names = process.argv.slice(2)
if (!names.length) { console.error('usage: scan.mjs <Component> [...]'); process.exit(2) }

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : []
})
const appFiles = existsSync(join(APP, 'src')) ? walk(join(APP, 'src')) : []
const barrel = readFileSync(join(ADS, 'src/components/index.ts'), 'utf8')
let failed = false

for (const name of names) {
  const src = ['', 'ui/'].map((d) => `src/components/${d}${name}.tsx`).find((p) => existsSync(join(ADS, p)))
  const exported = new RegExp(`\\b${name}\\b`).test(barrel)
  const built = existsSync(join(ADS, 'dist/index.d.ts')) && readFileSync(join(ADS, 'dist/index.d.ts'), 'utf8').includes(name)
  console.log(`\n## ${name}`)
  console.log(`source:   ${src ?? 'MISSING'}`)
  console.log(`exported: ${exported ? 'yes' : 'NO — add to src/components/index.ts'}`)
  console.log(`built:    ${built ? 'yes' : 'NO — run pnpm build'}`)
  if (!src || !exported || !built) failed = true

  const word = new RegExp(`\\b${name}\\b`)
  const hits = { 'same-name files (duplicate?)': [], imports: [], 'call sites': [] }
  for (const f of appFiles) {
    const rel = relative(APP, f)
    if (new RegExp(`/${name}\\.tsx?$`).test(f)) hits['same-name files (duplicate?)'].push(rel)
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (!word.test(line)) return
      const at = `${rel}:${i + 1}  ${line.trim()}`
      if (/^\s*import\b/.test(line)) hits.imports.push(at)
      else if (new RegExp(`<${name}\\b`).test(line)) hits['call sites'].push(at)
    })
  }
  for (const [k, v] of Object.entries(hits)) console.log(`${k}:\n${v.map((x) => `  ${x}`).join('\n') || '  none'}`)
}
process.exit(failed ? 1 : 0)
