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
import { execFileSync } from 'node:child_process'

const TARGETS = ['src/components/**/*.{tsx,ts}']

/**
 * The hand-written mirrors, which typecheck cannot reach.
 *
 * Only one rule runs over these -- `unknown-variant` -- because they are
 * browser JSX with their own dialect and the colour rules would false-positive
 * all over them. See MIRROR_RULES.
 */
const MIRROR_TARGETS = [
  'ui_kits/**/*.jsx',
  'storybook/*.jsx',
]

/**
 * A prop value no component implements is the quietest bug in this repo.
 *
 * `Button` dropped its `accent` variant in plan task 5.6. The variant map then
 * returns `undefined` for `variant="accent"`, the class list comes out empty,
 * and the button renders as bare text -- transparent background, no border,
 * measured. Nothing errors. It shipped on FIVE landing screens across three
 * files and survived for five days after 5.6 was recorded as complete, because
 * every one of them was in an untyped mirror.
 *
 * The typechecked harnesses never had it, and `variant="accent"` in
 * `src/components` would fail `tsc`. This rule is the mirrors' substitute.
 * Widen VARIANTS when a component legitimately grows one.
 */
const VARIANTS = ['primary', 'secondary', 'ghost']

const MIRROR_RULES = [
  {
    name: 'unknown-variant',
    re: new RegExp(`<Button[^>]*variant="(?!(?:${VARIANTS.join('|')})")([a-z-]+)"`),
    msg: `Button has no such variant. It renders as bare text, silently. Available: ${VARIANTS.join(', ')}.`,
  },
]

/**
 * `dist/tokens.plain.css` is the one generated file that is committed — six
 * harnesses and all 27 preview pages link it directly and are served with no
 * build step, so a clone without it renders every page unstyled.
 *
 * It went missing on main in #31 and nobody noticed, because nothing looked.
 * `tsup --clean` wipes `dist/` mid-build, and a broad `git add` a moment later
 * stages the deletion alongside whatever the commit was actually about. The
 * question is not "is it on disk" — a build always puts it back — it is "is it
 * still in the index".
 */
function checkTokenSheetTracked() {
  const path = 'dist/tokens.plain.css'
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' })
  } catch {
    return 0 // published tarball, not a checkout — nothing to assert
  }
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', path], { stdio: 'ignore' })
    return 0
  } catch {
    console.error(
      `${path}  untracked-token-sheet\n` +
        '    The committed token sheet is missing from git. The preview pages and\n' +
        `    harnesses link it with no build step. Fix: pnpm build:tokens && git add ${path}`,
    )
    return 1
  }
}

const RULES = [
  {
    name: 'raw-hex',
    re: /#[0-9a-fA-F]{3,8}\b/,
    msg: 'Raw hex colour — use a design-system colour token.',
  },
  {
    // A focus ring without an offset sits on the control's edge. On a filled
    // control that is 2.25:1 (primary) or 1.03:1 (accent) — invisible. The
    // offset puts page colour between control and ring so it reads against
    // the page instead. Removing it silently breaks keyboard focus.
    name: 'focus-ring-without-offset',
    re: /ring-focus(?![-a-z])/,
    msg: 'Focus ring with no ring-offset — add `ring-offset-2 ring-offset-bg`.',
    unless: /ring-offset/,
  },
  {
    name: 'non-ds-font',
    re: /font-family\s*:\s*(?!['"]?(?:Noto Sans|M PLUS Rounded 1c|var\(|inherit))/i,
    msg: 'Font not in the design system. Available: Noto Sans, M PLUS Rounded 1c.',
  },
]

const files = TARGETS.flatMap((p) => globSync(p))
const mirrors = MIRROR_TARGETS.flatMap((p) => globSync(p))
let violations = checkTokenSheetTracked()

for (const [group, rules] of [[files, RULES], [mirrors, MIRROR_RULES]]) {
for (const file of group) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // Comments describe the rules; they are not violations of them.
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
    for (const rule of rules) {
      const hit = rule.re.exec(line)
      if (hit === null) continue
      if (rule.unless !== undefined && rule.unless.test(line)) continue
      violations += 1
      console.error(`${file}:${i + 1}  ${rule.name}  ${hit[0].trim()}\n    ${rule.msg}`)
    }
  })
}
}

if (violations > 0) {
  console.error(`\nadherence check: ${violations} violation(s)`)
  process.exit(1)
}
console.log(`adherence check: clean (${files.length} components, ${mirrors.length} mirrors)`)
