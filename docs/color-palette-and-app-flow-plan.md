# AburunGo — Palette Migration & Flow Plan (v2)

**Status:** Phases 0–2 and 5 complete, Phase 3 in progress · **Decisions here are provisional — see below** · **Scope:** `aburungo-design-system` only · **Palette:** v3 "Zuihoden", in hand and reviewed · **Branch prefix:** `feat/tokens-*`, `feat/flow-*`

> **Posture: this repo is the source of truth. The drop is an input, not an authority.**
>
> The v3 drop is a good palette with an incomplete implementation — eight roles with no owner, a documented change that was never made, a brand mark wired to a deprecated alias, a focus ring that fails WCAG on every light surface, and half the component library missing. Reviewed on its merits, the colour thinking is sound and the execution is a first pass.
>
> So the plan does not wait for a better drop. It takes the palette, closes the gaps here, and sends corrections back. Everything missing is either mechanical (apply a token) or ordinary design work the skills in this plan exist to do. Nothing on the gap list requires going back to the source.

---

## Decisions in this plan are provisional

**Added 2026-08-08 by the palette author.** Everything decided here — including
answers given in review, and including answers that contradict each other — is a
**guideline, not a hard rule.**

The reason is structural, not indecision. Design calls are being made on
components rendered in isolation: a button on a blank page, a card with no screen
around it, a keyboard with nothing above it. Nobody has yet seen what the app
*looks like* or *behaves like* as a whole. A colour that reads well on a lone card
may be wrong once it sits under a header, beside a progress bar, three screens
into a session.

So:

- **Contradictory answers are expected and fine.** When two decisions conflict,
  raise the conflict, propose the resolution, and keep moving. Do not stall, and
  do not treat the earlier answer as binding over the later one.
- **Nothing here is frozen until it has been seen in context.** A decision made
  against an isolated component is a working assumption with a date on it.
- **Prefer designs that keep the choice open.** `PhraseCard`'s accent became a
  prop rather than a fixed colour for exactly this reason — it defers the call to
  the point where there is enough on screen to make it well.
- **The job is to get to a screen.** Anything that shortens the path to a whole
  flow, rendered and clickable, is worth more than another round of polish on a
  component in a vacuum.

Revisit every colour and density decision once Phase 4's flow mockups exist and a
real session can be walked end to end.

## Why v1 was rewritten

v1 was a list of adjectives, not a plan. Every task was unfalsifiable ("stronger hierarchy", "better spacing", "more deliberate screen rhythm") — there was no way to tell whether a task was done. Four things to fix:

1. **It treated the palette as the work.** The palette is the easy part — it's a set of hex values arriving from elsewhere. The hard part is that the repo has **six independent copies of the tokens**, so *any* palette change is a seven-file hand-edit plus a sweep of 27 preview pages. v1 planned the swap and ignored the plumbing that makes the swap expensive.
2. **It put app-shell, onboarding, and navigation work in a repo that forbids it.** `CLAUDE.md`: no routing, no Supabase, no Zustand. And `../aburungo` already has 11 pages.
3. **It never opened `docs/design-direction.md`** — the actual brief, sitting in the same folder. Which is how it arrived at `VISUAL_DENSITY: 8` ("dense dashboards") for a product whose brief says *Muji notebook, calm, minimal, whitespace used so accent moments feel intentional*.

4. **It named four skills but configured none of them.** Each ships defaults that actively fight this brand — palette generators, style pickers, GSAP dependencies, density presets. Cited-but-unconfigured, they make the product worse. The skills section below assigns each one a job and names what to switch off.

---

## Ground truth

### ~~Six token sources, no single source of truth~~ — SOLVED, verified 2026-08-11

**This was the plan's opening problem and its highest-value work. It is done.**
Kept here rather than deleted because it is why `scripts/build-tokens.mjs`
exists, and deleting the reason is how a solved problem comes back.

| # | File | Then | Now |
|---|---|---|---|
| 1 | `src/tokens.css` | `@theme` — the source | unchanged, still the only place a value is written |
| 2 | `colors_and_type.css` | `:root`, 31 hand-copied declarations | **imports the generated sheet**; declares no colour at all, and says so at the top |
| 3 | `storybook/index.html` | inline `@theme`, 26 declarations | **generated** between `build-tokens:start/end` |
| 4 | `storybook/stories.jsx:301` | hardcoded hex array, 7 values | **reads tokens live** via `getComputedStyle` + `var(--color-…)` — no values in the file |
| 5 | `ui_kits/mobile/index.html` | inline `@theme`, 43 declarations | **generated** |
| 6 | `ui_kits/app/index.html` | inline `@theme`, 26 declarations | **generated** |
| 7 | `ui_kits/desktop-explore.html` | inline `@theme`, 26 declarations | **generated** |
| 8 | `ui_kits/flows/index.html` | did not exist | **generated** — a sixth consumer, wired from birth |

All five harnesses carry the markers; `pnpm build` regenerates them after
`tsup`. Confirmed in practice this week: deleting `--color-border-focus` from
`src/tokens.css` removed it from `dist/tokens.plain.css` and all five harness
blocks with no other edit. **A palette change is now a one-file diff**, which is
exactly what this section asked for.

The original complaint, for the record: three palettes in a row had been
propagated by hand into six places, which is why every human-facing surface had
drifted a full palette behind the package.

**What this does not cover** — the two drift machines that remain, both real:
the hand-written JSX component mirrors in `ui_kits/mobile/components.jsx`, and
the consuming app, which imports the token sheet but composes its own screens
(see `docs/todo.md` items 4 and 4a).

Two swatch pages (`preview/03-color-brand.html`, `preview/06-color-semantic-fg.html`) print hex values as literal page text rather than reading them from a variable. Whatever palette lands, they'll strand again unless that's fixed once.

### The palette arrived — it's v3 "Zuihoden", and it's a full DS drop

Located at `~/Downloads/AburunGo project setup Zuihoden/_ds/aburungo-design-system-1e624d61-…`. Reviewed in full. It is **not** a set of hex values — it's a parallel snapshot of this whole repo, repainted.

**Five colors, one job each.** Akane 茜色 `#D72E2E` (brand mark + errors, never a CTA) · Ai-iro 藍色 `#1F3A66` (structure, primary action, headings, JP) · Rokushō 緑青 `#4F9C8D` (progress, correctness, secondary, links) · Ōgon 黄金 `#C9A045` (focus rings, scenario tags, dark hairlines) · Sumi-iro 墨色 `#2D2D2D` (inverse chrome). All on a warm stone ramp — ground `#F7F6F1`, cards `#FFFDF8`. The warm neutrals are load-bearing and deliberately not `#fff`.

**The drop is ahead of us on tokens and assets, and behind us on components.**

| | Drop | This repo |
|---|---|---|
| Tokens | v3 Zuihoden, fully role-based | v2 plum |
| Components | **9** | **20** |
| `brand.css` | `.hanko` + `.emboss-bg` only (151 lines) | + `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame` (343 lines) |
| Card animations | **absent** | `--animate-card-enter` / `-exit` + keyframes |
| Mark assets | `logo-a-tile.png`, `logo-a-128.png` — **plus `clan-symbol1.png` / `clan-symbol2.png`, which replaced `pattern-sakura.png` (never copied, see 0.7)** | none |
| Adherence lint | `_adherence.oxlintrc.json` | none |

### Following INTEGRATION.md verbatim would cause three regressions

Its instructions assume a repo that has only the 9 components it ships. This repo has 20, and is ahead in two places.

1. **`cp src/brand.css` deletes 192 lines** — the entire `.maru` / `.wm` / `.kata-vert` / `.ctype` / `.frame` / `.hanko.ink` system, including the maru that §3.0 depends on. **Merge, don't copy.**
2. **Replacing `src/index.css` drops the card animations.** v3 defines no `--animate-card-*` and no keyframes; `FlipCard.tsx:16–17` uses `animate-card-enter` / `animate-card-exit`. Tailwind won't error — the classes silently stop generating and the flip animation dies. **Port the animation block forward.**
3. **`cp -r src/components/*` repaints only 9 of 20.** The other eleven — `AppHeader`, `EmptyState`, `ErrorState`, `FillInput`, `FlipCard`, `KanaKeyboard`, `LoadingPlaceholder`, `ScoreCard`, `VoiceInput`, `Maru`, `AnswerResult` — don't exist in the drop and never get touched.

### The good news: almost nothing in those nine actually breaks

Verified — every distinct token suffix the 21 components reference resolves under v3, all 13 type tokens exist, radii and shadows exist. Nothing errors, because v3 aliases every legacy name. (`Maru` and `AnswerResult` were re-checked separately on 2026-08-07 and introduce no new suffix: all ten they use — `success-500`, `error-500`, `success-bg`, `error-bg`, `success-fg`, `error-fg`, `surface-2`, `heading-sm`, `body-sm`, `jp` — resolve.)

**Exactly one real defect:** `FillInput` uses `ring-brand-500`, and under v3 `brand-500` resolves to **Akane red** — a red focus ring, indistinguishable from an error state. `HANDOFF.md` §4 flags this precise trap and fixes it in the four components it ships; `FillInput` isn't one of them. The other eight repo-only components are already role-based and repaint correctly for free.

Two aliases changed meaning and are worth knowing: **`rose` now points at Ōgon gold** (was pink `#e6bbd7`) and **`dusk` at Ishi-iro grey**.

### One structural defect (survives the palette swap)

**No `prefers-reduced-motion` guard anywhere.** `--animate-card-enter` / `--animate-card-exit` (`src/tokens.css:144–157`) fire unconditionally; `src/index.css` has no guard either. This is not a palette issue — it stays broken through any number of palette changes. All four skills require it.

### Contrast is a gate, not an audit

Don't spend time scoring the outgoing palette. What matters is that **the incoming palette gets scored before it ships**, and that the check is a repeatable command rather than a one-off.

Build `scripts/check-contrast.mjs` in Phase 2 (WCAG 2.1 relative luminance, ~20 lines, no dependencies). It reads the role tokens out of `src/tokens.css` and asserts:

- text roles (`fg`, `fg-muted`, `fg-subtle`, `fg-faint`) ≥ 4.5:1 on `bg` and on `surface`
- `fg-inverse` ≥ 4.5:1 on `brand-500` — primary buttons live or die here
- `success-fg` on `success-bg`, `error-fg` on `error-bg` ≥ 4.5:1
- focus ring ≥ 3:1 against every surface it can land on

Wire it into `pnpm build`. A palette that fails the gate does not land.

### v3 fails seven of those checks — one seriously

Ran the gate's logic against the Zuihoden values ahead of building the script. Results, worst first:

| Check | Ratio | Needs | |
|---|---|---|---|
| **Ōgon focus ring `#C9A045` vs page ground `#F7F6F1`** | **2.26:1** | 3:1 | **FAIL** |
| **Ōgon focus ring vs card `#FFFDF8`** | **2.40:1** | 3:1 | **FAIL** |
| **Ōgon focus ring vs well `#EFEDE5`** | **2.08:1** | 3:1 | **FAIL** |
| `fg-faint` `#A4A4A4` vs card | 2.45:1 | 4.5:1 | FAIL |
| `progress-fill` `#4F9C8D` vs track `#EFEDE5` | 2.77:1 | 3:1 | FAIL |
| `fg-subtle` `#78736B` vs `surface-2` | 4.01:1 | 4.5:1 | FAIL |
| `tag-fg` on `tag-bg` | 4.27:1 | 4.5:1 | FAIL |

Everything else passes, several comfortably — `fg` 13.55:1, `fg-heading` 11.13:1, white on Ai-iro 11.13:1, white on Akane 4.78:1, error and success banners both clear.

**The focus ring is the serious one.** v3 routes *every* interactive element's focus ring to Ōgon, and gold on warm paper is a low-contrast pairing by construction. It passes only against the Sumi-iro chrome (5.64:1). WCAG 2.1 SC 1.4.11 wants 3:1 for non-text UI indicators, so as it stands keyboard focus is under-visible across the entire light UI — which is most of the product.

**The fix is already in the palette — no re-spec, no going back to the source.** Tested every step of the Ōgon ramp against all four grounds:

| Candidate | card | page | well | chrome |
|---|---|---|---|---|
| `ogon-500` `#C9A045` *(current)* | 2.40 ✗ | 2.26 ✗ | 2.08 ✗ | 5.64 ✓ |
| `ogon-600` `#ab8639` | 3.33 ✓ | 3.13 ✓ | 2.89 ✗ | 4.07 ✓ |
| **`ogon-700` `#8a6a2b`** | **4.95 ✓** | **4.65 ✓** | **4.29 ✓** | 2.74 ✗ |

No single step clears all four, because the requirement is contradictory — a gold that reads on warm paper cannot also read on near-black. So **split the role in two**, exactly as v3 already does for borders (`border` / `rule-on-inverse`):

- `--color-focus` → `ogon-700` `#8a6a2b` — light surfaces
- `--color-focus-on-inverse` → `ogon-500` `#C9A045` — Sumi-iro chrome

Still Ōgon, still one brand colour, still gold leaf. `#8a6a2b` is *already* in the system as `--color-rule-on-inverse`, so this adds no new value. Ship it as ours and send it back as a correction rather than waiting on one.

`progress-fill` vs its track (2.77:1) is the same shape of problem, solvable the same way — most likely by darkening the track, since the fill is a locked brand value.

For `fg-faint`, note this is now the *second* palette in a row whose faint-text role fails — v2's was 3.60:1, v3's is 2.45:1. Send the thresholds with the brief next time.

### Inventory to work against

**21 components** (24 exports — `Card` also ships `CardHeader` / `CardBody` / `CardFooter`): 5 primitives (`Button`, `TextInput`, `Card`, `Badge`, `IconButton`) + 16 domain (`PhraseCard`, `KanaGrid`, `KanaKeyboard`, `FlipCard`, `FillInput`, `VoiceInput`, `AudioButton`, `ProgressBar`, `ScoreCard`, `AppHeader`, `EmptyState`, `ErrorState`, `LoadingPlaceholder`, `Maru`, `AnswerResult`, **`GradePair`**). Counted 2026-08-11; `src/components/icons.tsx` is a shared helper, not a component, and is excluded. Every one has a JSX mirror in `ui_kits/mobile/components.jsx` that must be kept in sync by hand — the second drift machine after the tokens.

---

## The four skills — what each one is actually for here

Each ships defaults that conflict with this brand. The conflicts are called out because **unconfigured, all four make the product worse** — three of them will happily generate a palette, a font pairing, or a UI style over the top of ones that are already decided.

### 1. `impeccable` (pbakaus) → **the detector**

The only one of the four that produces a deterministic, machine-checkable artifact: a standalone detector CLI, 59 rules, no AI harness or API key required, JSON output.

> **Amended 2026-08-10.** This section originally called it "the CI gate" and said the JSON "belongs in CI, not in a conversation." It never went to CI, and on the evidence it shouldn't — its findings land almost entirely in `preview/` and `ui_kits/`, which are the sandbox, and its baseline is not portable across machines. See Deliverable 4 for the four reasons. It earns its place as a **detector you run and read**, plus a local edit-time hook. Everything below still holds; only the word "gate" was wrong.

- **Use:** `npx impeccable install` → `/impeccable init` generates `PRODUCT.md` + `DESIGN.md`. Seed both from `docs/design-direction.md` — don't let it interview from scratch, the brief already exists and is better than anything an interview produces.
- **Commands in rotation:** `critique` (per component), `audit` (a11y/perf), `harden` (edge cases), `adapt` (responsive), `polish`.
- **⚠️ Conflict:** its anti-pattern list bans purple gradients and gray-text-on-colored-backgrounds. AburunGo is a single-accent monochrome system and has been purple through two palettes running. `DESIGN.md` must record one-accent-by-design as intentional or the detector false-positives on every primary button — and it must say that in terms of the *role*, not a hex, so the new palette doesn't reopen it.

### 2. `frontend-design` (anthropic) → **the per-surface build loop**

Four steps: brainstorm → review against defaults → build → self-critique.

- **Use:** the loop itself, run per surface. Its sharpest question — *what is the signature element?* — is already answered for this project: **the maru, scoped to correctness** (§3.0). Don't re-open it per surface; feed the answer in as a constraint.
- **Also mandatory:** its self-critique gate — responsive, keyboard focus, reduced-motion.
- **⚠️ Switch off:** its step-1 instruction to brainstorm a 4–6 color palette and pick display/body typefaces. The palette is arriving from elsewhere and the type is locked (Noto Sans / M PLUS Rounded 1c). Running that step produces a competing palette nobody asked for.

### 3. `taste-skill` (leonxlnx) → **per-surface dials**

- **Use:** `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`, recorded **per surface** (table below), not globally. v1's global `VISUAL_DENSITY: 8` contradicted the brief outright and omitted `MOTION_INTENSITY` entirely despite spending a whole phase on motion.
- **⚠️ Switch off:** its canonical code skeletons are GSAP. ADS ships zero runtime dependencies and animates with CSS keyframes (`--animate-card-enter`). Take the dials and the pre-flight checks; reject the skeletons.

### 4. `ui-ux-pro-max` (nextlevelbuilder) → **checklist only, generators disabled**

90% of this skill must be switched off for this project.

- **⚠️ Switch off:** 192 color palettes, 84 UI styles (glassmorphism, claymorphism, bento grids, neumorphism), 74 font pairings. All three are locked here. Left on, this skill imports exactly the slop `docs/design-direction.md` forbids.
- **Use:** the 98 UX guidelines, the industry anti-pattern rules, and the pre-delivery checklist — contrast ≥ 4.5:1, visible keyboard focus, `prefers-reduced-motion`, breakpoints 375 / 768 / 1024 / 1440, no emoji icons (already an ADS rule).
- **⚠️ Conflict:** it prescribes `cursor-pointer` and 150–300ms hover transitions. ADS is touch-first with an explicit *no hover-only affordances* rule. Hover guidance is advisory; `active:` states and ≥44px targets are the requirement.

---

## Skill application map — where and when

Three properties decide when each skill fires. Getting these wrong is how skills produce noise instead of improvement.

| Skill | Altitude | Cadence | Direction |
|---|---|---|---|
| `taste-skill` | surface | once per surface, **before** design starts | constraint — feeds the generative step |
| `frontend-design` | surface | once per surface | **generative** — trial and error lives here |
| `impeccable` | component + repo | `shape`/`critique` per component; `detect` read by hand, not on every build | both — `shape` generates, `detect` **reports** (it does not gate — see Deliverable 4) |
| `ui-ux-pro-max` | component | once per component, at the end | gate |

Two generate, two constrain-or-check. Running them in the wrong order is the main failure mode: generate first and the dials become an argument with work that already exists.

### The four-beat loop

The pattern for every surface. Beats 1–2 are cheap and disposable; beat 4 is where it locks.

1. **Constrain** — `taste-skill`. Set the three dials for this surface from the table below. Dials go first because they narrow what beat 2 produces. Skip this and you get dashboard-density flashcards.
2. **Explore** — `frontend-design` loop + `/impeccable shape`. Generate 2–3 variants. **This is the trial-and-error beat**, and it runs in the sandbox, never in `src/components/`.
3. **Build** — the chosen variant only. TSX → JSX mirror → story.
4. **Gate** — `ui-ux-pro-max` pre-delivery checklist + `pnpm lint`. Pass/fail, no discussion. `impeccable detect` runs alongside as a report you read, not a pass/fail — see Deliverable 4.

### Where trial and error goes

`preview/` and `ui_kits/` are already static HTML harnesses served over `http.server`. That's the sandbox — no build step, no typecheck, no JSX mirror to sync.

Generate variants as throwaway `preview/_sandbox/*.html`, view them side by side, pick one, *then* write TSX.

> **Rule: no skill output goes straight into `src/components/`.** The package only ever receives a variant a human already chose.

This is what makes trial and error cheap. A bad `/impeccable craft` result costs one HTML file, not a component rewrite plus JSX mirror plus story plus rebuild. Decide whether `preview/_sandbox/` is gitignored or kept as a design record — keeping the winners is useful provenance.

### When: split the work by whether it depends on color

Roughly 70% of the component work does not touch color and should not wait for the palette.

**Do now — palette-independent:**
- structure, spacing, density (`VISUAL_DENSITY`)
- motion and reduced-motion (`MOTION_INTENSITY`)
- the five states: loading, empty, error, success, in-progress
- touch targets, focus order, keyboard navigation
- type hierarchy, JP/EN pairing, furigana vertical rhythm

**Queue for after Phase 5 — palette-dependent:**
- accent placement — where the single accent is allowed to land
- the contrast pass
- correct/incorrect feedback semantics
- impeccable's color rules (gray-on-color, gradient detection)

### Point each skill at a low-risk target first

Learn what a skill's output looks like on something cheap before spending it on a core surface.

| Skill | Start with | Why there |
|---|---|---|
| `frontend-design` | `EmptyState`, `ErrorState` | the brief says charm belongs here; VARIANCE 4 gives the most room; 3 small components, ~19 lines each — lowest blast radius |
| `taste-skill` | `ScoreCard`, `ProgressBar` | the only surface at DENSITY 6, so the dials do visible work — and the surface most at risk of drifting gamified |
| `impeccable` | `Button`, `TextInput`, `Card` | primitives that 13 components depend on; detector rules pay off most on high-reuse code |
| `ui-ux-pro-max` | `KanaKeyboard`, `FillInput` | densest interaction surfaces (137 and 203 lines), most touch targets — where an a11y checklist earns its keep |

### What to expect, so you can judge output fast

Calibration for the trial-and-error phase — knowing the expected hit rate stops you from over-reading a weak result.

- **`frontend-design`** — high value, low volume. Expect roughly one good structural idea per surface. If it proposes a palette, step 1 was left switched on.
- **`taste-skill`** — narrow by design. Three numbers moving spacing and motion. Its value is *consistency across* surfaces, not brilliance on any one.
- **`impeccable detect`** — highest signal-to-noise of the four, because it's deterministic. `craft` and `shape` output is far more variable; treat it as a first draft, not a recommendation.
- **`ui-ux-pro-max`** — will mostly confirm what `CLAUDE.md` already says. Its job is catching the one thing you forgot, not proposing direction. Expect a low hit rate and don't read that as the skill failing.

---

## Per-surface taste dials

Density low by default per the Muji brief; raised only where real data density exists. Variance stays low everywhere except the two surfaces where `docs/design-direction.md` says charm belongs (empty states, progress language).

| Surface | Components | DENSITY | VARIANCE | MOTION |
|---|---|---|---|---|
| Flashcard review | `FlipCard`, `PhraseCard` | 3 | 2 | 3 |
| Kana practice | `KanaGrid`, `KanaKeyboard` | 4 | 2 | 3 |
| Pronunciation | `VoiceInput`, `AudioButton` | 3 | 2 | 3 |
| Cloze / fill | `FillInput` | 3 | 2 | 2 |
| Progress summary | `ProgressBar`, `ScoreCard` | 6 | 3 | 2 |
| App shell | `AppHeader` | 3 | 2 | 1 |
| Empty / error / loading | `EmptyState`, `ErrorState`, `LoadingPlaceholder` | 2 | 4 | 2 |

`MOTION_INTENSITY` never exceeds 3 anywhere: the brief calls for motion that reinforces the next step, and every value above 3 in taste-skill implies scroll-driven or magnetic interaction, which a touch-first study app does not have.

---

## Phase 0 — Toolchain and brief

**Branch:** `build/design-toolchain`

| # | Task | Done when |
|---|---|---|
| 0.1 | `npx impeccable install` | `npx impeccable --help` runs |
| 0.2 | `/impeccable init`, seeded from `docs/design-direction.md` | `PRODUCT.md` + `DESIGN.md` at repo root, recording: one accent, no gamification, touch-first, Noto Sans + M PLUS Rounded 1c |
| 0.3 | `npx skills add https://github.com/Leonxlnx/taste-skill` | dials table above copied into `DESIGN.md` |
| 0.4 | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`, then install | `DESIGN.md` records generators-disabled |
| 0.5 | Vendor `frontend-design` into `.claude/skills/` | skill loads |
| 0.6 | Baseline detector run over `src/ preview/ storybook/ ui_kits/`, JSON to `.impeccable/baseline.json` | **done.** Baseline committed 2026-08-08. **N = 134** — 84 advisory, 50 warning, no errors. By rule: 44 `design-system-font-size`, 30 `design-system-color`, 22 `all-caps-body`, 12 `flat-type-hierarchy`, 9 `design-system-radius`, 9 `tiny-text`, 4 `cream-palette`, 2 `broken-image`, 1 `design-system-font`, 1 `codex-grid-background`. **By file type: 88 HTML, 37 JSX, 9 CSS — and zero `.tsx`.** The detector found nothing in `src/components/`, which is what makes this a record rather than a gate; see Deliverable 4 |
| 0.7 | ~~Source or redraw `assets/logo-a-tile.png`~~ — **closed by the v3 drop.** Copy `logo-a-tile.png`, `logo-a-128.png` from the drop's `assets/`. They're hue-remapped rasters, good enough to ship; have the mark redrawn as vector in Akane before any large or print use. **`pattern-sakura.png` was never copied and is not needed** (see the exclusions section) — `.emboss-bg` ships the two clan crests instead, and its blend presets, which existed only to suit that white tile, were deleted 2026-08-10 | `.hanko` renders the ア at 24 / 48 / 96px |
| 0.8 | Write the maru boundary rule (§3.0) into `DESIGN.md` | rule present verbatim; impeccable won't flag ○/✕ as ornament |
| 0.9 | ~~Adopt the drop's `_adherence.oxlintrc.json`~~ — **done, under a different name.** It landed as `.oxlintrc.json`, keeping the rule that matters: `no-restricted-imports`, which forces barrel imports and stops consumers reaching past the public API. Raw hex and non-DS fonts are enforced by `scripts/check-adherence.mjs` instead, which catches more than the oxlint selectors could — those only match string literals in JS/TS. The drop's `x-omelette` block (a frozen ~300-token snapshot for its own generator) was correctly dropped: `build-tokens.mjs` derives tokens from `src/tokens.css` live, so a hardcoded list would go stale on the next palette move. **The raw-px rule was deliberately skipped** (2026-08-10) — in a Tailwind codebase raw px shows up as arbitrary values like `min-h-[44px]`, which is the touch-target rule, not a violation | done — `pnpm lint` runs `oxlint` + adherence + contrast |

`DESIGN.md` is written against the brand *rules*, not against specific hex values — it has to survive the palette swap without edits.

---

## Phase 1 — Collapse six token sources into one ✅ **COMPLETE**

**Branch:** `feat/tokens-single-source` · **This is the phase that makes the inbound palette a one-file diff.**

> **Done, verified 2026-08-11.** `scripts/build-tokens.mjs` emits
> `dist/tokens.plain.css` and regenerates the `@theme` block in all five
> harnesses between `build-tokens:start/end` markers. See the Ground truth
> section above for the before/after on all eight consumers. The task rows
> below are kept as the record of what was built.

| # | Task | Done when |
|---|---|---|
| 1.1 | Write `scripts/build-tokens.mjs`: read `src/tokens.css`, extract the `@theme` body, emit `dist/tokens.plain.css` as `:root { … }` — including un-prefixed aliases (`--brand-500` → `var(--color-brand-500)`) so the 27 preview pages keep working unmodified | script < 40 lines, no dependencies; `node scripts/build-tokens.mjs` produces the file |
| 1.2 | Wire it into `pnpm build` (prepend to the `tsup` script) | `pnpm build` regenerates `dist/tokens.plain.css` |
| 1.3 | Delete the `:root` token block from `colors_and_type.css`; replace with `@import url("./dist/tokens.plain.css")`. Keep the `@font-face` rules | all 27 `preview/*.html` render plum under `python3 -m http.server`; `grep -c aa3bff colors_and_type.css` → 0 |
| 1.4 | Replace the inline `@theme` block in `storybook/index.html` with `@import "/src/tokens.css";` inside the existing `<style type="text/tailwindcss">` | storybook renders plum. **Verify under `http.server` — `file://` will not resolve the import** (see MEMORY.md). Fallback if the browser build won't follow the import: link `dist/tokens.plain.css` instead |
| 1.5 | Same for `ui_kits/mobile/index.html`, `ui_kits/app/index.html`, `ui_kits/desktop-explore.html` | all three render plum |
| 1.6 | `storybook/stories.jsx:301` — replace the hardcoded hex array with values read from computed styles | swatch story shows plum without hardcoded hex |
| 1.7 | **Repo-wide hex sweep of `preview/`, not just the two swatch pages.** The swatch pages (`03-color-brand`, `06-color-semantic-fg`) print hex as literal text; four more hardcode colour values that no token change reaches — `16-buttons-accent.html` (`color:#fff` on the CTA), `13-elevation.html` (`background:#fff`), `24-progress.html` (`var(--surface-2,#f4f4f5)` — a *cool-grey* fallback), `11-spacing-scale.html`. **These are the dangerous ones:** v3's card ground is `#FFFDF8` and its wells are warm stone, so every `#fff` and `#f4f4f5` goes visibly wrong the moment the warm palette lands, while the page still looks fine today | `grep -riE "#[0-9a-f]{3,6}" preview/` returns only the swatch pages' `<code>` samples, and those read from computed styles |
| 1.8 | Strip hex values out of prose (`README.md`, `SKILL.md`, `CLAUDE.md`, `colors_and_type.css` header) — refer to roles, and point at `docs/colors.md` for values | no hex literal appears in any `.md`; `grep -rn "aa3bff"` → 0 |

**Phase 1 acceptance:** one command (`pnpm build`) propagates a token change to the package, the storybook, all three UI kits, and all 27 preview pages. Verified by changing `--color-brand-500` to `#ff0000`, rebuilding, confirming every surface goes red, then reverting.

That test *is* the Phase 5 dry run.

---

## Phase 2 — Freeze the semantic token contract

**Branch:** `feat/tokens-semantic-contract` · Runs before the new palette lands, so the swap can't break 27 pages.

**This phase shrank.** v3 is already fully role-based — `action`, `action-press`, `action-2-*`, `focus`, `tag-bg`/`tag-fg`, `progress-track`/`fill`/`complete`, `link`, `rule-on-inverse`, `fg-heading`. The design work Phase 2 was going to do has been done for us. What remains is adopting those names and closing the gaps they don't cover.

| # | Task | Done when |
|---|---|---|
| 2.1 | Adopt v3's role vocabulary as the contract. Audit which of the 21 components still reference a *value* token (`brand-500`, `rose`, `dusk`) rather than a role | role-vs-value table in `docs/colors.md`; known offender list starts at `FillInput` |
| 2.2 | Convert value references to roles — **only in the nine components the drop does not ship.** In practice that is `FillInput` alone: `ring-brand-500` → `ring-focus`, which under v3 is currently Akane red and reads as an error. **Leave `Button`, `TextInput`, `IconButton`, `KanaGrid`, `ProgressBar` alone** — the drop repaints those and 5.4 verifies them | `grep -rE "(ring\|bg\|text)-(brand-[0-9]+\|rose\|dusk)" src/components/FillInput.tsx` returns nothing |
| 2.3 | Fill the gaps v3 leaves: disabled state, and a documented press state for every interactive role | new role aliases present; no component uses a numbered scale token for a semantic purpose |
| 2.3b | Decide whether `--color-correct` / `--color-incorrect` stay distinct from `success-*` / `error-*`. v3 gives them the same hexes (Rokushō / Akane) but different stated intent — "progress, correctness" vs "correctness banners". Distinct role names cost nothing now and prevent a future error-styling change from silently restyling study grading | decision recorded in `docs/colors.md` with the rationale |
| 2.4 | Write `scripts/check-contrast.mjs` (gate spec above) and wire it into `pnpm build` | gate runs on every build and fails loudly; current palette's failures are recorded as the known-bad baseline the incoming palette must beat |
| 2.4b | Port the card animation block forward — `--animate-card-enter`, `--animate-card-exit` and both `@keyframes`. **v3 omits them and `FlipCard` depends on them** | `FlipCard` animates after the v3 tokens land |
| 2.5 | Add `@media (prefers-reduced-motion: reduce)` to `src/index.css` neutralising `--animate-card-enter` / `--animate-card-exit` | animations disabled under the OS setting; verified in the storybook |
| 2.6 | **Orphan-token audit** (see below) — for every role v3 defines, find its implementation or record that it has none | every v3 role is either used, assigned an owner component, or explicitly parked with a reason |

### Task 2.6 — the orphan-token audit, and why it's the gap in this plan

Copying the nine missing components forward is the easy half. The harder half is that **v3 defines and documents roles that nothing implements** — design intent that arrives as a token, gets cheat-sheeted in `INTEGRATION.md`, and is then silently never built. A component-by-component pass will not catch it, because the components in question look fine; they're just not doing what the palette says they should.

Audited across both the drop and this repo. Eight roles have **zero implementations in either**:

| Orphaned role | What v3 says it's for | Owner it should have |
|---|---|---|
| `bg-inverse` `#2D2D2D` | "header band, kana keyboard frame" | `AppHeader`, `KanaKeyboard` |
| `rule-on-inverse` `#8a6a2b` | the Ōgon hairline on Sumi-iro chrome | `AppHeader`, `KanaKeyboard` |
| `fg-on-inverse-2` `#A4A4A4` | secondary text on inverse surfaces | `AppHeader`, `KanaKeyboard` |
| `shadow-key-on-inverse` | key elevation on dark chrome | `KanaKeyboard` |
| ~~`progress-complete` `#C9A045`~~ | "a completed bar caps with Ōgon" | **deleted 2026-08-11** — `ProgressBar`'s anti-goal already forbids changing colour at 100% |
| `tag-bg` / `tag-fg` | scenario tags | `Badge` (emphasis variant) |
| `link` `#33685E` | links | **no component exists** |
| ~~`border-focus` `#5c7aa8`~~ | — off-palette blue, v2 leftover | **deleted 2026-08-10** — unused in both repos; v3's ring is `focus` |

Note the shape of it: **`AppHeader` and `KanaKeyboard` are two of the nine components the drop doesn't ship**, and four of the eight orphans exist specifically to style them. v3 designed the inverse-chrome treatment and had no component to apply it to. That intent survives only if someone goes looking for it.

**Three more findings the plan needs to carry:**

1. **`HANDOFF.md` §4 item 5 documents a change that wasn't made.** It states `Badge`'s emphasised neutral was repainted to `bg-tag-bg` / `text-tag-fg`. `Badge.tsx:23` still reads `neutral: 'bg-surface-2 text-fg-subtle'` — the scenario tag is still grey. Trust the code, not the table; the repaint is ours to do.
2. **`.hanko` depends on a deprecated alias.** v3's `brand.css` fills the mark with `var(--color-brand-500)`, not `var(--color-accent)`. It renders correctly today only because `brand-500` aliases to Akane — and `HANDOFF.md` explicitly calls legacy names "a migration bridge, not API". Retire the aliases and the brand mark breaks. Point it at `--color-accent`.
3. **`KanaKeyboard` gets the right pixel from the wrong role.** It uses `bg-fg`, which is `#2D2D2D` — the same value as `bg-inverse`. Correct today, wrong the moment body text and inverse chrome diverge.

**Design elements with no component at all:** `.emboss-bg` is a `brand.css` utility used only in demos — `INTEGRATION.md` shows `<div className="emboss-bg on-brand">` for scenario cards, but no component owns that pattern. Same for links. Both are Phase 3 decisions: build a component, or record that the utility is applied ad-hoc by the app and stays out of the library.

**Phase 2 acceptance:** the inbound palette can be dropped in by editing only the hex values in `src/tokens.css` — no role names change, no component changes, no preview edits — **and** every role v3 defines has either an implementation or a written reason it doesn't.

---

## Phase 3 — Component pass

**Branch:** `feat/component-audit` · Runs **before** the palette arrives — this is the ~70% that doesn't depend on color. Needs Phase 1 first only so the harnesses actually track the token source.

### 3.0 — The signature element: DECIDED

**The maru becomes the correctness vocabulary. Nothing more.**

○ / ✕ replace check/cross wherever the learner judges an answer. The hanko may anchor empty states. The mark appears nowhere else — no section stamps, no progress notation, no emboss pattern on cards.

**Where the app checks the answer: `AnswerResult` owns it.** When the app grades rather than the learner, the treatment is a **tinted banner** (`bg-success-bg` / `bg-error-bg`) carrying the outcome, above a neutral `bg-surface-2` block revealing the correct answer. The wording is `Recalled!` / `Not quite`, held in a **non-overridable constant** — call sites cannot supply their own copy, and that mechanism *is* the design: it is what stopped `FillBlankCard` and `GrammarClozeCard` drifting to two vocabularies for the same state.

A quiet, markless reveal was built first and **rejected on review of the rendered result** (2026-08-07). "Not quite" is approved and **must not be softened back** — "worth another look" was judged too ambiguous at the moment of judgment, since a learner should not have to work out whether they got it right. The gentleness lives in what happens next (the item resurfaces sooner), not in hedged wording here.

`AnswerResult` does not use `Maru`; the glyph goes on `KanaPracticePage`'s choice tiles instead. Full rationale: [`docs/superpowers/specs/2026-08-07-answer-result-design.md`](superpowers/specs/2026-08-07-answer-result-design.md).

**Why this and not the fuller motif system:** in Japanese schooling, ○ (maru) means correct and ✕ (batsu) means incorrect — not a checkmark and a cross. It's justified by something *outside* our own taste: ○ means correct in Japanese regardless of what AburunGo decides, so the usage stays right even if the brand changes. Every additional surface (section headers, progress rails, scenario cards) is a judgement call, and judgement calls are what drift.

**Colour, revised for v3 — the mark and the correctness glyph are no longer the same colour:**

| Glyph | Colour | Token |
|---|---|---|
| ○ correct | Rokushō 緑青 `#4F9C8D` | `--color-progress-fill` / `--color-success-500` |
| ✕ incorrect | Akane 茜色 `#D72E2E` | `--color-error-500` |
| the hanko | Akane 茜色 `#D72E2E` | `--color-accent` |

Under v3 the hanko is red and Akane is reserved for "brand mark and errors, never a CTA". **A red ○ would read as an error** — so the correct-mark takes Rokushō, which v3 already assigns to "progress, correctness".

This costs the decision one of its arguments (the brand mark and the correct-mark are no longer the same colour) but not its core, which was always about *shape*. And it gains a better one: v3 arrived at a dedicated correctness colour independently, and repainted `Button` `secondary` to Rokushō explicitly so that — in `HANDOFF.md`'s words — "the rating pair is legible at a glance." The drop was already building toward the FlipCard grading pair. Option B slots into it.

**The boundary — write this into `DESIGN.md` verbatim:**

> A maru marks an answer. It never accumulates.
> Transient and per-answer is annotation. Persistent and per-user is a badge.
> The moment a maru survives onto a profile screen, it has become gamification.

That line is the whole guardrail. Without it, this decision degrades into the reward loop `CLAUDE.md` bans.

**Cleared against the assessment rule (2026-08-07).** §3.0 originally conflicted with `product_assessment_principles`, which banned right/wrong colour feedback and any ratio. That rule was **revised in favour of §3.0**: the line moved from *colour and glyph* to *prose and persistence*. Per-answer ○/✕ in Rokushō and Akane is now the sanctioned vocabulary; the `ScoreCard` mark row is approved; the "never a ratio" bullet was retired as moot, since a ten-mark row is itself a ratio. Two constraints survive and bind this section:

- **Approved wording, not silence.** Banned as a verdict: "correct", "wrong", "incorrect", "failed", "missed", percentages, letter grades, pass/fail. Approved: `Recalled!` / `Not quite` in `AnswerResult`, "recalled" / "worth another look" as `Maru`'s screen-reader labels. **"Worth another look · n" survives as a *list heading*** — labelling a set of items to revisit is a different context from judging one answer, and is not ambiguous there. Do not swap those to "Not quite", and do not soften "Not quite" to them.
- **No accumulation** — the boundary rule quoted above, which is now the *only* thing separating this vocabulary from a reward loop and should be treated as load-bearing rather than a footnote.

**Also in 3.0 — sandbox setup.** Create `preview/_sandbox/`, decide gitignored vs. kept. Every variant lands here first.

Then run per component, in this order — primitives first, since 13 domain components depend on them:

`Button` → `TextInput` → `Card` → `Badge` → `IconButton` → **`Maru`** → **`AnswerResult`** → `PhraseCard` → **`FlipCard`** → **`KanaGrid`** → `KanaKeyboard` → `FillInput` → `VoiceInput` → `AudioButton` → `ProgressBar` → **`ScoreCard`** → `AppHeader` → **`EmptyState`** → `ErrorState` → `LoadingPlaceholder`

`Maru` and `AnswerResult` sit directly after the primitives: they are the correctness vocabulary itself, and the four domain surfaces below consume it.

**Bold = carries maru work** (per §3.0). Six components, and only these six:

| Component | Change |
|---|---|
| `Maru` | **already built** (ADS #9) — the sole definition of ○ / ✕. Anything marking an answer imports it rather than typing a literal. Gate it, don't redesign it |
| `AnswerResult` | **already built** (ADS #9) — the app-checks-answer banner + reveal frame, with non-overridable wording. Gate it, don't redesign it |
| `FlipCard` | self-grade buttons carry ○ / ✕ alongside their text labels |
| `ScoreCard` | per-answer mark row in addition to the total — shows *which*, not just how many. (The `label` default was already flipped to `"recalled"` in ADS #9 — [`ScoreCard.tsx:14`](../src/components/ScoreCard.tsx) — so only the mark row remains) |
| `KanaGrid` | learned state becomes a ring around the cell, not a background fill — keeps the kana legible underneath |
| `EmptyState` | optional outline hanko as a quiet anchor |

`FillInput` carries **no mark** — it is pure input with no feedback state at all (the app owns the result, and the result UI is `AnswerResult`'s job). This is a decision not to add judgment UI to the input itself, not a restyle of existing UI.

The other 14 get the standard pass with no mark work.

**Per-component loop** — the four-beat loop from the skill application map, run once per component:

1. **Constrain** — read this surface's dials off the table. No generation before the dials are set.
2. **Explore** — `frontend-design` loop (palette/type step off) + `/impeccable shape <component>`. 2–3 variants as static HTML in `preview/_sandbox/`. Then the defaults test: *would this work equally well for any other flashcard app?* If yes it's a template answer — discard and go again. Budget two rounds; if round three isn't better, ship round two and move on.
3. **Build** — the chosen variant only. TSX in `src/components/`, then the JSX mirror in `ui_kits/mobile/components.jsx`, then the story.
4. **Gate** — all checks below.

Colour-dependent findings get logged, not fixed — they're revisited in one pass after Phase 5 rather than guessed at against a palette that's about to be replaced.

**Per-component gate — all of these must pass before the next component starts:**

- [ ] `pnpm typecheck` clean
- [ ] `pnpm lint` clean on the file — oxlint + `check-adherence` + `check-contrast`. ~~`npx impeccable detect <X>.tsx` — no new findings vs baseline~~ **rescoped 2026-08-10:** the baseline holds zero `.tsx` findings, so "no new findings vs baseline" silently meant "zero findings allowed" against a baseline that had never seen a component. `check-adherence` covers `src/components/**` and is what actually runs. Run `impeccable detect` on the file by hand if you want a second opinion; it is not the gate
- [ ] Touch target ≥ 44px; `active:` state present; no hover-only affordance
- [ ] Visible keyboard focus ring; text contrast ≥ 4.5:1
- [ ] Renders at 375 / 768 / 1024 / 1440
- [ ] No gamification ornament; filled inline SVG icons only; no emoji
- [ ] **On the six mark components:** ○ / ✕ are glyphs, not icons — each needs an `aria-label`, and meaning must ride on **three channels** (glyph + color + text label), never the glyph alone. A screen reader must never receive a bare "circle". (`Maru` already satisfies this — `aria-hidden` glyph + `sr-only` label — so this is a verification, not a build)
- [ ] **Approved wording only:** never "correct" / "missed" / "wrong" / "incorrect" / "failed" as a verdict, no percentages or grades. `Recalled!` / `Not quite` is the sanctioned pair and must not be softened. Applies to all 20, not just the six.

Note that most gate items are palette-independent; the two that aren't (contrast, accent placement) are checked again in Phase 5 against the real palette. Passing them now against the outgoing palette is a smoke test, not the final word.

---

## Phase 3B — Close the gaps the drop left

**Branch:** `feat/close-gaps` · Runs inside Phase 3's four-beat loop, on the surfaces §2.6 identified as orphaned.

This is where the skills earn their place. Everything below is work the drop specified and didn't build, or didn't specify at all — and none of it needs another handoff.

**Not everything here needs a skill.** Reaching for a generative skill on a solved pattern is waste. Sorted by what it actually takes:

| Gap | How | Skill | Dials |
|---|---|---|---|
| `Badge` → scenario tag (`tag-bg`/`tag-fg`) | mechanical — apply the tokens `HANDOFF.md` already specified | none | — |
| `.hanko` → `--color-accent` | mechanical — one-line alias fix | none | — |
| `KanaKeyboard` `bg-fg` → `bg-inverse` | mechanical — right pixel, wrong role | none | — |
| Focus-ring split (`focus` / `focus-on-inverse`) | decided above; apply + verify with the contrast gate | none | — |
| ~~`ProgressBar` completion cap (`progress-complete`)~~ | ~~small design call: does a finished bar cap in Ōgon, or is that ornament?~~ **Not a design call — already decided.** `ProgressBar.tsx` says it "does not celebrate milestones, change colour at 100%" | none — token deleted 2026-08-11 | — |
| **Inverse chrome — `KanaKeyboard` first** — Sumi-iro ground, Ōgon hairline, `fg-on-inverse-2`, `shadow-key-on-inverse` | **real design work.** v3 designed a treatment and shipped no component wearing it. `KanaKeyboard` leads because the app actually imports it | `frontend-design` explore → `impeccable critique` | kana 4 / 2 / 3 |
| **Inverse chrome — `AppHeader` second** — same treatment, applied after the kana keyboard settles it | **`AppHeader` has zero importers in `../aburungo`** (verified 2026-08-07), alongside `PhraseCard` and `IconButton`. Doing the plan's most expensive design work on an unimported component is the wrong order. Either confirm it is meant for a shell that isn't built yet, or let `KanaKeyboard` establish the treatment and apply it here cheaply | reuse the `KanaKeyboard` result | shell 3 / 2 / 1 |
| **Scenario card** — `.emboss-bg` has no component owner | **real design work**, and the one surface where the pattern is sanctioned | `frontend-design` — this is its best target in the whole plan | 3 / 3 / 2 |
| Link treatment (`--color-link`) | solved pattern — don't design it, look it up | `ui-ux-pro-max` checklist | — |
| ~~`border-focus` `#5c7aa8`~~ | purpose unclear in v3 | ~~decide an owner or delete the token~~ — **deleted 2026-08-10**, it was neither on the palette nor used | done |

**Sequencing note:** the two "real design work" rows are the only ones that go through the full explore beat with variants in `preview/_sandbox/`. The mechanical rows are done directly — running a generative skill over a one-line token fix is exactly the waste this plan is trying to avoid.

**Phase 3B acceptance:** the §2.6 orphan table has zero rows left without either an implementation or a written reason, and `docs/colors.md` records every correction made to the drop so it can be sent back as a diff rather than a complaint.

---

## Phase 4 — Flow mockups (static, in-repo)

**Branch:** `feat/flow-mockups` · **Static HTML/JSX only.** No routing, no state management, no Supabase — `CLAUDE.md` boundary. Real wiring happens in `../aburungo` later via `/handoff-to-app`.

**Where they land — changed 2026-08-08.** Not `ui_kits/mobile/screens.jsx`. That
file is a hand-written mirror: every component typed out a second time in
browser JSX, and every one of them a palette behind. Building the mockups on it
would triple the drift.

Flows live in **`ui_kits/flows/`** and import `src/components` directly.
`scripts/build-flows.mjs` bundles them with esbuild (React external, from the
host page's import map) into a committed `bundle.js` — committed for the same
reason `dist/tokens.plain.css` is: the pages are static, and a preview that
needs a build first is a preview nobody looks at. `pnpm build:flows`, or `pnpm
build`. There is no second copy, so a component change shows up in the flow the
next time it is built.

Each state is deep-linkable — `?state=empty`, `?step=summary` — so `pnpm shots`
captures them without driving clicks.

Mirror the 11 pages that already exist in `../aburungo/src/pages/` rather than inventing new ones:

| Flow | Mirrors | Screens |
|---|---|---|
| Session start | `LearnPage`, `PracticePage` | entry, unit select, session config |
| **Flashcard round ✅ built** | `FlashcardPage` | prompt, reveal, self-grade, round summary + loading / empty / error |
| **Kana practice ✅ built** | `KanaPage`, `KanaPracticePage` | chart, drill, answered, keyboard entry, result + loading / empty / error |
| **Fill in the blank ✅ built** | `FillBlankCard` / `GrammarClozeCard`, the `LearnPage` review step | romaji, kana keyboard, JP keyboard, speak, both judgments + loading / empty / error |
| ~~Pronunciation~~ **Conversation** | `ConversationPage` | **The row was wrong.** `ConversationPage` is an LLM chat at a JLPT level — `setup` → `chat`, streaming messages. There is no pronunciation scoring anywhere in the app, and the five states listed here do not exist. `VoiceInput`'s real home is the fill-blank card's Speak channel. Real screens: level select, empty thread, streaming reply, send failure |
| Progress | `ProfilePage` | overview, per-unit detail |

Each flow ships **all five states** — loading, empty, error, success, in-progress — not just the happy path. That's `/impeccable harden` + `onboard` territory, and it's where v1's "strengthen stateful experiences" bullet becomes checkable: every state either present or not.

> **Amended 2026-08-11.** This originally set a target of "5 flows × 5 states = 25 mockups" and the arithmetic was doing work the flows should do. **Built: 3 flows, 21 deep-linked states** — `kana-practice` (8), `flashcard-round` (7), `fill-blank` (6). States are not uniform across flows and should not be: `kana` has `chart` / `drill` / `answered` / `keyboard` / `result`, `fill` has `romaji` / `kana` / `system` / `speak` / `review`. Forcing each flow to exactly five would mean inventing states to hit a number, or dropping real ones. **The count is an output, not a target** — what matters is that loading, empty and error exist wherever they can occur, which `scripts/shots.mjs` renders on demand.

### What the first flow found (2026-08-08)

The point of building a screen is the things a component in isolation cannot
show. Four, from one flow:

| # | Finding | Status |
|---|---|---|
| 1 | ~~**`bg-inverse` resolved to nothing.**~~ **FIXED 2026-08-08.** The token was `--color-bg-inverse`, which Tailwind turns into `bg-bg-inverse`. `AppHeader`'s band rendered transparent with near-white text on the page ground — an invisible title. No check caught it: the contrast gate reads tokens, not utilities, and the sandbox pages that approved the treatment used the CSS variable, which resolved fine | **fixed** — token renamed `--color-inverse`. Written up in [`docs/colors.md`](colors.md#orphaned-roles-task-26) as a correction to send back |
| 2 | ~~**The self-grade pair sits on the wrong colour.**~~ **FIXED 2026-08-09.** `Button variant="secondary"` is Rokushō-tinted — the correctness colour — so ✕ *Worth another look* renders a red glyph on a success-green field, saying two things at once. Overridden at the call site for now | **fixed, both ways.** `Button` gained `tone` (`neutral` / `success` / `error`), which *replaces* `secondary`'s chrome rather than stacking on it. And the pair became `GradePair`, which owns the glyphs, the colours and the wording — "Recalled" / "Worth another look" are not passable, the same mechanism `AnswerResult` uses and for the same reason. Correct by construction instead of by remembering to override |
| 3 | ~~**`FlipCard` faces are not equal height.**~~ **FIXED 2026-08-09.** The back is positioned `absolute inset-0`, so it inherits the front's height and clips when it is taller — which it always is, since the back adds the English and the note. Every call site has to pin a floor | **fixed.** Both faces share one grid cell instead of the back being absolute, so both size the track and the card is as tall as its taller face. Each face is itself a grid so its child stretches, or the container is stable while the card still resizes mid-flip. Measured against real content: card 1 renders 339/339, the long-note card 359/359, neither clipped — where the call site's guessed `min-h-[340px]` would have clipped the long one by 19px. That magic number is deleted |
| 4 | ~~**`ProgressBar` flush under `AppHeader`**~~ **FIXED 2026-08-09.** puts a Rokushō fill directly against the band's Ōgon hairline; the two read as one two-tone rule | **fixed.** `AppHeader` gained `progress`, so the bar renders *inside* the band and the band's own padding separates it from the Ōgon rule — no call site has to remember a spacer. `ProgressBar` gained `tone="inverse"`, because the light track glares on Sumi-iro. The tempting version was progress filling the Ōgon hairline itself; it scores **1.55:1**, half of the 3:1 a non-text indicator needs, so the track is stone-700 at 3.33:1. Checked before shipping, not after |

Two of these are §3.0 work the component pass has not reached yet, which is the
argument for building flows early rather than last.

### The plan's five flows miss the one that matters most

`FillInput` is the component the app actually imports, through a wrapper, and it
appears in **none** of the five rows above. It lives in `FillBlankCard` and
`GrammarClozeCard` — the review step inside `LearnPage`, which the table folds
into "Session start" and describes as *entry, unit select, session config*.

So a **sixth flow** was added. It is not padding: it is the only surface that
renders `FillInput`, `VoiceInput` and `AnswerResult`-in-context, and the only
one that could test whether the rewritten keyboard actually fits its real host.

### What the kana flow found (2026-08-08)

| # | Finding | Status |
|---|---|---|
| 5 | ~~**`KanaKeyboard` does not fit a phone.**~~ **FIXED 2026-08-08 — consonant-first pad, 596px → 256px.** The gojūon grid is ten rows at the 44px touch floor, plus the script/section toggles and the utility row: **596px of a 780px screen.** The entry screen only works because the keyboard docks to the bottom and the prompt collapses to a single line — no card, no reveal, no second control. Worse for `FillInput`, which embeds the keyboard *inside* a bordered display block on the flashcard screen; that combination cannot fit at any viewport a phone has | **fixed.** The grid became a 12-key pad — one key per consonant row, tapping it opens that row's five vowels above the pad. 256px closed, 308px open. Not an invention: it is the information architecture every Japanese phone keyboard already uses, minus the flick gesture, and the two taps trace the consonant/vowel structure a learner is building anyway. The groups derive from `HIRAGANA_BASIC`'s existing rows — each row *is* a consonant group — so there is no second table to keep in step. The docking workaround in the kana flow was reverted; the screen holds a prompt card, the answer field, the keyboard and the submit button with room left |
| 6 | ~~**`KanaGrid` had no way to show a learned kana.**~~ **FIXED 2026-08-08.** §3.0 specified a ring rather than a fill; the component had neither, and `renderKey` returned `string`, so a reference chart could not show romaji under the character either | **fixed** — `learned?: ReadonlySet<string>` draws an inset Rokushō ring, and `renderKey` widened to `ReactNode`. The ring reads clearly at a glance without touching the character's legibility, which was the argument for it |
| 7b | ~~**The multiple-choice tile is not a component.**~~ **CLOSED as "not yet", 2026-08-09.** §3.0 puts the maru on `KanaPracticePage`'s choice tiles, and the tile — neutral, then ○ on the answer and ✕ on the wrong pick — is composed in the flow file. Any other multiple-choice surface will retype it | **closed as "not yet", 2026-08-09.** One caller. Unlike `GradePair`, it locks nothing that could drift — the glyph and its colour already live in `Maru`, and the grounds are `success-bg` / `error-bg`. An abstraction with one implementation is the thing this plan keeps deleting. **Trigger to revisit: a second multiple-choice surface.** |
| 8 | ~~Once answered, the two unpicked tiles read as still tappable~~ **FIXED 2026-08-09** | They take `text-fg-subtle` once the question is settled — muted rather than faded out, since they were genuinely on offer and the learner may want to read them back |

**Two answered questions**, both of which needed a screen:

- **The Rokushō keyboard is right.** Sumi-iro band at the top, Rokushō slab at the bottom, warm stone between: the screen has two coloured fields and neither reads as a second near-black. The v3 default of a Sumi-iro keyboard would have.
- **The maru boundary holds.** ○ / ✕ on the choice tiles are per-answer and vanish on `Next`; the result screen's mark row is per-round and vanishes with the round. Nothing survives onto a profile, which is the §3.0 line.

---

### What the fill-in-the-blank flow found (2026-08-09)

| # | Finding | Status |
|---|---|---|
| 9 | **The keyboard rewrite was not enough on its own.** Finding 5 was justified by "`FillInput` cannot fit at any viewport", and the fix was shipped without ever rendering `FillInput`. Measured here, the card still ran **54px past a 390×844 phone** — better than the ~390px before, but scrolling. The cause was not the keyboard: the card stacked **two segmented controls**, Type/Speak above `FillInput`'s own Romaji/Kana/JP picker, before a learner could type | **fixed** at the call site — Type/Speak moved onto the card header. All nine states now measure `content == viewport`. **Open for the component:** whether the two pickers should merge into one four-way control, which is a product decision rather than a layout one |
| 10 | **`KanaKeyboard`'s toggle row wrapped in a narrow container.** Inside a `Card` the keyboard gets ~310px rather than the ~360px it has standalone; five toggles at `px-3` wrapped their labels — "ひら" stacking to two lines — silently doubling the row from 44px to 88px | **fixed** — `whitespace-nowrap`, `px-2`, caption type. A component that is only ever tested at full width hides this |
| 11 | **`FillInput`'s submit was off-palette.** A hand-rolled button on `bg-fg` — Sumi-iro, a v2 holdover — while every other primary action in the product is Ai-iro. Two different "primary" buttons could appear on one screen | **fixed** — it uses `Button` now, which is also one less hand-rolled control |

| 12 | **`VoiceInput` dressed recording in Akane.** `bg-error-500` for the mic fill and the `animate-ping` halo — the colour this palette reserves for the mark and for errors. The one moment the app is working correctly looked like the moment it failed, and `listening` was indistinguishable from `error` | **fixed** — new `--color-recording` role on Rokushō, which already carries in-progress. Every voice state is now deep-linkable in the fill-blank flow, so the two can be compared side by side rather than assumed distinct |

---

## Phase 5 — Merge the v3 drop

**Branch:** `feat/palette-v3` · **No longer blocked** — the drop is in hand.

This is a **merge, not a copy.** The drop is ahead on tokens and assets and behind on components and `brand.css`, so `INTEGRATION.md`'s three `cp` commands are wrong for this repo (see ground truth above). Nothing gets overwritten wholesale.

| # | Task | Guard |
|---|---|---|
| 5.1 | Port v3's `@theme` block into `src/tokens.css`, **keeping** the card-animation tokens and keyframes (task 2.4b) | `FlipCard` still animates |
| 5.2 | Copy `assets/logo-a-tile.png`, `logo-a-128.png`. **Not `pattern-sakura.png`** — see 0.7 | `.hanko` renders the ア |
| 5.3 | **Merge** v3's `brand.css` — take its `.hanko` / `.emboss-bg` updates, keep our `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame`, `.hanko.ink` | `brand.css` still exports all six utility groups; §3.0's maru survives |
| 5.4 | **Verify** the five component repaints from `HANDOFF.md` §4 — `Button` primary/secondary, focus rings on `Button`/`TextInput`/`IconButton`/`KanaGrid`, `ProgressBar` fill, `Badge` emphasised → scenario tag. The drop ships these five already repainted, so this is a diff review, not a hand-edit. **Do not apply §4 by hand** — 2.2 deliberately left these files untouched so the drop's versions land clean | each of the five matches §4; `Badge` is the known exception (§2.6 finding 1 — `HANDOFF.md` claims a repaint that was never made) |
| 5.5 | **Repaint the nine the drop doesn't ship.** Only `FillInput` has a legacy-token defect (`ring-brand-500` → red); the other eight are role-based already and just need verifying | `grep` for legacy tokens in `src/components/` returns nothing |
| 5.5b | **Apply the inverse-chrome treatment the drop designed but never built** — `AppHeader` and `KanaKeyboard` take `bg-inverse`, `rule-on-inverse`, `fg-on-inverse-2`, `shadow-key-on-inverse`. Fix `KanaKeyboard`'s `bg-fg` → `bg-inverse` while there | the four inverse roles have implementations |
| 5.5c | ~~Build the rest of the orphan list from §2.6~~ — **done 2026-08-11.** `tag-bg`/`tag-fg` shipped on `Badge.tsx:27` and `PhraseCard.tsx:37`, so `HANDOFF.md` was right in the end and the note calling it false is retired. `progress-complete` was deleted rather than built — see §2.6 | **orphan count is zero**, each deletion with a written reason |
| 5.5d | ~~Repoint `.hanko` from `var(--color-brand-500)` to `var(--color-accent)`~~ — **done, verified 2026-08-10.** `.hanko` fills with `var(--color-accent)`, which is `#D72E2E` at `src/tokens.css:173`; `brand.css` contains no `brand-500` reference at all, so the "eight other sites" are gone too. CSS mark and raster mark now match. **Still open:** `.wm`, `.frame` and `.ctype` reference seven other legacy aliases (`ink`, `paper`, `rose`, `cream`, `cream-deboss`, `dusk`, `brand-800`) — note that `--color-rose` now resolves to Ōgon `#C9A045`, a yellow | **done** — mark renders Akane with no legacy alias |
| 5.6 | Migrate the deprecated `Button` `accent` variant to `primary` and drop it | no call sites remain |
| 5.7 | `pnpm build` — contrast gate runs against real v3 values | the seven known failures above are either fixed or explicitly accepted; **the focus-ring failure should be resolved with the palette author, not silently re-tinted** |
| 5.8 | `pnpm lint` — oxlint + adherence + contrast, over `src/components/**`. Then `npx impeccable detect` over `preview/ storybook/ ui_kits/` **by hand**, eyeballed against N = 134 | lint clean. The impeccable pass is a look, not a pass/fail: its baseline carries absolute `/Users/...` paths and line anchors that drift on any edit above them, so a mechanical diff reports noise. Regenerate the baseline after the palette lands rather than trying to diff across it |
| 5.9 | Work the deferred colour queue from Phase 3 | accent placement, correct/incorrect semantics, focus-ring contrast per surface |
| 5.10 | Visual sweep: storybook + 3 UI kits + 27 preview pages | all render v3 |
| 5.11 | Replace `docs/colors.md` with the drop's v3 version; fold `HANDOFF.md` in as provenance | palette rationale matches what ships |

**The Phase 1 test still applies to 5.1:** if porting the token block requires touching any file other than `src/tokens.css`, Phase 1 wasn't finished. Tasks 5.2–5.6 are the drop's *other* payload — components, assets, brand utilities — and were always going to be separate work.

**A stale comment to fix while you're in there:** v3's `TextInput.tsx:8` says "focus ring is Akane" but the code correctly uses `ring-focus` (Ōgon). The comment is wrong, not the code.

---

## Deliverables

1. `scripts/build-tokens.mjs` — one token source, six consumers, zero hand-copies
2. `scripts/check-contrast.mjs` — a contrast gate that scores any palette on `pnpm build`
3. `PRODUCT.md` + `DESIGN.md` — the brief, machine-readable, written in roles not hexes
4. `.impeccable/baseline.json` — a committed **design record** of the sandbox, N = 134. ~~+ a CI gate that fails on regression~~ **Corrected 2026-08-10: there is no CI gate, and one was deliberately not built.** Four reasons, in order of weight. (a) **It would gate the wrong thing.** `check-adherence` scans `src/components/**` and says so — `preview/` and `ui_kits/` are the sandbox. The baseline is the exact complement: 88 HTML, 37 JSX, 9 CSS, zero `.tsx`. A gate on it is a gate on throwaway variants, which taxes the cheapness the sandbox exists for. (b) **Nothing in it is an error** — 84 advisory, 50 warning. (c) **The paths are machine-specific**, all absolute `/Users/peterabeln/...`; a runner is `/home/runner/work/...`, so a naive diff reports 134 fixed and 134 new. (d) **The line anchors drift** — the `border-radius: 14px` finding recorded at `brand.css:289` is at 304 today, moved by an unrelated edit above it. What actually gates the repo: `check-forbidden-assets` (CI, pre-install + pre-commit), `pnpm lint` (oxlint + adherence + contrast), `pnpm typecheck`, `pnpm build`. What actually enforces the impeccable rules day to day is its **local Write/Edit hook**, which is per-machine and protects no one else's commits — do not mistake it for repo-level cover
5. `preview/_sandbox/` — the variant workshop, where skill output gets tried before it gets shipped
6. 21 components passing the eight-point gate
7. A correctness vocabulary — `Maru` as the sole ○ / ✕ definition, consumed across the mark surfaces, with `AnswerResult` owning the app-checks-answer case and its non-overridable wording — plus the boundary rule that keeps it from becoming a badge
7b. Every token v3 defines has an implementation, a written reason, or a deletion — and `docs/colors.md` carries the corrections as a diff to send back. ~~Zero orphaned roles~~ **Corrected 2026-08-10** after re-auditing against **both** repos (the app imports `src/tokens.css`, so it can consume any role; checking only this repo was the original error). Result: `inverse`/`rule-on-inverse`, `tag-bg`/`tag-fg`, `action*`, `accent` and `fg-heading` are **built**; `border-focus` was **deleted** as an off-palette v2 leftover; `link` is **kept with its reason gated** (Rokushō 500 is 3.00:1 and fails AA as text — `#33685e` is it darkened to 5.91:1); `shadow-key-on-inverse` is **queued** behind the `KanaKeyboard` key pass; `progress-complete` was **deleted** — filed as an open taste call, but `ProgressBar.tsx`'s anti-goal had already ruled out changing colour at 100%, so code beat plan and there was nothing to decide. **Zero orphans now stands, for real**
8. **3 flows, 21 deep-linked states** in `ui_kits/flows/` — `kana-practice` (8), `flashcard-round` (7), `fill-blank` (6), every one rendered by `pnpm shots`. ~~25 flow mockups (5 flows × 5 states)~~ **Corrected 2026-08-11.** Fewer mockups than planned, and better ones than planned: these are not hand-drawn, they `import` from `src/components`, so they cannot drift from the package the way `ui_kits/mobile/` does. This is the harness that caught `bg-inverse` rendering nothing after typecheck, lint and the contrast gate all passed
9. A palette swap that is a one-file diff

---

## Explicitly out of scope

- **App-side work.** No changes in `../aburungo`. Flows ship as mockups; integration happens later via `/handoff-to-app`.
- ~~**New components.** 18 is enough.~~ **Amended 2026-08-07.** This exclusion was wrong in one specific way: the components that actually judge an answer in the shipped app — `FillBlankCard`, `GrammarClozeCard`, `KanaPracticePage` — were *not* design-system components, so §3.0's correctness vocabulary reached none of them. `AnswerResult` and `Maru` were added to close that (ADS #9, app #60), and `GradePair` followed for the same reason — the self-grade pair was reaching for `Button secondary`, which is Rokusho, so the ✕ button rendered a red glyph on a success-green field. The library is now **21**. The exclusion otherwise stands: anything new is speculative until a flow mockup or a real consumer proves it's missing.
- **Killing the JSX mirrors.** `ui_kits/mobile/components.jsx` duplicating all 20 TSX components is a real drift machine and the obvious next cleanup, but consolidating it is its own project. Noted, deferred, not smuggled into this plan.
- **Dark mode.** Not in the brief, not in the tokens, not requested.
- **The fuller motif system (option C).** Section stamps, progress notation, serial-number framing from `.frame`, and the `.emboss-bg` sakura pattern on scenario cards. Rejected for now — every one of those is a taste call rather than a pedagogical one, and they're the surfaces that walk toward the badge line. Consequently `assets/pattern-sakura.png` is **not** needed; only `logo-a-tile.png` is (task 0.7). Revisit once the correctness vocabulary has shipped and proven itself.

---

## Execution order and dependencies

```
Phase 0 (toolchain + brief + assets)
   └─> Phase 1 (single-source tokens)        ← unblocks everything
          ├─> Phase 2 (adopt v3 roles + gates)
          │      └─> Phase 5 (merge the v3 drop)
          │             └─────────────────┐
          └─> Phase 3 (component pass) ───┴─> Phase 3B (close the gaps)
                 ↑ ~70% palette-independent        └─> Phase 4 (flows)
```

**Phase 5 moved earlier.** It was last because it was blocked on a palette that hadn't arrived. It has arrived, and it changes what the components look like — so merging it *before* the bulk of Phase 3 means the component pass happens once, against v3, instead of twice.

Recommended order: **1 → 2 → 5 → 3 → 4.** Phase 3's palette-independent work (structure, density, motion, states, touch targets) can still start in parallel with 2 and 5; only the colour-dependent half needs to wait.

**What hasn't changed:** Phase 1 is still the highest-value work in the plan, and the drop is the argument for it. Three palettes have now been propagated by hand into six places. Do Phase 1 first and this is the last time.
