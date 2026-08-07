#!/usr/bin/env node
/**
 * Adherence check — raw values must not appear in shipped components.
 *
 * Ported from the three bans the v3 drop declared under `no-restricted-syntax`
 * in `_adherence.oxlintrc.json`, which oxlint does not implement.
 *
 * The px ban was dropped deliberately. Run against this codebase it produced 13
 * findings and zero true positives: every hit was `min-h-[44px]` (CLAUDE.md's
 * own touch-target floor), `perspective-[1200px]` on FlipCard, or an AppHeader
 * height. There is no spacing token for any of them, so the rule only ever
 * fired on correct code — and a check that flags your own requirements trains
 * people to ignore it. Reinstate it if a spacing scale ever covers those cases.
 *
 * Scope is the shipped package. `preview/` and `ui_kits/` are the design
 * sandbox, and `src/*.css` is where colours and fonts are *defined*.
 *
 * Regex over source rather than an AST pass: the same violation shows up in
 * .tsx and .css here, and oxlint parses only one of those.
 */
import { readFileSync, globSync } from 'node:fs'

const TARGETS = ['src/components/**/*.{tsx,ts}']

const RULES = [
  {
    name: 'raw-hex',
    re: /#[0-9a-fA-F]{3,8}\b/,
    msg: 'Raw hex colour — use a design-system colour token.',
  },
  {
    name: 'non-ds-font',
    re: /font-family\s*:\s*(?!['"]?(?:Noto Sans|M PLUS Rounded 1c|var\(|inherit))/i,
    msg: 'Font not in the design system. Available: Noto Sans, M PLUS Rounded 1c.',
  },
]

const files = TARGETS.flatMap((p) => globSync(p))
let violations = 0

for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      const hit = rule.re.exec(line)
      if (hit === null) continue
      violations += 1
      console.error(`${file}:${i + 1}  ${rule.name}  ${hit[0].trim()}\n    ${rule.msg}`)
    }
  })
}

if (violations > 0) {
  console.error(`\nadherence check: ${violations} violation(s)`)
  process.exit(1)
}
console.log(`adherence check: clean (${files.length} files)`)
