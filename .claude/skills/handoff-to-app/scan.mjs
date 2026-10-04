// Facts for a handoff: is each component real, exported, built, and where
// does the app already use or duplicate it. Usage:
//   node .claude/skills/handoff-to-app/scan.mjs Button PhraseCard
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ADS = new URL('../../../', import.meta.url).pathname
// ADS_APP exists so the "app missing" path can be exercised without moving a
// checkout. It is not a configuration knob; the app lives at ../aburungo.
const APP = process.env.ADS_APP ?? join(ADS, '../aburungo')
const names = process.argv.slice(2)
if (!names.length) { console.error('usage: scan.mjs <Component> [...]'); process.exit(2) }

// No app source is a broken setup, not an app with no usages. Treating it as
// empty printed "none" for every import and call site and exited 0, so a
// handoff written from that output would omit every app change.
if (!existsSync(join(APP, 'src'))) {
  console.error(`scan.mjs: no app source at ${join(APP, 'src')} -- clone petr0n/aburungo beside this repo, or set ADS_APP to its path`)
  process.exit(2)
}

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : []
})
const appFiles = walk(join(APP, 'src'))
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
  // Most components keep their Props type private. The template's `import type`
  // line is only valid when the barrel re-exports it, so say which.
  const propsPublic = new RegExp(`\\b${name}Props\\b`).test(barrel)
  console.log(`props:    ${propsPublic ? `${name}Props is public — import type { ${name}Props }` : `${name}Props is NOT exported — omit the import type line; document props from the source file`}`)
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
