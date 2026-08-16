# AburunGo · color tokens · v3 "Zuihoden"

Five colors, one job each. Warm stone neutrals underneath.

**This file is the rationale, not the values.** `src/tokens.css` is the single
source; `dist/tokens.plain.css` and the harness `@theme` blocks are generated
from it by `scripts/build-tokens.mjs`. Where this file names a colour it names
a **ramp step** ("Ōgon 500"), never a pasted hex — hexes here had drifted from
the token source in a dozen places by 2026-08-16, because a doc that repeats a
value has no way to know the value moved.

To see resolved values, open the storybook palette page or read
`dist/tokens.plain.css`. Both are generated.

## Where the palette comes from

Zuihōden is the lacquered mausoleum at Sendai — vermilion columns, ink-black
beams, gold leaf in the joinery, verdigris on the copper roof, all sitting on
weathered cedar. That is the whole palette: saturated color used **sparingly
and structurally**, against a warm, aged ground. Not a decorative theme. The
discipline is what carries over.

The previous system ran one purple accent across a cool zinc UI. It read
clinical — closer to a banking app than to anything Japanese. v3 keeps the
same restraint but changes what the restraint is made of.

## The five

| Color | Hex | Role — and only this role |
|---|---|---|
| **Akane** 茜色 | `#D72E2E` | The brand mark (the hanko) and error states. **Never a CTA.** |
| **Ai-iro** 藍色 | `#1F3A66` | Structure. Primary action, headings, Japanese content, chrome text. |
| **Rokushō** 緑青 | `#4F9C8D` | Progress, correctness, secondary action, links. |
| **Ōgon** 黄金 | `#C9A045` | Focus rings, scenario tags, hairlines on dark chrome. |
| **Sumi-iro** 墨色 | `#2D2D2D` | Inverse chrome — the header band and the kana keyboard frame. |

Each ramp runs 50–900 for component states; the **500 step is the locked brand
value** in every case. `#A4A4A4` (Ishi-iro 石色) sits at `stone-400` and
Sumi-iro at `stone-800`; both are locked too.

### The one rule people get wrong

**Akane is not the primary button.** It is the seal and the error state.
Reaching for red because it is the "brand color" is exactly the mistake this
table exists to prevent — primary action is Ai-iro. A red focus ring reads as
a validation failure, which is why focus is Ōgon.

## Warm stone — the neutrals

| Token | Hex | Where |
|---|---|---|
| `stone-0` | `#FFFDF8` | Cards. Warm paper white. |
| `stone-50` | `#F7F6F1` | Page ground. |
| `stone-100` | `#EFEDE5` | Input wells, mode pickers. |
| `stone-200` | `#E2DED2` | Default 1px border. |
| `stone-300` | `#CFC9B9` | Field edges, secondary-button border. |
| `stone-400` | `#A4A4A4` | Ishi-iro 石色 — non-text only: disabled fills, hairlines. |
| `stone-500` | `#6B665E` | Meta, hints, placeholders. Darkened from `#78736B` for AA. |
| `stone-600` | `#57534C` | Secondary text. |
| `stone-700` | `#403D38` | Keys on dark chrome. |
| `stone-800` | `#2D2D2D` | Sumi-iro 墨色 — inverse chrome. |
| `stone-900` | `#1A1815` | Deepest ink. |

The warmth is load-bearing, not decoration. Against a cool grey the Ai-iro
reads as a *tint of the surface*; against warm paper it reads as **ink on a
page**. This was the single change that moved the system from institutional to
lacquered, and it is the thing most likely to get "cleaned up" by someone who
thinks `#FFFDF8` is a mistake for `#FFFFFF`. It is not.

## Role tokens — prefer these over raw ramp steps

**Ramp steps, not hexes.** This table names the step each role points at. It
used to carry hand-copied hex values and drifted from `src/tokens.css` in seven
places at once — the vibrancy pass retuned several tints and no one came back
here. A step name survives a retune; a pasted hex does not. For resolved
values, read `dist/tokens.plain.css` or the storybook palette page, both
generated from the token source.

| Role | Points at | Notes |
|---|---|---|
| `--action` | Ai-iro 500 | primary button fill |
| `--action-press` | Ai-iro 700 | its press state |
| `--action-fg` | stone-0 | text on primary |
| `--action-2-bg` | Rokushō 100 | secondary button fill |
| `--action-2-fg` | Rokushō 700 | secondary button text — raw `#33685e` |
| `--action-2-border` | Rokushō 500 | secondary button border |
| `--accent` | Akane 500 | the hanko. **NOT a CTA** — see the open question below |
| `--focus` | **Ōgon 500** | 2px ring, light grounds. Settled — see below |
| `--focus-on-inverse` | **Ōgon 500** | 2px ring, dark chrome |
| `--tag-bg` | Ōgon 200 | scenario tag background |
| `--tag-fg` | Ōgon 800 | scenario tag text (correction 2) |
| `--link` | Rokushō 700 | raw `#33685e`; 500 is 3.00:1 and fails AA as text |
| `--progress-track` | stone-0 | |
| `--progress-fill` | Rokushō 500 | |
| `--inverse` | Sumi-iro | header band. **Renamed** from `--bg-inverse` — see below |
| `--rule-on-inverse` | Ōgon 700 | the hairline on dark chrome |
| `--fg-heading` | Ai-iro 500 | headings and JP content |

One deviation from the drop in that block: `--progress-complete` is **gone** —
`ProgressBar.tsx`'s anti-goal already ruled out changing colour at 100%, so the
token described a behaviour this system had rejected.

## Feedback

Correctness banners only — never decorative tints.

| Token | Points at | Note |
|---|---|---|
| `success-bg` / `success-fg` | Rokushō 100 / Rokushō 800 | Correctness is the same green as progress, deliberately. |
| `error-bg` / `error-fg` | Akane 100 / Akane 800 | Akane. The second of its two jobs. |

## Legacy names

Every v1 (`zinc-*`, purple `brand-*`) and v2 (`ink`, `mist`, `paper`, `rose`,
`dusk`, `line`, plum `brand-*`) token still resolves, remapped onto v3 values,
so existing markup does not break. `--rose` now points at Ōgon and `--dusk` at
Ishi-iro. Prefer the role tokens above in anything new; treat the legacy names
as a migration bridge, not as API.


---

# Corrections applied to the v3 drop

Send these back as a diff, not a complaint. Every one is either already in the
palette or a defect in the drop's own documentation.

| # | Correction | Why |
|---|---|---|
| 1 | ~~**Focus ring split.** `--color-focus` → Ōgon 700~~ — **WITHDRAWN 2026-08-13** | Proposed because Ōgon 500 scores 2.26:1 on page ground, under the 3:1 WCAG 2.1 SC 1.4.11 asks of a non-text indicator. The palette author reviewed the rendered options and **kept Ōgon 500 on both grounds**: Ōgon 700 is browner and darker and stops reading as gold, which is the whole reason the colour is in the palette. The two tokens still exist so the role *can* split later, but today both resolve to Ōgon 500. The contrast gate carries this as a written exception, not a silent pass. **Do not reopen** |
| 2 | **`--color-tag-fg`** → Ōgon 800 | Applied 2026-08-13. On our `tag-bg` (Ōgon 200, not the Ōgon 100 the drop's numbers assumed) Ōgon 700 scores 3.60:1 against a 4.5 bar; Ōgon 800 gives 5.71:1 |
| 3 | **`Badge` neutral repainted** to `bg-tag-bg text-tag-fg` | `HANDOFF.md` §4 item 5 states this shipped. It did not — the drop's own `Badge.tsx:23` still reads `bg-surface-2 text-fg-subtle`. Trust the code, not the table |
| 4 | **`--color-cream-deboss` preserved** | v3 aliases nearly every v2 name but not this one, and `brand.css` `.hanko.cream` draws its inset ring with it. A wholesale port breaks the mark |
| 5 | **Card animation tokens preserved** | v3 defines no `--animate-card-*` and no keyframes. `FlipCard` depends on both, and Tailwind does not error on a missing animation token — the class silently stops generating and the flip dies quietly |
| 6 | **`.hanko` repointed** from `var(--color-brand-500)` to `var(--color-accent)` (9 sites in `brand.css`) | `HANDOFF.md` calls legacy names "a migration bridge, not API". Retire them and the brand mark loses its fill |
| 7 | **Kana keyboard moved off Sumi-iro** to Rokushō 700 with warm-paper keys | v3 assigns both the header band and the keyboard frame to Sumi-iro, which puts two near-black slabs on one screen. Deep green gives the second colour block without competing with the band, and paper keys keep the kana legible. Four variants were rendered before choosing — `preview/_sandbox/kana-2-green.html` |
| 8 | **Card accents are a prop, not a fixed colour** | `PhraseCard` takes `accent` over the brand set (`ogon | ai | rokusho | akane | none`), driving the top rule and the scenario tag. Colour can then say *which scenario* rather than decorating. Decided by the palette author 2026-08-08: "the colors should be flexible" |
| 9 | **Akane is available as a card accent** | `colors.md` says Akane is the mark and errors, never a CTA. It is now also offered in the accent set. This overlap is deliberate and **unsettled** — a red thing elsewhere still means an error, so spend it where that is worth it. Recorded in PRODUCT.md as undecided |
| 10 | **Stale comments fixed** | `TextInput.tsx:8` said "focus ring is Akane" — it is Ōgon. `ProgressBar.tsx:5` said "solid fill in the Akane" — it is Rokushō |

## Resolved by the palette author, 2026-08-08

Three contrast failures were fixed here. `scripts/check-contrast.mjs` reads
**24/27** today, with three written exceptions — all of them the Ōgon focus
ring, kept deliberately (correction 1 above).

| Was | Fix | Now |
|---|---|---|
| `progress-fill` on track **2.77:1** | Rokushō 600 `#418176` replaced 500. **Later reverted:** the vibrancy pass put `progress-fill` back to Rokushō 500 and moved `progress-track` to stone-0, which clears the ratio without dulling the green. See `preview/28-progress-contrast.html` | **3.19:1** |
| `fg-faint` (placeholder) **2.30:1** | Ishi-iro `#A4A4A4` is too light to read as text. The **role** moves to `stone-500`; Ishi-iro stays at `stone-400` for non-text use — disabled fills, hairlines | **5.26:1** |
| `fg-subtle` on well **4.01:1** | `stone-500` darkened `#78736B` → `#6B665E`, keeping the warm hue. Fixes this and carries the placeholder role above | **4.86:1** |

`--color-fg-subtle` and `--color-fg-faint` now both reference `--color-stone-500`
rather than carrying their own hex, so the ramp stays the single place a
neutral is defined.

# The semantic contract (Phase 2)

Added 2026-08-07. Everything above documents *values*; this section documents
*roles*. Components reference roles. A palette swap edits the values above and
the role targets in `src/tokens.css`, and stops there — no role name changes,
no component changes, no preview edits.

## Role → what it means

The migration is done, so this table no longer carries values. It used to have
a "v2 resolves to" and a "v3 will be" column, which meant every value appeared
in two places and went stale in both. **Values live in the role table at the top
of this file**; this one is the contract — what each role *means*, which is the
part that must not change when the palette does.

| Role | Meaning |
|---|---|
| `--color-action` / `-press` / `-fg` | primary button fill, its press state, its label |
| `--color-action-2-bg` / `-fg` / `-border` | secondary button |
| `--color-accent` / `-fg` | **the brand mark** — and errors. **Never a CTA** |
| `--color-focus` | focus ring, light grounds |
| `--color-focus-on-inverse` | focus ring, dark chrome |
| `--color-tag-bg` / `-fg` | scenario tag |
| `--color-link` | links |
| `--color-progress-track` / `-fill` | progress |
| `--color-inverse` | header band |
| `--color-fg-inverse` / `--color-fg-on-inverse-2` | text on inverse chrome, primary / secondary |
| `--color-rule-on-inverse` | hairline on dark chrome |
| `--color-fg-heading` | headings, JP content |

**Disabled is not a colour.** `opacity-40` on a filled control, `opacity-50` on
a hairline one. It composes with every variant and survives a palette change
untouched, which a `--color-disabled` would not.

## Value-token holdouts (task 2.1)

Seven references to value tokens remain. One was converted; six are deliberate.

| Component | Reference | Status |
|---|---|---|
| `FillInput` ×2 | `ring-brand-500` → `ring-focus` | **converted** (2.2) — it is repo-only, so the drop will never repaint it |
| `Button`, `TextInput`, `IconButton`, `KanaGrid` | `ring-brand-500` | **left alone on purpose.** The v3 drop ships these already repainted; task 5.4 verifies its versions land clean. Hand-editing them now would create a conflict for no gain |
| `ProgressBar` | `bg-brand-500` | same — the drop repaints it |

## Orphaned roles (task 2.6)

Roles now defined with **no component using them**. Defining a token is not
implementing it; this is the list that stops v3's design intent from arriving
as a token and silently never getting built.

**Re-audited 2026-08-10 against both repos** — this repo *and* `../aburungo`,
which imports `src/tokens.css` and so can consume any role as a utility. Checking
only this repo was the original mistake; a control grep (`fg-subtle` → 177 hits
in the app) confirms a zero here means zero.

| Role | Owner it should have | Status |
|---|---|---|
| ~~`bg-inverse`~~ → `inverse`, `rule-on-inverse`, `fg-on-inverse-2` | `AppHeader`, `KanaKeyboard` | ✅ **both built** — `AppHeader.tsx:38`, and `KanaKeyboard` wears the Rokushō slab |
| `tag-bg` / `tag-fg` | `Badge` emphasis | ✅ **shipped.** This row used to say `Badge.tsx:23` was still `bg-surface-2 text-fg-subtle` and to trust the code over `HANDOFF.md`. The code has since caught up: `ui/Badge.tsx:27` and `PhraseCard.tsx:37` |
| `action`, `action-2-*`, `accent`, `fg-heading` | `Button`, `.hanko`, headings | ✅ **done** — 3 / 1 / 4 / 1 component files. `.hanko` fills `var(--color-accent)`, closing plan task 5.5d |
| `link` | no component | ⚠️ **kept, and justified.** Used once, in `ui_kits/flows/main.tsx:39`, nowhere in the package or the app. **Not a candidate for deletion:** Rokushō 500 is 3.00:1 on the page and fails AA as text, so `#33685e` is Rokushō darkened to 5.91:1. That reason now lives beside the token and is gated by `check-contrast.mjs`, so it cannot be tidied back into an alias |
| `shadow-key-on-inverse` | `KanaKeyboard` key treatment | ⚠️ **queued, not orphaned.** The token now exists; the key treatment is the remaining piece of the inverse-chrome work. **Trigger: the `KanaKeyboard` key-shadow pass in Phase 3B.** Delete it if that pass is dropped |
| ~~`progress-complete`~~ | `ProgressBar` | 🗑️ **deleted 2026-08-11 — the decision already existed.** This was filed as an open taste call ("does a finished bar cap in Ōgon, or is that ornament?") and queued for a render-and-look. That was wrong: `ProgressBar.tsx`'s anti-goal already says it *"does not celebrate milestones, change colour at 100%"*, and `CLAUDE.md` bans reward-loop ornaments. Per doc precedence — **code beats plan** — the component had answered it. The token was the drop's design intent for a rule this system had already rejected. Reinstating means changing the anti-goal first, on purpose |
| ~~`border-focus` `#5c7aa8`~~ | — | 🗑️ **deleted 2026-08-10.** An off-palette blue that appears nowhere in Zuihoden, carried from v2, unused in both repos. v3's ring is `--color-focus` |

`KanaKeyboard` currently reaches for `bg-fg` where it means `bg-inverse` — the
right pixel from the wrong role. Correct today because body text and inverse
chrome are the same value; wrong the moment v3 makes them diverge.

### Correction sent back to the drop: `--color-bg-inverse` → `--color-inverse`

The drop names the role `--color-bg-inverse`. Tailwind v4 builds a utility from
whatever follows `--color-`, so that token yields `bg-bg-inverse` and **no
`bg-inverse` at all**. `AppHeader` asked for `bg-inverse`, got nothing, and
rendered a transparent band with near-white `fg-inverse` text on the page
ground — an invisible title, and no error anywhere: not in `typecheck`, not in
`lint`, not in the contrast gate, which reads tokens rather than utilities.

It survived because the sandbox pages that approved the treatment
(`preview/_sandbox/vibrancy-1-before-after.html`,`kana-2-green.html`) use
`var(--bg-inverse)` — the plain CSS alias, which resolved fine. The utility and
the variable disagreed and only the variable was ever rendered.

Renamed here to `--color-inverse`, which generates `bg-inverse` as written.
Found by putting `AppHeader` on a screen (`ui_kits/flows/`), not by any check.

### The focus ring — SETTLED 2026-08-13, do not reopen

**`--color-focus` and `--color-focus-on-inverse` are both Ōgon 500 `#C9A045`.**

WCAG 2.1 SC 1.4.11 asks **3:1** of a non-text indicator. Ōgon 500 does not
reach it on any light ground:

| Ring | Page `#F7F6F1` | Card `#FFFDF8` | Well `#EFEDE5` | Worst |
|---|---|---|---|---|
| **Ōgon 500 `#C9A045`** — shipped | 2.26 | 2.40 | 2.08 | **2.08** |
| Ōgon 600 `#ab8639` | 3.13 | 3.33 | 2.89 | 2.89 |
| Ōgon 700 `#8a6a2b` | 4.65 | 4.95 | 4.29 | 4.29 |

**The palette author kept Ōgon 500 anyway**, from rendered comparisons, on
2026-08-13. Ōgon 700 clears the ratio but is browner and darker and stops
reading as gold — and gold on warm paper is low-contrast by construction, so
every option that clears 3:1 costs the colour its warmth. The ratio lost to the
palette on purpose.

The three shortfalls are carried in `check-contrast.mjs` as `KNOWN` entries with
that reason written beside them, so the gate reads **24/27** rather than hiding
them. On the Sumi-iro band the same value scores 5.64:1 and passes.

**Three alternatives have been offered and declined** — Ōgon 700, Ōgon 600 plus
a darkened `--color-surface-2`, and a two-tone gold-plus-hairline ring. Do not
offer a fourth. The two tokens stay separate so the role *can* split later
without a rename.

**What it unblocked.** The focus rings in `../aburungo` were `ring-brand-500`,
which resolves to Akane — a focused input drawn in the error colour
(`docs/todo.md` 4a). With the ring settled they can be repointed to `ring-focus`
without trading a semantic bug for a contrast one.

## Where the colour goes — decided 2026-08-08

**The card body carries the accent. The page ground does not.**

The palette was landing as hairlines: a 3px card rule, a tag pill, coloured
type, one solid button. Every large surface stayed warm white. The kana
keyboard was the proof — the only screen that read as colourful, and the only
one with a large colour field.

Three options were rendered across four screens and reviewed by the palette
author:

| | Where colour lands | Outcome |
|---|---|---|
| A | edges only — the shipped treatment | control |
| B | **the card body**, at the accent's 100 step | **chosen** |
| C | the page ground and the header band | not chosen |

B keeps the header band Sumi-iro, so a screen still has exactly one dark slab,
and it makes the scenario legible across a whole surface rather than in a
badge.

Implemented as a fourth member of the accent set — `--color-accent-<hue>-bg`
alongside `-<hue>` and `-<hue>-fg` — so a card's accent stays one input.
`Card` gained `tone="bare"` for it: two `bg-*` utilities on one element have
equal specificity, so which wins depends on stylesheet order rather than the
order they are written, and `PhraseCard` takes the background off rather than
racing it.

Applied to every content surface, not just `PhraseCard`: `AnswerResult`'s
reveal block moved off `surface-2` for the same reason — it holds Japanese, and
Ai-iro is the Japanese-content colour. `ScoreCard` gained `tone`, and the round
summary uses Rokushō: the end of a round is the one moment a screen is allowed
to be emphatic, and it was the most colourless screen in the product.

Text holds on all four grounds — Ai-iro headings 8.9–9.6:1, Sumi-iro body
10.9–11.7:1, Rokushō readings 5.0–5.4:1. `fg-subtle` on the Ai ground lands at
4.49:1 against a 4.5 target; left alone deliberately rather than dulling the
palette over 0.01.

## Correct/incorrect vs success/error (task 2.3b)

**Decision: they stay the same tokens. No separate `--color-correct`.**

v3 gives them identical hexes and the split would be nominal. The argument for
splitting is that a future change to error styling would silently restyle study
grading — but that coupling is *correct here*: "not quite" **is** the error
state of an answer, and `AnswerResult` deliberately renders the same treatment
for both. Two names for one value invites them to drift apart by accident,
which is the failure this repo keeps having.

Revisit if a non-grading error ever needs to look different from a wrong
answer. Today none exists.

## The gate

`scripts/check-contrast.mjs` runs on every build (`pnpm lint`). WCAG 2.1 AA:
4.5:1 for text, 3:1 for non-text indicators.

**v3 reads 24/27**, with three accepted failures — all of them the Ōgon focus
ring on light grounds, kept deliberately by the palette author. Each carries its
reason in the `KNOWN` map beside the check, so an exception has to be argued in
writing rather than added silently.

The gate covers composited grounds too — text on the crest pattern, and text on
`.glass` over the crest pattern — because flat token maths cannot see what a
`backdrop-filter` does to the surface underneath. Those numbers come from
rendering the page and reading pixels back, not from the token values.
