#!/bin/sh
#
# verify-plan — re-check the migration plan's own acceptance criteria.
#
# `docs/color-palette-and-app-flow-plan.md` records completion in a note under
# each phase heading. Those notes are written by a human reading a diff, and on
# 2026-08-20 one of them was wrong: Phase 5 said "5.6 the accent variant is
# gone" while three call sites were still rendering as bare text. It had said so
# for five days.
#
# This checks the criteria instead of the notes. It is deliberately shallow --
# greps and file tests, no browser -- because its job is to catch a claim that
# drifted from the tree, not to replace the render gates that sit next to it
# (check-contrast, check-touch-targets, shots-responsive).
#
#   sh scripts/verify-plan.sh
#
# A failure means one of two things, and they need telling apart: the tree
# regressed, or the criterion was never checkable as written. Task 1.8's was
# not -- it banned a string that its own row quotes.
pass=0; fail=0
ck() { # ck "<phase.task>" "<claim>" <shell test>
  if eval "$3" >/dev/null 2>&1; then printf "  ok    %-8s %s\n" "$1" "$2"; pass=$((pass+1))
  else printf "  FAIL  %-8s %s\n" "$1" "$2"; fail=$((fail+1)); fi
}

echo "PHASE 0 — toolchain and brief"
ck 0.2 "PRODUCT.md + DESIGN.md exist"            '[ -f PRODUCT.md ] && [ -f DESIGN.md ]'
ck 0.5 "frontend-design vendored"                '[ -d .claude/skills/frontend-design ]'
ck 0.6 "impeccable baseline committed"           'git ls-files --error-unmatch .impeccable/baseline.json'
ck 0.8 "maru boundary rule in DESIGN.md"         'grep -qi "maru" DESIGN.md'
ck 0.9 ".oxlintrc.json present"                  '[ -f .oxlintrc.json ]'
ck 0.9 "lint = oxlint + adherence + contrast"    'grep -q "oxlint" package.json && grep -q "check:adherence" package.json && grep -q "check:contrast" package.json'

echo "PHASE 1 — one token source"
ck 1.1 "build-tokens.mjs exists"                 '[ -f scripts/build-tokens.mjs ]'
ck 1.2 "build regenerates the sheet"             'grep -q "build:tokens" package.json'
ck 1.3 "colors_and_type imports the sheet"       'grep -q "dist/tokens.plain.css" colors_and_type.css'
ck 1.3 "colors_and_type declares no colour"      '! grep -qiE "^\s*--[a-z-]*(color|bg|fg|brand|accent)[a-z-]*:\s*#" colors_and_type.css'
ck 1.4 "5 harnesses have generated @theme"       '[ $(grep -rl "build-tokens:start" storybook/index.html ui_kits/*/index.html ui_kits/desktop-explore.html 2>/dev/null | wc -l) -ge 5 ]'
ck 1.6 "stories.jsx reads tokens live"           'grep -q "getComputedStyle" storybook/stories.jsx'
ck 1.7 "no stray hex in preview/ spec pages"      '[ $(grep -rioE "#[0-9a-f]{6}" preview --exclude-dir=_sandbox 2>/dev/null | grep -viE "01-logo|03-color" | wc -l) -eq 0 ]'
# The needle is assembled rather than written, so this file does not contain the
# string it searches for. Writing it whole is how the check started matching
# itself -- the same self-reference that made task 1.8's own criterion
# unsatisfiable. Do not "tidy" the concatenation away.
V2PURPLE="aa3b""ff"
ck 1.8 "v2 purple gone outside the plan's record" '[ $(grep -rilo "$V2PURPLE" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v "color-palette-and-app-flow-plan" | wc -l) -eq 0 ]'

echo "PHASE 2 — semantic token contract"
ck 2.2 "FillInput free of legacy tokens"         '! grep -qE "(ring|bg|text|border)-(brand-[0-9]+|rose|dusk)" src/components/FillInput.tsx'
ck 2.4 "contrast gate wired into build"          'grep -q "check:contrast" package.json'
ck 2.4 "contrast gate exits nonzero on fail"     'grep -q "process.exit" scripts/check-contrast.mjs'
ck 2.4b "card animation tokens survive"          'grep -q "animate-card-enter" src/tokens.css && grep -q "@keyframes card-enter" src/tokens.css'
ck 2.5 "prefers-reduced-motion honoured"         'grep -q "prefers-reduced-motion" src/tokens.css'
ck 2.6 "no legacy value tokens in components"    '! grep -rqE "(ring|bg|text|border)-(brand-[0-9]+|rose|dusk|plum|ink|paper|cream)\b" src/components/'

echo "PHASE 3 — component pass + gate"
ck 3.g "touch-target gate exists and runs"       '[ -f scripts/check-touch-targets.mjs ] && grep -q "check-touch-targets" package.json'
ck 3.g "responsive sweep exists"                 '[ -f scripts/shots-responsive.mjs ]'
ck 3.g "adherence gate fails the build"          'grep -q "process.exit" scripts/check-adherence.mjs'

echo "PHASE 3B / 4 — scenario card and flows"
ck 3B  "emboss-bg has a consumer"                'grep -rq "emboss-bg" ui_kits/flows/'
ck 4   "4 flows built on real components"        '[ $(grep -lc "src/components" ui_kits/flows/*.tsx | wc -l) -ge 4 ]'
ck 4   "flows bundle committed"                  'git ls-files --error-unmatch ui_kits/flows/bundle.js'

echo "PHASE 5 — the v3 merge"
ck 5.2 "hanko rasters present"                   '[ -f assets/logo-a-128.png ] && [ -f assets/logo-a-tile.png ]'
ck 5.2 "pattern-sakura never landed"             '! [ -f assets/pattern-sakura.png ]'
ck 5.3 "brand.css keeps all six utility groups"  'for u in hanko maru wm kata-vert ctype frame; do grep -q "\.$u" src/brand.css || exit 1; done'
ck 5.5 "no legacy tokens anywhere in src/"       '! grep -rqE "(ring|bg|text|border)-brand-[0-9]+" src/'
ck 5.5b "four inverse roles implemented"         'for r in color-inverse color-fg-inverse color-rule-on-inverse color-fg-on-inverse-2; do grep -q -- "--$r" src/tokens.css || exit 1; done'
ck 5.6 "Button accent variant gone"              '[ $(grep -rhoE "<Button[^>]*variant=.accent." src ui_kits storybook 2>/dev/null | wc -l) -eq 0 ]'
ck 5.11 "docs/colors.md is the authority"        '[ -f docs/colors.md ]'
# Delegates to the real gate rather than restating it. Naming the banned file
# here would both duplicate the check and trip it -- check-forbidden-assets
# fails on any surviving reference to that filename, which is the point.
ck 5.x "the banned mark cannot return"           'node scripts/check-forbidden-assets.mjs'

echo
echo "$pass passed / $fail failed"
[ $fail -eq 0 ] || exit 1
