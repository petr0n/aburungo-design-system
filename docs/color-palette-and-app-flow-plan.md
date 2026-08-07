# AburunGo — Palette Migration & Flow Plan (v2)

**Status:** draft — not started · **Scope:** `aburungo-design-system` only · **Palette:** v3 "Zuihoden", in hand and reviewed · **Branch prefix:** `feat/tokens-*`, `feat/flow-*`

> **Posture: this repo is the source of truth. The drop is an input, not an authority.**
>
> The v3 drop is a good palette with an incomplete implementation — eight roles with no owner, a documented change that was never made, a brand mark wired to a deprecated alias, a focus ring that fails WCAG on every light surface, and half the component library missing. Reviewed on its merits, the colour thinking is sound and the execution is a first pass.
>
> So the plan does not wait for a better drop. It takes the palette, closes the gaps here, and sends corrections back. Everything missing is either mechanical (apply a token) or ordinary design work the skills in this plan exist to do. Nothing on the gap list requires going back to the source.

---

## Why v1 was rewritten

v1 was a list of adjectives, not a plan. Every task was unfalsifiable ("stronger hierarchy", "better spacing", "more deliberate screen rhythm") — there was no way to tell whether a task was done. Four things to fix:

1. **It treated the palette as the work.** The palette is the easy part — it's a set of hex values arriving from elsewhere. The hard part is that the repo has **six independent copies of the tokens**, so *any* palette change is a seven-file hand-edit plus a sweep of 27 preview pages. v1 planned the swap and ignored the plumbing that makes the swap expensive.
2. **It put app-shell, onboarding, and navigation work in a repo that forbids it.** `CLAUDE.md`: no routing, no Supabase, no Zustand. And `../aburungo` already has 11 pages.
3. **It never opened `docs/design-direction.md`** — the actual brief, sitting in the same folder. Which is how it arrived at `VISUAL_DENSITY: 8` ("dense dashboards") for a product whose brief says *Muji notebook, calm, minimal, whitespace used so accent moments feel intentional*.

4. **It named four skills but configured none of them.** Each ships defaults that actively fight this brand — palette generators, style pickers, GSAP dependencies, density presets. Cited-but-unconfigured, they make the product worse. On review (2026-08-07) two of the four were cut entirely rather than configured: needing a paragraph to muzzle a tool is the argument against adopting it.

---

## Ground truth

### Six token sources, no single source of truth

| # | File | Form | Feeds |
|---|---|---|---|
| 1 | `src/tokens.css` | `@theme` | `src/components/**` — the shipped package |
| 2 | `colors_and_type.css` | `:root` | all 27 `preview/*.html`, via `preview/_card.css` |
| 3 | `storybook/index.html:35` | inline `@theme` | the storybook |
| 4 | `storybook/stories.jsx:301` | hardcoded hex array | the color-swatch story |
| 5 | `ui_kits/mobile/index.html:44` | inline `@theme` | mobile UI kit |
| 6 | `ui_kits/app/index.html:40` | inline `@theme` | app UI kit |
| 7 | `ui_kits/desktop-explore.html:28` | inline `@theme` | desktop explore |

Only #1 is the real one. **None of the other six read from it.** Every surface a human looks at — storybook, three UI kits, 27 preview pages — is disconnected from the token source, which is why they already drifted a full palette behind and why they'll drift again the moment the next one lands.

**The v3 drop confirms this rather than fixing it.** Its harnesses carry the same hand-copied token blocks — 26 inline declarations in `storybook/index.html`, 43 in `ui_kits/mobile/index.html`, 26 each in `ui_kits/app/index.html` and `desktop-explore.html`, 31 in `colors_and_type.css`, plus 7 hardcoded hexes in `storybook/stories.jsx`. That's the third palette in a row propagated by hand into six places.

Hand-fixing the values buys one clean day. Wiring the harnesses to the source is the actual work, and it's what turns a palette swap from a seven-file archaeology exercise into a one-file diff.

Prose docs are stale too: `README.md`, `SKILL.md`, `CLAUDE.md`, `colors_and_type.css`.

Two swatch pages (`preview/03-color-brand.html`, `preview/06-color-semantic-fg.html`) print hex values as literal page text rather than reading them from a variable. Whatever palette lands, they'll strand again unless that's fixed once.

### The palette arrived — it's v3 "Zuihoden", and it's a full DS drop

Located at `~/Downloads/AburunGo project setup Zuihoden/_ds/aburungo-design-system-1e624d61-…`. Reviewed in full. It is **not** a set of hex values — it's a parallel snapshot of this whole repo, repainted.

**Five colors, one job each.** Akane 茜色 `#D72E2E` (brand mark + errors, never a CTA) · Ai-iro 藍色 `#1F3A66` (structure, primary action, headings, JP) · Rokushō 緑青 `#4F9C8D` (progress, correctness, secondary, links) · Ōgon 黄金 `#C9A045` (focus rings, scenario tags, dark hairlines) · Sumi-iro 墨色 `#2D2D2D` (inverse chrome). All on a warm stone ramp — ground `#F7F6F1`, cards `#FFFDF8`. The warm neutrals are load-bearing and deliberately not `#fff`.

**The drop is ahead of us on tokens and assets, and behind us on components.**

| | Drop | This repo |
|---|---|---|
| Tokens | v3 Zuihoden, fully role-based | v2 plum |
| Components | **9** | **18** |
| `brand.css` | `.hanko` + `.emboss-bg` only (151 lines) | + `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame` (343 lines) |
| Card animations | **absent** | `--animate-card-enter` / `-exit` + keyframes |
| Mark assets | `logo-a-tile.png`, `pattern-sakura.png`, `logo-a-128.png` | none |
| Adherence lint | `_adherence.oxlintrc.json` | none |

### Following INTEGRATION.md verbatim would cause three regressions

Its instructions assume a repo that has only the 9 components it ships. This repo has 18, and is ahead in two places.

1. **`cp src/brand.css` deletes 192 lines** — the entire `.maru` / `.wm` / `.kata-vert` / `.ctype` / `.frame` / `.hanko.ink` system, including the maru that §3.0 depends on. **Merge, don't copy.**
2. **Replacing `src/index.css` drops the card animations.** v3 defines no `--animate-card-*` and no keyframes; `FlipCard.tsx:16–17` uses `animate-card-enter` / `animate-card-exit`. Tailwind won't error — the classes silently stop generating and the flip animation dies. **Port the animation block forward.**
3. **`cp -r src/components/*` repaints only 9 of 18.** The other nine — `AppHeader`, `EmptyState`, `ErrorState`, `FillInput`, `FlipCard`, `KanaKeyboard`, `LoadingPlaceholder`, `ScoreCard`, `VoiceInput` — don't exist in the drop and never get touched.

### The good news: almost nothing in those nine actually breaks

Verified — every one of the 38 distinct token suffixes the 18 components reference resolves under v3, all 13 type tokens exist, radii and shadows exist. Nothing errors, because v3 aliases every legacy name.

**Exactly one real defect:** `FillInput` uses `ring-brand-500`, and under v3 `brand-500` resolves to **Akane red** — a red focus ring, indistinguishable from an error state. `HANDOFF.md` §4 flags this precise trap and fixes it in the four components it ships; `FillInput` isn't one of them. The other eight repo-only components are already role-based and repaint correctly for free.

Two aliases changed meaning and are worth knowing: **`rose` now points at Ōgon gold** (was pink `#e6bbd7`) and **`dusk` at Ishi-iro grey**.

### One structural defect (survives the palette swap)

**No `prefers-reduced-motion` guard anywhere.** `--animate-card-enter` / `--animate-card-exit` (`src/tokens.css:144–157`) fire unconditionally; `src/index.css` has no guard either. This is not a palette issue — it stays broken through any number of palette changes. Fix it regardless.

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

18 components: 5 primitives (`Button`, `TextInput`, `Card`, `Badge`, `IconButton`) + 13 domain (`PhraseCard`, `KanaGrid`, `KanaKeyboard`, `FlipCard`, `FillInput`, `VoiceInput`, `AudioButton`, `ProgressBar`, `ScoreCard`, `AppHeader`, `EmptyState`, `ErrorState`, `LoadingPlaceholder`). 1,156 lines total. Every one has a JSX mirror in `ui_kits/mobile/components.jsx` that must be kept in sync by hand — the second drift machine after the tokens.

---

## The skills — cut from four to two (decided 2026-08-07)

Each ships defaults that conflict with this brand. That was originally handled by writing down what to switch off for each — but **needing a paragraph to muzzle a tool is the argument against adopting it.** Two of the four were disabled down to near nothing and are dropped:

| Skill | Verdict |
|---|---|
| `impeccable` | **Keep.** The only deterministic, machine-checkable one. Belongs in CI. |
| `_adherence.oxlintrc.json` | **Keep.** Came free with the drop; bans raw hex, raw px, non-DS fonts, deep imports. |
| `frontend-design` | **Keep** the four-step loop for the two genuine design tasks in Phase 3B. Palette/type step off. |
| ~~`taste-skill`~~ | **Dropped.** Three numbers per surface. `docs/design-direction.md` already says calm, minimal, whitespace; the per-surface dials table went with it. |
| ~~`ui-ux-pro-max`~~ | **Dropped.** 90% of it had to be switched off. What remained — contrast, visible focus, reduced-motion, ≥44px, no emoji — is already in `CLAUDE.md` and in the per-component gate. |

**What replaces them:** `CLAUDE.md` *is* the pre-delivery checklist, and the two scripts this plan builds (`build-tokens.mjs`, `check-contrast.mjs`) plus `check-forbidden-assets.mjs` are deterministic gates that no skill provides. Two gates and three scripts on 1,156 lines of source is already generous.

### 1. `impeccable` (pbakaus) → **the CI gate**

The only one of the four that produces a deterministic, machine-checkable artifact: a standalone detector CLI, 59 rules, no AI harness or API key required, JSON output. That belongs in CI, not in a conversation.

- **Use:** `npx impeccable install` → `/impeccable init` generates `PRODUCT.md` + `DESIGN.md`. Seed both from `docs/design-direction.md` — don't let it interview from scratch, the brief already exists and is better than anything an interview produces.
- **Commands in rotation:** `critique` (per component), `audit` (a11y/perf), `harden` (edge cases), `adapt` (responsive), `polish`.
- **⚠️ Conflict:** its anti-pattern list bans purple gradients and gray-text-on-colored-backgrounds. AburunGo is a single-accent monochrome system and has been purple through two palettes running. `DESIGN.md` must record one-accent-by-design as intentional or the detector false-positives on every primary button — and it must say that in terms of the *role*, not a hex, so the new palette doesn't reopen it.

### 2. `frontend-design` (anthropic) → **the per-surface build loop**

Four steps: brainstorm → review against defaults → build → self-critique.

- **Use:** the loop itself, run per surface. Its sharpest question — *what is the signature element?* — is already answered for this project: **the maru, scoped to correctness** (§3.0). Don't re-open it per surface; feed the answer in as a constraint.
- **Also mandatory:** its self-critique gate — responsive, keyboard focus, reduced-motion.
- **⚠️ Switch off:** its step-1 instruction to brainstorm a 4–6 color palette and pick display/body typefaces. The palette is arriving from elsewhere and the type is locked (Noto Sans / M PLUS Rounded 1c). Running that step produces a competing palette nobody asked for.

### 3. ~~`taste-skill`~~ and 4. ~~`ui-ux-pro-max`~~ — dropped

Both are cut. What they were carrying is preserved in cheaper form:

- **Density and motion intent** — the brief already says calm, minimal, generous whitespace, and motion that reinforces the next step rather than decorating it. One sentence in `DESIGN.md`: *density stays low except the progress summary, which has real data density; motion never exceeds a short functional transition.* That was the whole content of 21 dial values.
- **The pre-delivery checklist** — contrast ≥ 4.5:1, visible keyboard focus, `prefers-reduced-motion`, breakpoints 375 / 768 / 1024 / 1440, ≥ 44px targets, `active:` states, no hover-only affordances, filled inline SVG only, no emoji. All of it is already in `CLAUDE.md` and in the per-component gate in Phase 3.

Both also carried real hazards that no longer need managing: `ui-ux-pro-max` would import 192 palettes, 84 UI styles, and 74 font pairings over a locked brand, and prescribes `cursor-pointer` plus hover transitions to a touch-first product; `taste-skill`'s canonical skeletons are GSAP, against a package with zero runtime dependencies.

---

## Skill application map — where and when

Three properties decide when each skill fires. Getting these wrong is how skills produce noise instead of improvement.

| Skill | Altitude | Cadence | Direction |
|---|---|---|---|
| `frontend-design` | surface | only on the two real design tasks in 3B | **generative** — trial and error lives here |
| `impeccable` | component + repo | `shape`/`critique` per component; `detect` every build | both — `shape` generates, `detect` gates |
| oxlint adherence | repo | every build | gate |

One generates, two check. Running them in the wrong order is the main failure mode: generate first and the constraints become an argument with work that already exists.

### The three-beat loop

The pattern for every surface. Beats 1–2 are cheap and disposable; beat 3 is where it locks. (This was a four-beat loop; the `taste-skill` dial-setting beat was cut with the skill — the constraint it encoded now lives as one line in `DESIGN.md`.)
1. **Explore** — `frontend-design` loop (palette/type step off) + `/impeccable shape`. Generate 2–3 variants. **This is the trial-and-error beat**, and it runs in the sandbox, never in `src/components/`.
2. **Build** — the chosen variant only. TSX → JSX mirror → story.
3. **Gate** — the per-component gate in Phase 3 + `impeccable detect` + oxlint adherence. Pass/fail, no discussion.

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
| `frontend-design` | `EmptyState`, `ErrorState` | the brief says charm belongs here, so there is the most room to explore; 3 small components, ~19 lines each — lowest blast radius |
| `impeccable` | `Button`, `TextInput`, `Card` | primitives that 13 components depend on; detector rules pay off most on high-reuse code |

### What to expect, so you can judge output fast

Calibration for the trial-and-error phase — knowing the expected hit rate stops you from over-reading a weak result.

- **`frontend-design`** — high value, low volume. Expect roughly one good structural idea per surface. If it proposes a palette, step 1 was left switched on.
- **`impeccable detect`** — highest signal-to-noise, because it's deterministic. `craft` and `shape` output is far more variable; treat it as a first draft, not a recommendation.

---

## Density and motion — one paragraph, not a table

*(This was a 21-value per-surface dials table feeding `taste-skill`. The skill was cut on 2026-08-07; the intent it encoded is below, which is all the table ever said.)*

**Write this into `DESIGN.md`:**

> Density stays low everywhere — the brief is a Muji notebook, and whitespace is what makes the single accent feel deliberate. The one exception is the progress summary (`ProgressBar`, `ScoreCard`), which has real data density and can carry more.
>
> Motion never exceeds a short functional transition that reinforces where the learner is going next. No scroll-driven or magnetic interaction — this is a touch-first study app.
>
> Charm is allowed in exactly two places, per `docs/design-direction.md`: empty states and progress language. Everywhere else, restraint.

---

## Phase 0 — Toolchain and brief

**Branch:** `build/design-toolchain`

| # | Task | Done when |
|---|---|---|
| 0.1 | `npx impeccable install` | `npx impeccable --help` runs |
| 0.2 | `/impeccable init`, seeded from `docs/design-direction.md` | `PRODUCT.md` + `DESIGN.md` at repo root, recording: one accent, no gamification, touch-first, Noto Sans + M PLUS Rounded 1c |
| ~~0.3~~ | ~~`npx skills add taste-skill`~~ — **cut 2026-08-07.** Instead: write the density/motion paragraph above into `DESIGN.md` | paragraph present; no dials table to maintain |
| ~~0.4~~ | ~~`ui-ux-pro-max` install~~ — **cut 2026-08-07.** Its surviving checklist is already the Phase 3 per-component gate | nothing to do |
| 0.5 | Vendor `frontend-design` into `.claude/skills/` — used only on the two real design tasks in Phase 3B | skill loads; `DESIGN.md` records that its palette/type brainstorm step is off |
| 0.6 | Baseline detector run over `src/ preview/ storybook/ ui_kits/`, JSON to `.impeccable/baseline.json` | baseline committed; finding count recorded → **N = ____** |
| 0.7 | ~~Source or redraw `assets/logo-a-tile.png`~~ — **closed.** `logo-a-128.png` and `logo-a-tile.png` were copied from the drop on 2026-08-07 and are in `assets/`. `pattern-sakura.png` is **not** needed (see out-of-scope). Have the mark redrawn as vector in Akane before any large or print use | `.hanko` renders the ア at 24 / 48 / 96px |
| 0.8 | Write the maru boundary rule (§3.0) into `DESIGN.md` | rule present verbatim; impeccable won't flag ○/✕ as ornament |
| 0.9 | Adopt the drop's `_adherence.oxlintrc.json` as a second deterministic gate — bans raw hex, raw px, non-DS fonts, and deep imports past the barrel | `pnpm lint` runs it; findings recorded alongside the impeccable baseline |
| 0.10 | ~~New~~ — **already done 2026-08-07.** `scripts/check-forbidden-assets.mjs` is a third deterministic gate, wired into `pnpm build`, CI, and pre-commit | `pnpm check:brand` passes |

`DESIGN.md` is written against the brand *rules*, not against specific hex values — it has to survive the palette swap without edits.

---

## Phase 1 — Collapse six token sources into one

**Branch:** `feat/tokens-single-source` · **This is the phase that makes the inbound palette a one-file diff.**

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
| 2.1 | Adopt v3's role vocabulary as the contract. Audit which of the 18 components still reference a *value* token (`brand-500`, `rose`, `dusk`) rather than a role | role-vs-value table in `docs/colors.md`; known offender list starts at `FillInput` |
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
| `progress-complete` `#C9A045` | "a completed bar caps with Ōgon" | `ProgressBar` |
| `tag-bg` / `tag-fg` | scenario tags | `Badge` (emphasis variant) |
| `link` `#33685E` | links | **no component exists** |
| `border-focus` `#5c7aa8` | — unclear, distinct from `focus` | unassigned |

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

**Where the mark does *not* go: automatic verdicts.** When the app checks an answer rather than the learner grading it, the treatment is a **quiet reveal** — show the correct answer, no mark and no banner. The learner compares for themselves. This is the one place a mark would read as the app pronouncing judgment, which is the line the assessment rule keeps (see below).

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

- **No verdict prose.** "recalled" not "correct", "worth another look" not "missed". The glyph carries the judgment; the words stay calm. This is why the `FillInput` treatment above is a quiet reveal rather than a mark.
- **No accumulation** — the boundary rule quoted above, which is now the *only* thing separating this vocabulary from a reward loop and should be treated as load-bearing rather than a footnote.

**Also in 3.0 — sandbox setup.** Create `preview/_sandbox/`, decide gitignored vs. kept. Every variant lands here first.

Then run per component, in this order — primitives first, since 13 domain components depend on them:

`Button` → `TextInput` → `Card` → `Badge` → `IconButton` → `PhraseCard` → **`FlipCard`** → **`KanaGrid`** → `KanaKeyboard` → `FillInput` → `VoiceInput` → `AudioButton` → `ProgressBar` → **`ScoreCard`** → `AppHeader` → **`EmptyState`** → `ErrorState` → `LoadingPlaceholder`

**Bold = carries maru work** (per §3.0). Four components, and only these four:

| Component | Change |
|---|---|
| `FlipCard` | self-grade buttons carry ○ / ✕ alongside their text labels |
| `ScoreCard` | per-answer mark row in addition to the total — shows *which*, not just how many. **Also flip the `label` default from `"correct"` to `"recalled"`** ([`ScoreCard.tsx:11`](../src/components/ScoreCard.tsx)) — verdict prose is the one thing the revised assessment rule still bans, and the compliant word is currently the opt-in |
| `KanaGrid` | learned state becomes a ring around the cell, not a background fill — keeps the kana legible underneath |
| `EmptyState` | optional outline hanko as a quiet anchor |

`FillInput` carries **no mark** — it gets the quiet reveal described above. Note it has no feedback state at all today (it is pure input; the app owns the result), so this is a decision not to add judgment UI rather than a restyle of existing UI.

The other 14 get the standard pass with no mark work.

**Per-component loop** — the three-beat loop from the skill application map, run once per component:

1. **Explore** — `frontend-design` loop (palette/type step off) + `/impeccable shape <component>`. 2–3 variants as static HTML in `preview/_sandbox/`. Then the defaults test: *would this work equally well for any other flashcard app?* If yes it's a template answer — discard and go again. Budget two rounds; if round three isn't better, ship round two and move on.
2. **Build** — the chosen variant only. TSX in `src/components/`, then the JSX mirror in `ui_kits/mobile/components.jsx`, then the story.
3. **Gate** — all checks below.

Colour-dependent findings get logged, not fixed — they're revisited in one pass after Phase 5 rather than guessed at against a palette that's about to be replaced.

**Per-component gate — all of these must pass before the next component starts:**

- [ ] `pnpm typecheck` clean
- [ ] `npx impeccable detect src/components/<X>.tsx` — no new findings vs baseline
- [ ] Touch target ≥ 44px; `active:` state present; no hover-only affordance
- [ ] Visible keyboard focus ring; text contrast ≥ 4.5:1
- [ ] Renders at 375 / 768 / 1024 / 1440
- [ ] No gamification ornament; filled inline SVG icons only; no emoji
- [ ] **On the four mark components:** ○ / ✕ are glyphs, not icons — each needs an `aria-label`, and meaning must ride on **three channels** (glyph + color + text label), never the glyph alone. A screen reader must never receive a bare "circle".
- [ ] **No verdict prose anywhere:** "recalled" / "worth another look", never "correct" / "missed" / "wrong". Applies to all 18, not just the four.

Note that most gate items are palette-independent; the two that aren't (contrast, accent placement) are checked again in Phase 5 against the real palette. Passing them now against the outgoing palette is a smoke test, not the final word.

---

## Phase 3B — Close the gaps the drop left

**Branch:** `feat/close-gaps` · Runs inside Phase 3's three-beat loop, on the surfaces §2.6 identified as orphaned.

This is where the skills earn their place. Everything below is work the drop specified and didn't build, or didn't specify at all — and none of it needs another handoff.

**Not everything here needs a skill.** Reaching for a generative skill on a solved pattern is waste. Sorted by what it actually takes:

| Gap | How | Skill |
|---|---|---|
| `Badge` → scenario tag (`tag-bg`/`tag-fg`) | mechanical — apply the tokens `HANDOFF.md` already specified | none |
| `.hanko` → `--color-accent` | mechanical — one-line alias fix | none |
| `KanaKeyboard` `bg-fg` → `bg-inverse` | mechanical — right pixel, wrong role | none |
| Focus-ring split (`focus` / `focus-on-inverse`) | decided above; apply + verify with the contrast gate | none |
| `ProgressBar` completion cap (`progress-complete`) | small design call: does a finished bar cap in Ōgon, or is that ornament? | `/impeccable shape` |
| **Inverse chrome — `KanaKeyboard` first** — Sumi-iro ground, Ōgon hairline, `fg-on-inverse-2`, `shadow-key-on-inverse` | **real design work.** v3 designed a treatment and shipped no component wearing it. `KanaKeyboard` leads because the app actually imports it | `frontend-design` explore → `impeccable critique` |
| **Inverse chrome — `AppHeader` second** — same treatment, applied after the kana keyboard settles it | **`AppHeader` has zero importers in `../aburungo`** (verified 2026-08-07), alongside `PhraseCard` and `IconButton`. Doing the plan's most expensive design work on an unimported component is the wrong order. Either confirm it is meant for a shell that isn't built yet, or let `KanaKeyboard` establish the treatment and apply it here cheaply | reuse the `KanaKeyboard` result |
| **Scenario card** — `.emboss-bg` has no component owner | **real design work**, and the one surface where the pattern is sanctioned | `frontend-design` — this is its best target in the whole plan |
| Link treatment (`--color-link`) | solved pattern — don't design it, look it up | none — apply the standard link pattern |
| `border-focus` `#5c7aa8` | purpose unclear in v3 | decide an owner or delete the token |

**Sequencing note:** the two "real design work" rows are the only ones that go through the full explore beat with variants in `preview/_sandbox/`. The mechanical rows are done directly — running a generative skill over a one-line token fix is exactly the waste this plan is trying to avoid.

**Phase 3B acceptance:** the §2.6 orphan table has zero rows left without either an implementation or a written reason, and `docs/colors.md` records every correction made to the drop so it can be sent back as a diff rather than a complaint.

---

## Phase 4 — Flow mockups (static, in-repo)

**Branch:** `feat/flow-mockups` · **Static HTML/JSX only.** No routing, no state management, no Supabase — `CLAUDE.md` boundary. Real wiring happens in `../aburungo` later via `/handoff-to-app`.

### Scope cut 2026-08-07: one flow, then decide

This phase was **5 flows × 5 states = 25 mockups**. That is the largest single work item in the plan and the one with the least proven demand — `CLAUDE.md` forbids wiring them up here, so all 25 would sit waiting on `/handoff-to-app`, against 11 app pages that already exist and work. Twenty-five hand-maintained screens is also more of exactly the drift the plan calls "the second drift machine".

**Build one flow, all five states. Hand it off. Then decide about the rest.**

| # | Task | Done when |
|---|---|---|
| 4.1 | **Flashcard round** (`FlashcardPage`) — all five states: loading, empty, error, success, in-progress. Land in `ui_kits/mobile/screens.jsx` + `preview/` | 5 screens, each either present or not |
| 4.2 | `/handoff-to-app` and integrate into `../aburungo` | the flow is live in the app |
| 4.3 | **Decision gate** — record what the handoff actually changed. If mockups drove real improvements, do the next flow. If the app already covered it, stop here and design against the app directly | decision written into this plan with the evidence |

Flashcard round leads because it is the product's core loop and the surface `FlipCard`, `PhraseCard`, and `ScoreCard` all serve.

**The remaining four, if 4.3 says continue** — `Session start` (`LearnPage`, `PracticePage`), `Kana practice` (`KanaPage`, `KanaPracticePage`), `Pronunciation` (`ConversationPage`), `Progress` (`ProfilePage`).

**Note four app pages this phase never mapped:** `LandingPage`, `HowToPage`, `KanjiPage`, `WordsPage`. `WordsPage` is live vocabulary work. If flow mockups turn out to be worth continuing, that gap needs closing too — or the phase is only covering the pages it happened to think of.

---

## Phase 5 — Merge the v3 drop

**Branch:** `feat/palette-v3` · **No longer blocked** — the drop is in hand.

This is a **merge, not a copy.** The drop is ahead on tokens and assets and behind on components and `brand.css`, so `INTEGRATION.md`'s three `cp` commands are wrong for this repo (see ground truth above). Nothing gets overwritten wholesale.

| # | Task | Guard |
|---|---|---|
| 5.1 | Port v3's `@theme` block into `src/tokens.css`, **keeping** the card-animation tokens and keyframes (task 2.4b) | `FlipCard` still animates |
| 5.2 | Copy `assets/logo-a-tile.png`, `pattern-sakura.png`, `logo-a-128.png` | `.hanko` renders the ア |
| 5.3 | **Merge** v3's `brand.css` — take its `.hanko` / `.emboss-bg` updates, keep our `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame`, `.hanko.ink` | `brand.css` still exports all six utility groups; §3.0's maru survives |
| 5.4 | **Verify** the five component repaints from `HANDOFF.md` §4 — `Button` primary/secondary, focus rings on `Button`/`TextInput`/`IconButton`/`KanaGrid`, `ProgressBar` fill, `Badge` emphasised → scenario tag. The drop ships these five already repainted, so this is a diff review, not a hand-edit. **Do not apply §4 by hand** — 2.2 deliberately left these files untouched so the drop's versions land clean | each of the five matches §4; `Badge` is the known exception (§2.6 finding 1 — `HANDOFF.md` claims a repaint that was never made) |
| 5.5 | **Repaint the nine the drop doesn't ship.** Only `FillInput` has a legacy-token defect (`ring-brand-500` → red); the other eight are role-based already and just need verifying | `grep` for legacy tokens in `src/components/` returns nothing |
| 5.5b | **Apply the inverse-chrome treatment the drop designed but never built** — `AppHeader` and `KanaKeyboard` take `bg-inverse`, `rule-on-inverse`, `fg-on-inverse-2`, `shadow-key-on-inverse`. Fix `KanaKeyboard`'s `bg-fg` → `bg-inverse` while there | the four inverse roles have implementations |
| 5.5c | Build the rest of the orphan list from §2.6 — `progress-complete` cap on `ProgressBar`, `tag-bg`/`tag-fg` on `Badge` emphasis (**`HANDOFF.md` claims this shipped; it did not**) | orphan count reaches zero or each remainder has a written reason |
| 5.5d | Repoint `.hanko` from `var(--color-brand-500)` to `var(--color-accent)` so the brand mark stops depending on a deprecated alias | mark renders with legacy aliases removed |
| 5.6 | Migrate the deprecated `Button` `accent` variant to `primary` and drop it | no call sites remain |
| 5.7 | `pnpm build` — contrast gate runs against real v3 values | the seven known failures above are either fixed or explicitly accepted; **the focus-ring failure should be resolved with the palette author, not silently re-tinted** |
| 5.8 | `npx impeccable detect` + oxlint adherence — compare to baseline | no regression |
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
4. `.impeccable/baseline.json` + a CI gate that fails on regression
5. `preview/_sandbox/` — the variant workshop, where skill output gets tried before it gets shipped
6. 18 components passing the seven-point gate
7. A correctness vocabulary — ○ / ✕ across the four self-grading surfaces (quiet reveal where the app checks instead), plus the boundary rule that keeps it from becoming a badge
7b. Zero orphaned roles — every token v3 defines has an implementation or a written reason, and `docs/colors.md` carries the corrections as a diff to send back
8. One flow × five states in `ui_kits/` + `preview/`, handed off to the app, plus a written decision on whether the remaining four are worth building
9. A palette swap that is a one-file diff

---

## Explicitly out of scope

- **App-side work.** No changes in `../aburungo`. Flows ship as mockups; integration happens later via `/handoff-to-app`.
- ~~**New components.** 18 is enough.~~ **Amended 2026-08-07.** This exclusion was wrong in one specific way: the components that actually judge an answer in the shipped app — `FillBlankCard`, `GrammarClozeCard`, `KanaPracticePage` — were *not* design-system components, so §3.0's correctness vocabulary reached none of them. `AnswerResult` and `Maru` were added to close that (ADS #9, app #60). The library is now **20**. The exclusion otherwise stands: anything new is speculative until a flow mockup or a real consumer proves it's missing.
- **Killing the JSX mirrors.** `ui_kits/mobile/components.jsx` duplicating all 18 TSX components is a real drift machine and the obvious next cleanup, but consolidating it is its own project. Noted, deferred, not smuggled into this plan.
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
