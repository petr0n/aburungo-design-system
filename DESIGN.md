---
name: AburunGo Design System
description: A quiet, adult study tool — calm structure with warmth held in reserve.
colors:
  brand: "#753686"
  brand-press: "#662e75"
  brand-tint: "#efe5f1"
  ink: "#150918"
  ink-muted: "#3a2540"
  ink-subtle: "#6a5470"
  ink-faint: "#a6799b"
  paper: "#ffffff"
  paper-warm: "#faf7f9"
  mist: "#ebe5e9"
  cream: "#f5eee7"
  line: "#e3d9de"
  line-strong: "#d9c8b8"
  recalled: "#22c55e"
  recalled-bg: "#f0fdf4"
  recalled-fg: "#15803d"
  review: "#ef4444"
  review-bg: "#fef2f2"
  review-fg: "#b91c1c"
typography:
  display:
    fontFamily: "Noto Sans, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "2.5rem"
  headline:
    fontFamily: "Noto Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "1.875rem"
  title:
    fontFamily: "Noto Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.625rem"
  body:
    fontFamily: "Noto Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label:
    fontFamily: "Noto Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
  japanese:
    fontFamily: "M PLUS Rounded 1c, Hiragino Kaku Gothic ProN, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: "1.75rem"
  japanese-prompt:
    fontFamily: "M PLUS Rounded 1c, Hiragino Kaku Gothic ProN, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: "3rem"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
  full: "9999px"
spacing:
  base: "0.25rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    height: "44px"
  button-primary-active:
    backgroundColor: "{colors.brand-press}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    height: "44px"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    height: "44px"
  card-review:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
  badge-tag:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink-subtle}"
    rounded: "{rounded.full}"
---

# Design System: AburunGo Design System

> **Palette in migration — and v3 is a different model, not a recolour.**
>
> The frontmatter above is the current **v2** palette: one purple accent on cool neutrals. **v3 "Zuihoden"** is reviewed and accepted but not merged (plan Phase 5). It replaces one-accent-monochrome with **five colours, one job each**, on a warm stone ground:
>
> | Colour | Job — and only this job |
> |---|---|
> | Akane 茜色 `#D72E2E` | The hanko and error states. **Never a CTA.** |
> | Ai-iro 藍色 `#1F3A66` | Primary action, headings, Japanese content, chrome text. |
> | Rokushō 緑青 `#4F9C8D` | Progress, correctness, secondary action, links. |
> | Ōgon 黄金 `#C9A045` | Focus rings, scenario tags, hairlines on dark chrome. |
> | Sumi-iro 墨色 `#2D2D2D` | Inverse chrome — header band, kana keyboard frame. |
>
> Ground becomes warm stone: page `#F7F6F1`, cards `#FFFDF8`. **The warmth is load-bearing** — `#FFFDF8` is not a mistake for `#FFFFFF`, and "cleaning it up" to pure white is the specific way v3 predicts it will get broken.
>
> **What this means for the prose below:** the *principles* survive the swap and the *counts* do not. Where a rule says "the accent", read "the role". Do not enforce one-accent-monochrome against v3 work — Phase 3B deliberately puts colour on links, tags, progress, and inverse chrome. Regenerate the frontmatter after the merge; do not rewrite the rules.

## Overview

**Creative North Star: "Quiet form, warm intelligence"**

AburunGo is a beautifully made adult study object — a Muji notebook, a Leica body, a language textbook designed by people with taste. The system's default state is calm, structured, and confident enough not to perform. It is a tool for someone who wants to use the language, not be cheered at.

The warmth is real but held in reserve. Personality enters through writing, pacing, and a small number of chosen accent moments — never through structure. The governing tension: **the interface should look more serious than the copy sounds.** An interface that reads as playful has taken the charm out of the words and put it in the furniture, which is the wrong place for it.

Restraint here is load-bearing rather than stylistic. Whitespace is what makes a colour moment land; if colour is everywhere, nothing is emphasised. Colour appears only where it marks what something is *for* — which under v2 means a single accent, and under v3 means five roles used just as sparingly.

**Key Characteristics:**
- Calm, structured, adult — no cheerleading, no reward loop
- Colour used sparingly and structurally — every hue has a job, none decorate
- Touch-first, mobile-primary, ≥44px targets throughout
- Flat surfaces; depth conveyed by tone, not shadow
- Bilingual by construction — Latin and Japanese type are separate systems, tuned separately
- Charm lives in empty states and progress language, never in navigation or structure

**Anti-references (confirmed):** mascot-first products, kawaii or cartoon UI, candy-coloured gamification, tourist-Japan iconography, generic startup minimalism, austere luxury, exam-prep institutional design.

## Colors

**This section documents the current v2 palette.** A purple-undertone neutral system with one accent and one pair of feedback colours. The neutrals are deliberately not pure grey — the ink carries a purple undertone so it sits with the brand rather than beside it. v3 replaces this wholesale; see the migration note above.

### Primary
- **Plum** (`#753686`): the v2 accent. It appears on primary actions and focus rings. It is not a decorative colour and never fills a large surface at full strength. (Under v3 this role splits: primary action becomes Ai-iro, focus becomes Ōgon, and the mark becomes Akane.)
- **Plum Press** (`#662e75`): the pressed state of any plum surface. Touch-first means press states are required, not optional.
- **Plum Tint** (`#efe5f1`): quiet tinted backing for badges and callouts, where full-strength plum would shout.

### Neutral
- **Ink** (`#150918`): primary text. Near-black with a purple cast.
- **Ink Muted** (`#3a2540`): secondary text, supporting copy, the label on a secondary button.
- **Ink Subtle** (`#6a5470`): tertiary text, captions, metadata.
- **Ink Faint** (`#a6799b`): placeholders only. Not for content — it does not meet contrast for body text.
- **Paper** (`#ffffff`) / **Paper Warm** (`#faf7f9`): card and page grounds.
- **Mist** (`#ebe5e9`): wells, inset surfaces, unselected states.
- **Cream** (`#f5eee7`): the warm stage — letterhead moments and hero surfaces where paper would read clinical.
- **Line** (`#e3d9de`) / **Line Strong** (`#d9c8b8`): hairline dividers and input strokes.

### Feedback
Reserved exclusively for answer correctness. These are the only colours in the system that carry a judgment.

- **Recalled** (`#22c55e`, on `#f0fdf4` with `#15803d` text): the ○ maru and its banner.
- **Review** (`#ef4444`, on `#fef2f2` with `#b91c1c` text): the ✕ batsu and its banner.

### Named Rules

**The Structural Colour Rule.** Colour is used sparingly and *structurally* — it marks what a thing is for, never decorates. If a surface needs emphasis and no role applies, the answer is space or weight, not hue.

Under the **current v2 palette** that resolves to a single accent on CTAs, focus rings, and the mark. Under **incoming v3** the same discipline is spread across five colours with one job each. The rule survives; the count does not. Do not restate this as "one accent, nowhere else" — see the migration note at the top of this file.

**The Reserved Feedback Rule.** Green and red exist only to mark an answer. They never indicate status, category, priority, or availability. A learner must be able to trust that a red thing means *they got something wrong*, not that a server is down.

**The No Raw Value Rule.** Components reference role tokens, never hexes. Enforced by `scripts/check-adherence.mjs`, which fails the build.

## Typography

**Body Font:** Noto Sans (variable, shipped locally) — all English UI.
**Japanese Font:** M PLUS Rounded 1c (with Hiragino Kaku Gothic ProN, Yu Gothic fallbacks) — all Japanese content.
**Mono:** system stack — token values and specimen captions only.

**Character:** Noto Sans is neutral to the point of self-effacing, which is exactly right for chrome that should not compete with the material. M PLUS Rounded 1c carries the warmth — its softened terminals keep Japanese from reading as clinical or examlike without tipping into cute. The pairing is the brand tension in miniature: a plain, serious Latin frame around warm, generous Japanese.

### Hierarchy
- **Display** (700, 36px/40px): landing and hero moments only. Rare.
- **Headline** (600, 24px/30px): screen titles.
- **Title** (600, 20px/26px): card and section headings.
- **Body** (400, 16px/24px): default reading size.
- **Body Small** (400, 14px/20px): supporting copy.
- **Label** (500, 12px/16px): metadata, tags, captions.
- **Japanese** (400, 18px/28px): JP body and readings — larger than Latin body at the same optical weight.
- **Japanese Prompt** (500, 32px/48px): the phrase under study. The most important text in the product.

### Named Rules

**The Japanese Gets More Air Rule.** JP line-heights run substantially looser than their Latin equivalents at the same size (28px on 18px; 48px on 32px). Kanji density and furigana both need the room. Never apply a Latin line-height to Japanese text.

**The Prompt Is The Product Rule.** On any study surface, the Japanese phrase is the largest element on screen. Chrome, labels, and controls step down around it. If a button is competing with the phrase for attention, the button is wrong.

## Layout

Mobile-first, single-column by default, at a 4px spacing base. Reviewed at 375 / 768 / 1024 / 1440. Content sits in a narrow measure and stays centred rather than stretching — a study card at 1440 is the same card, better framed, not a wider one.

Density is deliberately low. The Muji reference is a spatial instruction as much as a visual one: one thing at a time, with enough room around it that the learner's attention has somewhere to rest. The one place density legitimately rises is progress summary, where real data exists and compression is honest.

Touch targets are ≥44px everywhere, without exception, including in dense grids like the kana chart. Where a visual element must be smaller, its hit area is padded to meet the floor.

## Elevation & Depth

**This system is flat.** Depth comes from tonal layering — paper against warm paper against mist — not from shadow. There are exactly two shadows in the entire system, both hairlines, and neither is decorative:

### Shadow Vocabulary
- **Card** (`0 1px 2px 0 rgb(21 9 24 / 0.05)`): separates a card from the page when tone alone is too subtle.
- **Key** (`0 1px 2px 0 rgb(21 9 24 / 0.04)`): kana keyboard keys, where a physical key affordance genuinely helps.

Both use ink-tinted rather than neutral black shadow, so they warm rather than grey the surface beneath.

### Named Rules

**The Two Shadows Rule.** If a new component wants a third shadow, it wants tonal separation instead. Reach for a surface token before a shadow.

## Shapes

Generously but not softly rounded, on a deliberate scale where radius signals size and role: 6px for small chrome, 8px for inputs and banners, 12px for buttons and kana keys, 16px for input wells, 20px for the main review card, and full-round for badges and icon buttons.

The progression matters — a larger surface takes a larger radius so the corner reads as the same physical curvature at every scale. Nothing in the system is sharp-cornered, and nothing is a pill except badges and circular icon buttons.

The one distinctive form is the **hanko** — the circular ア seal that serves as the brand mark, and the **maru** (○) it shares its geometry with. Both are circles by cultural logic, not styling: a hanko is round because seals are round, and ○ means correct in Japanese schooling regardless of what this product decides.

## Components

### Buttons
- **Shape:** 12px radius (`rounded-lg`), minimum 44px tall.
- **Primary:** plum ground, paper text. One per screen — if two buttons are both primary, the screen has not decided what it wants.
- **Secondary:** paper ground, ink-muted text, hairline stroke.
- **Active:** every button has a visible `active:` state. There are **no hover-only affordances** — the primary input is a thumb.

### Inputs / Fields
- **Style:** paper ground, strong hairline stroke, 16px radius on wells and 8px on plain fields, 44px minimum height.
- **Focus:** a visible ring, always. Focus is the one place where a second accent colour is legitimate.
- **Japanese input** takes the JP font and its looser line-height; placeholder text reverts to Latin body.

### Cards / Containers
- **Corner:** 20px on the main review card, 16px on secondary containers.
- **Background:** paper on a warm-paper page, so the card lifts tonally without a shadow.
- **Border:** hairline, or none where tone is sufficient.

### Badges
- Full-round, mist ground, ink-subtle text. Scenario tags are quiet labels, not decoration.

### The Maru — signature component
The correctness vocabulary. ○ (maru) means recalled; ✕ (batsu) means worth another look. This is the one motif the system commits to, and it is justified from outside the brand: these glyphs mean correct and incorrect in Japanese schooling, so they stay right even if everything else changes.

Defined exactly once, in `Maru.tsx`. Anything marking an answer imports it rather than typing a literal glyph. Meaning rides on three channels — glyph, colour, and a visually-hidden text label — so it survives colour-blindness, greyscale, and a screen reader.

Where the app grades rather than the learner, `AnswerResult` owns the treatment: a tinted banner above a neutral reveal block, with wording held in a constant that call sites cannot override. A quiet, markless reveal was built first and rejected on review.

### Named Rules

**The Maru Boundary Rule.** *(binding — this is the guardrail that keeps the motif from becoming a reward loop)*

> A maru marks an answer. It never accumulates.
> Transient and per-answer is annotation. Persistent and per-user is a badge.
> The moment a maru survives onto a profile screen, it has become gamification.

**The Owned Wording Rule.** Verdict copy lives in a constant with no prop to override it. `Recalled!` / `Not quite`. This is a mechanism, not a convention — two call sites that each owned their own copy had already drifted to different words for the same state.

## Do's and Don'ts

### Do:
- **Do** use role tokens (`bg-surface`, `text-fg-muted`) rather than value tokens (`brand-500`) or raw hex.
- **Do** give every interactive element a visible `active:` state and a visible focus ring.
- **Do** keep touch targets ≥44px, padding the hit area when the visual element must be smaller.
- **Do** hold text contrast at 4.5:1 and non-text indicators at 3:1. **WCAG 2.1 AA is binding**, not aspirational.
- **Do** put charm in empty states, progress language, and example sentences.
- **Do** give Japanese text its own looser line-height and its own font.
- **Do** use filled inline SVG icons.

### Don't:
- **Don't** introduce a colour that has no role. Every colour in the system answers "what is this *for*" — a new hue needs a job, not a preference. (This is not a ban on multiple colours: v3 has five. It is a ban on decorative ones.)
- **Don't** use green or red for anything except answer correctness.
- **Don't** add XP, hearts, badges, streaks, mascots, levels, or any ornament that accumulates onto a person.
- **Don't** write verdict prose — no "correct", "wrong", "incorrect", "failed", or "missed", no percentages, no letter grades, no pass/fail. `Recalled!` / `Not quite` is the sanctioned pair and must not be softened.
- **Don't** build hover-only affordances. If it only exists on hover, it does not exist.
- **Don't** use emoji as icons, anywhere.
- **Don't** reach for a third shadow. Use tonal separation.
- **Don't** let the maru appear anywhere except against a specific answer — no section stamps, no progress notation, no decorative pattern.

---

## Skill configuration

Not part of the DESIGN.md spec. Recorded here because it is design authority for this project, and the tools read this file.

### Per-surface taste dials

`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`, set per surface rather than globally. Density stays low per the Muji brief and rises only where real data density exists. Variance stays low except in the two places the brief says charm belongs.

| Surface | Components | DENSITY | VARIANCE | MOTION |
|---|---|---|---|---|
| Flashcard review | `FlipCard`, `PhraseCard` | 3 | 2 | 3 |
| Kana practice | `KanaGrid`, `KanaKeyboard` | 4 | 2 | 3 |
| Pronunciation | `VoiceInput`, `AudioButton` | 3 | 2 | 3 |
| Cloze / fill | `FillInput`, `AnswerResult` | 3 | 2 | 2 |
| Progress summary | `ProgressBar`, `ScoreCard` | 6 | 3 | 2 |
| App shell | `AppHeader` | 3 | 2 | 1 |
| Empty / error / loading | `EmptyState`, `ErrorState`, `LoadingPlaceholder` | 2 | 4 | 2 |

`MOTION_INTENSITY` never exceeds 3. Every value above 3 implies scroll-driven or magnetic interaction, which a touch-first study app does not have.

### Generators are disabled

The palette, the type pairing, and the UI style are **decided**. Any skill step that would generate them is switched off for this project:

- **`frontend-design`** — its step-1 instruction to brainstorm a 4–6 colour palette and pick display/body typefaces does not run. Use the loop and the self-critique gate; the palette arrives from elsewhere and the type is locked.
- **`ui-ux-pro-max`** — its 192 palettes, 84 UI styles (glassmorphism, claymorphism, bento, neumorphism), and 74 font pairings are all off. Use the UX guidelines, the anti-pattern rules, and the pre-delivery checklist only. Its `cursor-pointer` and hover-transition guidance is advisory and loses to the touch-first rule above.
- **`taste-skill`** — take the three dials and the pre-flight checks. Its canonical code skeletons are GSAP; this package ships zero runtime dependencies and animates with CSS keyframes.
- **`impeccable`** — `detect` is a deterministic gate and runs on every build. `shape` and `craft` output is a first draft, never a recommendation.

**No skill output goes straight into `src/components/`.** Variants land in `preview/_sandbox/` as static HTML first, and only a chosen one becomes a component.
