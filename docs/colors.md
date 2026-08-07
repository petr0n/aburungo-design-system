# AburunGo · color tokens

Locked from your swatch (`uploads/aburungo.png`), plus a small number of derived tokens needed for the system to hang together (off-white background, ink tints for secondary text, border tones). Every derived value is called out below.

## Brand

| Token                      | Hex       | RGB             | Role                                                                                                     |
| -------------------------- | --------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| `--brand`                  | `#753686` | `117, 54, 134`  | Primary action. The maru. Scenario tags. Focus rings. Brand-fill surfaces. Used liberally per direction. |
| `--brand-press`            | `#662e75` | `102, 46, 117`  | Active / press state on brand-colored surfaces.                                                          |
| `--brand-tint` _(derived)_ | `#efe5f1` | `239, 229, 241` | Brand-tinted surface for promotional callouts that need warmth without going full brand.                 |

## Ink (text + heavy surfaces)

| Token                 | Hex       | RGB            | Role                                                                                                   |
| --------------------- | --------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| `--ink`               | `#150918` | `21, 9, 24`    | Primary text. Body. Headings. Sits naturally next to brand purple without clashing (shared undertone). |
| `--ink-2` _(derived)_ | `#3a2540` | `58, 37, 64`   | Secondary text. Captions. Supporting copy. Kana reading beneath JP phrase.                             |
| `--ink-3` _(derived)_ | `#6a5470` | `106, 84, 112` | Tertiary text on light surfaces. Placeholders. Hint copy.                                              |

## Surfaces

| Token                      | Hex       | RGB             | Role                                                                           |
| -------------------------- | --------- | --------------- | ------------------------------------------------------------------------------ |
| `--paper`                  | `#ffffff` | `255, 255, 255` | Default surface. Cards. App background. Print stock. Pure white per direction. |
| `--paper-warm` _(derived)_ | `#faf7f9` | `250, 247, 249` | Slightly warm off-white. Page background where pure white feels too clinical.  |
| `--mist`                   | `#ebe5e9` | `235, 229, 233` | Subtle surface. Input wells. Mode pickers. Secondary buttons. Neutral ground.  |

## Accents

| Token    | Hex       | RGB             | Role                                                                                                   |
| -------- | --------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `--rose` | `#e6bbd7` | `230, 187, 215` | Inverse accent. The maru on ink/brand backgrounds. Selection highlight. Underlines on dark OG.         |
| `--dusk` | `#a6799b` | `166, 121, 155` | Tertiary text / decorative. Meta labels. Kickers. Vertical katakana sidebar. Dashed dividers in print. |

## Borders

| Token                  | Hex       | RGB             | Role                                                        |
| ---------------------- | --------- | --------------- | ----------------------------------------------------------- |
| `--line` _(derived)_   | `#e3d9de` | `227, 217, 222` | Default 1px border. Reads neutrally on both paper and mist. |
| `--line-2` _(derived)_ | `#ece3e8` | `236, 227, 232` | Lighter border for nested divisions inside cards.           |

## Semantic (feedback)

Unchanged from the original design system. Surfaces feedback only — never decorative.

| Token         | Hex       | RGB             | Role                           |
| ------------- | --------- | --------------- | ------------------------------ |
| `--green-50`  | `#f0fdf4` | `240, 253, 244` | Correctness banner background. |
| `--green-500` | `#22c55e` | `34, 197, 94`   | Correctness icon / accent.     |
| `--green-700` | `#15803d` | `21, 128, 61`   | Correctness banner text.       |
| `--red-50`    | `#fef2f2` | `254, 242, 242` | Error banner background.       |
| `--red-500`   | `#ef4444` | `239, 68, 68`   | Error icon / accent.           |
| `--red-700`   | `#b91c1c` | `185, 28, 28`   | Error banner text.             |

---

## Provenance

**From your swatch (6 colors):**
`--brand`, `--brand-press`, `--ink`, `--mist`, `--rose`, `--dusk`

**Derived for the system:**
`--brand-tint`, `--ink-2`, `--ink-3`, `--paper-warm`, `--line`, `--line-2`

The derived tokens are needed because a brand palette without a secondary-text color, a border tone, and a soft background doesn't produce real UI — it produces six rectangles. Each derived value sits in the same hue family as a swatched color (purple-tinted neutrals, not zinc-neutral) so the whole interface reads of-a-piece.

---

## Drop-in CSS

```css
:root {
  /* Brand */
  --brand: #753686;
  --brand-press: #662e75;
  --brand-tint: #efe5f1; /* derived */

  /* Ink */
  --ink: #150918;
  --ink-2: #3a2540; /* derived */
  --ink-3: #6a5470; /* derived */

  /* Surfaces */
  --paper: #ffffff;
  --paper-warm: #faf7f9; /* derived */
  --mist: #ebe5e9;

  /* Accents */
  --rose: #e6bbd7;
  --dusk: #a6799b;

  /* Borders */
  --line: #e3d9de; /* derived */
  --line-2: #ece3e8; /* derived */

  /* Semantic — unchanged from original system */
  --green-50: #f0fdf4;
  --green-500: #22c55e;
  --green-700: #15803d;
  --red-50: #fef2f2;
  --red-500: #ef4444;
  --red-700: #b91c1c;
}
```

---

## Where each color does what, by surface

| Surface                     | `--brand`               | `--ink`   | `--mist` | Accent                 |
| --------------------------- | ----------------------- | --------- | -------- | ---------------------- |
| **Primary button**          | fill                    | —         | —        | —                      |
| **Secondary button**        | —                       | text      | fill     | —                      |
| **The maru**                | fill (on paper/mist)    | —         | —        | `--rose` on dark/brand |
| **Scenario tag**            | text                    | —         | —        | —                      |
| **Body text**               | —                       | fill      | —        | —                      |
| **Caption text**            | —                       | `--ink-2` | —        | —                      |
| **Card border**             | —                       | —         | —        | `--line`               |
| **Input well**              | —                       | text      | fill     | —                      |
| **Focus ring**              | fill (2px outset)       | —         | —        | —                      |
| **Correctness banner**      | —                       | —         | —        | `--green-*`            |
| **Error banner**            | —                       | —         | —        | `--red-*`              |
| **OG card hero**            | full fill (one variant) | —         | —        | —                      |
| **Print footer / colophon** | —                       | text      | —        | `--dusk` for meta      |

---

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
| `--color-fg-on-inverse` / `-2` | text on inverse | `fg-inverse` / `fg-faint` | warm paper / Ishi-iro |
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
| `bg-inverse`, `rule-on-inverse`, `fg-on-inverse-2` | `KanaKeyboard` first, then `AppHeader` | Phase 3B / 5.5b |
| `progress-complete` | `ProgressBar` — does a finished bar cap in Ōgon, or is that ornament? | Phase 3B |
| `tag-bg` / `tag-fg` | `Badge` emphasis. **`HANDOFF.md` §4 claims this shipped; `Badge.tsx:23` is still `bg-surface-2 text-fg-subtle`. Trust the code** | Phase 5.5c |
| `link` | no component exists | Phase 3B — build one or record that the app applies it ad-hoc |
| `action`, `action-2-*`, `accent`, `fg-heading` | `Button`, `.hanko`, headings | Phase 5, with the repaint |
| `shadow-key-on-inverse` | `KanaKeyboard` | Phase 3B — not yet defined as a token either |
| `border-focus` `#5c7aa8` | unclear in v3, distinct from `focus` | decide an owner or delete it |

`KanaKeyboard` currently reaches for `bg-fg` where it means `bg-inverse` — the
right pixel from the wrong role. Correct today because body text and inverse
chrome are the same value; wrong the moment v3 makes them diverge.

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
