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
