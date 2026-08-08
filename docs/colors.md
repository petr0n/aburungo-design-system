# AburunGo · color tokens · v3 "Zuihoden"

Five colors, one job each. Warm stone neutrals underneath. This file is the
rationale; `src/index.css` (Tailwind `@theme`) and `colors_and_type.css`
(vanilla mirror) are the implementations, and the three must stay in step.

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
| `stone-400` | `#A4A4A4` | Ishi-iro 石色 — placeholders. |
| `stone-500` | `#78736B` | Meta, hints. |
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

```css
--action            #1F3A66   primary button fill
--action-press      #16294a   its press state
--action-fg         #FFFDF8   text on primary
--action-2-bg       #eef6f4   secondary button fill      (Rokushō 50)
--action-2-fg       #33685e   secondary button text      (Rokushō 700)
--action-2-border   #b3d7cf   secondary button border    (Rokushō 200)
--accent            #D72E2E   the hanko. NOT a CTA.
--focus-ring        #C9A045   2px ring, every interactive element
--tag-bg            #f6ecd2   scenario tag background    (Ōgon 100)
--tag-fg            #8a6a2b   scenario tag text          (Ōgon 700)
--link              #33685e   links, deepening to Ai-iro on hover
--progress-track    #EFEDE5
--progress-fill     #4F9C8D   Rokushō
--progress-complete #C9A045   a finished bar caps with Ōgon
--bg-inverse        #2D2D2D   header band, keyboard frame
--rule-on-inverse   #8a6a2b   the Ōgon hairline on dark chrome
--fg-heading        #1F3A66   headings and JP content
```

## Feedback

Correctness banners only — never decorative tints.

| Token | Hex | Note |
|---|---|---|
| `success-bg` / `success-fg` | `#eef6f4` / `#33685e` | Rokushō. Correctness is the same green as progress, deliberately. |
| `error-bg` / `error-fg` | `#fbe3e1` / `#951e1e` | Akane. The second of its two jobs. |

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
| 1 | **Focus ring split.** `--color-focus` → Ōgon 700 `#8a6a2b`; new `--color-focus-on-inverse` → Ōgon 500 `#C9A045` | v3 routes every focus ring to Ōgon 500, which scores **2.26:1** on page ground, 2.40:1 on card, 2.08:1 on well — all under the 3:1 WCAG 2.1 SC 1.4.11 requires. Gold on warm paper is low-contrast by construction, so no single step clears both paper and near-black chrome. Splitting the role mirrors what v3 already does for borders (`border` / `rule-on-inverse`) and invents no new value |
| 2 | **`--color-tag-fg`** → Ōgon 800 `#654d1f` | v3 ships Ōgon 700 on Ōgon 100 at **4.27:1**, under the 4.5:1 for text. Ōgon 800 gives 6.77:1 |
| 3 | **`Badge` neutral repainted** to `bg-tag-bg text-tag-fg` | `HANDOFF.md` §4 item 5 states this shipped. It did not — the drop's own `Badge.tsx:23` still reads `bg-surface-2 text-fg-subtle`. Trust the code, not the table |
| 4 | **`--color-cream-deboss` preserved** | v3 aliases nearly every v2 name but not this one, and `brand.css` `.hanko.cream` draws its inset ring with it. A wholesale port breaks the mark |
| 5 | **Card animation tokens preserved** | v3 defines no `--animate-card-*` and no keyframes. `FlipCard` depends on both, and Tailwind does not error on a missing animation token — the class silently stops generating and the flip dies quietly |
| 6 | **`.hanko` repointed** from `var(--color-brand-500)` to `var(--color-accent)` (9 sites in `brand.css`) | `HANDOFF.md` calls legacy names "a migration bridge, not API". Retire them and the brand mark loses its fill |
| 7 | **Kana keyboard moved off Sumi-iro** to Rokushō 700 with warm-paper keys | v3 assigns both the header band and the keyboard frame to Sumi-iro, which puts two near-black slabs on one screen. Deep green gives the second colour block without competing with the band, and paper keys keep the kana legible. Four variants were rendered before choosing — `preview/_sandbox/kana-2-green.html` |
| 8 | **Card accents are a prop, not a fixed colour** | `PhraseCard` takes `accent` over the brand set (`ogon | ai | rokusho | akane | none`), driving the top rule and the scenario tag. Colour can then say *which scenario* rather than decorating. Decided by the palette author 2026-08-08: "the colors should be flexible" |
| 9 | **Akane is available as a card accent** | `colors.md` says Akane is the mark and errors, never a CTA. It is now also offered in the accent set. This overlap is deliberate and **unsettled** — a red thing elsewhere still means an error, so spend it where that is worth it. Recorded in PRODUCT.md as undecided |
| 10 | **Stale comments fixed** | `TextInput.tsx:8` said "focus ring is Akane" — it is Ōgon. `ProgressBar.tsx:5` said "solid fill in the Akane" — it is Rokushō |

## Resolved by the palette author, 2026-08-08

All three outstanding contrast failures are fixed. `scripts/check-contrast.mjs`
now passes **19/19** with an empty known-failures list.

| Was | Fix | Now |
|---|---|---|
| `progress-fill` on track **2.77:1** | **The locked-500 rule is unlocked for this role.** Rokushō 600 `#418176` replaces 500. No track value could work — the fill is mid-brightness, so a darker track moves *toward* it. See `preview/28-progress-contrast.html` | **3.87:1** |
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

## Role → what it means → v2 value today

| Role | Meaning | v2 resolves to | v3 will be |
|---|---|---|---|
| `--color-action` | primary button fill | `fg` (ink) | Ai-iro 藍色 |
| `--color-action-press` | its press state | `fg-muted` | Ai-iro 800 |
| `--color-action-fg` | label on primary | `fg-inverse` | warm paper |
| `--color-action-2-bg/-fg/-border/-press` | secondary button | paper / `fg-muted` / `border-strong` / `surface-2` | Rokushō 緑青 tints |
| `--color-accent` / `-press` / `-fg` | **the brand mark** | `brand-500` / `600` | Akane 茜色 — mark and errors, **never a CTA** |
| `--color-focus` | focus ring, light grounds | `brand-500` | Ōgon 700 `#8a6a2b` |
| `--color-focus-on-inverse` | focus ring, dark chrome | `brand-300` | Ōgon 500 `#C9A045` |
| `--color-tag-bg` / `-fg` | scenario tag | `surface-2` / `fg-subtle` | Ōgon 100 / 700 |
| `--color-link` | links | `brand-500` | Rokushō 700 `#33685e` |
| `--color-progress-track` / `-fill` / `-complete` | progress | `surface-2` / `brand-500` / `brand-500` | stone-100 / Rokushō / Ōgon |
| `--color-bg-inverse` | header band, keyboard frame | `fg` | Sumi-iro 墨色 |
| `--color-fg-inverse` / `--color-fg-on-inverse-2` | text on inverse chrome, primary / secondary | `fg-inverse` / `fg-faint` | warm paper `#FFFDF8` / Ishi-iro `#A4A4A4` |
| `--color-rule-on-inverse` | hairline on dark chrome | `fg-subtle` | Ōgon 700 |
| `--color-fg-heading` | headings, JP content | `fg` | Ai-iro |

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

| Role | Owner it should have | Lands in |
|---|---|---|
| ~~`bg-inverse`~~ → `inverse`, `rule-on-inverse`, `fg-on-inverse-2` | `AppHeader` **(built)**, `KanaKeyboard` still to come | Phase 3B / 5.5b |
| `progress-complete` | `ProgressBar` — does a finished bar cap in Ōgon, or is that ornament? | Phase 3B |
| `tag-bg` / `tag-fg` | `Badge` emphasis. **`HANDOFF.md` §4 claims this shipped; `Badge.tsx:23` is still `bg-surface-2 text-fg-subtle`. Trust the code** | Phase 5.5c |
| `link` | no component exists | Phase 3B — build one or record that the app applies it ad-hoc |
| `action`, `action-2-*`, `accent`, `fg-heading` | `Button`, `.hanko`, headings | Phase 5, with the repaint |
| `shadow-key-on-inverse` | `KanaKeyboard` | Phase 3B — not yet defined as a token either |
| `border-focus` `#5c7aa8` | unclear in v3, distinct from `focus` | decide an owner or delete it |

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
4.5:1 for text, 3:1 for non-text indicators. v2 scores 18/19 with one accepted
failure — `fg-faint` on card at 3.39:1, placeholders only.

**The incoming palette must beat that, not merely match it.** v3 was scored
ahead of the merge and fails seven checks, worst first: the Ōgon focus ring at
2.26:1 on page ground, 2.40:1 on card, 2.08:1 on well. The fix is already in
the palette — split the role, `focus` → Ōgon 700 and `focus-on-inverse` →
Ōgon 500, which is why both tokens exist above.
