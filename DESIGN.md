---
name: AburunGo Design System
description: Five colours with one job each, on warm stone. Quiet structure, colour that carries meaning.
colors:
  akane: "#D72E2E"
  ai: "#1F3A66"
  rokusho: "#4F9C8D"
  ogon: "#C9A045"
  sumi: "#2D2D2D"
  page: "#F7F6F1"
  card: "#FFFDF8"
  well: "#EFEDE5"
  fg: "#2D2D2D"
  fg-heading: "#1F3A66"
  fg-muted: "#57534C"
  fg-subtle: "#6B665E"
  fg-faint: "#6B665E"
  action: "#1F3A66"
  accent: "#D72E2E"
  focus: "#C9A045"
  link: "#33685e"
  tag-bg: "#ecd9a5"
  tag-fg: "#8a6a2b"
  keyboard: "#33685e"
  key: "#FFFDF8"
  recalled: "#4F9C8D"
  review: "#D72E2E"
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

> **v3 "Zuihoden" is merged.** Five colours, one job each, on warm stone. The
> frontmatter above is generated from `src/tokens.css` — regenerate it when the
> palette changes rather than editing it by hand.
>
> Three deliberate deviations from the drop are recorded in `docs/colors.md`:
> the focus ring is split light/dark, the kana keyboard is Rokushō rather than a
> second Sumi-iro slab, and card accents are a prop rather than one fixed colour.

## Status of these decisions

**Provisional until seen in a whole screen.** Every rule below was decided against
components rendered in isolation. The palette author has not yet seen the app as a
working interface, so these are guidelines with a date on them, not a frozen spec.
Where two rules conflict, raise it and propose a resolution rather than treating
the older one as binding. Revisit the lot once the flow mockups exist.

## Overview

**Creative North Star: "Quiet form, warm intelligence"**

AburunGo is a beautifully made adult study object — a Muji notebook, a Leica body, a language textbook designed by people with taste. The system's default state is calm, structured, and confident enough not to perform. It is a tool for someone who wants to use the language, not be cheered at.

The warmth is real but held in reserve. Personality enters through writing, pacing, and a small number of chosen accent moments — never through structure. The governing tension: **the interface should look more serious than the copy sounds.** An interface that reads as playful has taken the charm out of the words and put it in the furniture, which is the wrong place for it.

Restraint here is load-bearing rather than stylistic. Whitespace is what makes a colour moment land; if colour is everywhere, nothing is emphasised. Colour appears only where it marks what something is *for* — which under v2 means a single accent, and under v3 means five roles used just as sparingly.

**Key Characteristics:**
- Calm, structured, adult — no cheerleading, no reward loop
- Colour used sparingly and structurally — every hue has a job, none decorate
- Touch-first, mobile-primary, ≥44px targets throughout
- Flat surfaces; depth conveyed by tone, not shadow — **one sanctioned exception**, `.glass` (2026-08-13), where the blur does legibility work rather than decoration
- Bilingual by construction — Latin and Japanese type are separate systems, tuned separately
- Charm lives in empty states and progress language, never in navigation or structure

**Anti-references (confirmed):** mascot-first products, kawaii or cartoon UI, candy-coloured gamification, tourist-Japan iconography, generic startup minimalism, austere luxury, exam-prep institutional design.

## Colors

Five colours, one job each, on a warm stone ramp. The warmth is load-bearing:
`#FFFDF8` is not a mistake for `#FFFFFF`, and flattening it to pure white is the
specific way this palette gets broken.

### Primary
- **Akane 茜色** (`#D72E2E`): the hanko, and error states. Also available as a
  card accent — see the named rule below.
- **Ai-iro 藍色** (`#1F3A66`): primary action, headings, and Japanese content.
  The phrase under study is Ai-iro; that is what makes it the subject of a card.

### Secondary
- **Rokushō 緑青** (`#4F9C8D`): progress, correctness, secondary action, links,
  and the kana keyboard ground.
- **Ōgon 黄金** (`#C9A045`): focus rings, scenario tags, hairlines on dark chrome.
  The default card accent.

### Neutral
- **Sumi-iro 墨色** (`#2D2D2D`): body text, and the inverse chrome of the header band.
- **Warm stone**: page `#F7F6F1`, cards `#FFFDF8` — cards are *lighter* than the
  page, so they lift without a shadow — wells `#EFEDE5`.

### Feedback
Reserved for answer correctness. Tinted panels at 100 with a 300 border; the
○ / ✕ glyph itself at full 500.

### Named Rules

**The Accent Is An Input Rule.** A card's accent colour is a prop, not a constant.
Colour is free to carry meaning — which scenario, which unit, which state — and is
not locked to one value per component. Pick from the brand set; do not invent a hex.

**The Akane Overlap Rule.** Akane is the mark and the error state. It is *available*
as a card accent, but a red thing elsewhere in the interface means something went
wrong — so spend it where that overlap is worth it, and not for decoration.

**The One Dark Slab Rule.** The header band is Sumi-iro. Nothing else on the same
screen should be near-black; the kana keyboard is Rokushō for exactly this reason.

**The No Raw Value Rule.** Components reference role tokens, never hexes. Enforced
by `scripts/check-adherence.mjs`, which fails the build.

**The Patterned Ground Rule.** A *bare* `.emboss-bg` ground carries `fg` and
`fg-heading` only. `fg-muted` is permitted; `fg-subtle` and `fg-faint` are not —
**unless they sit on `.glass`**, which is what that utility is for. The tile darkens
what sits under it, so text is judged against the darkest pixel of the pattern, not
against the surface token — measured worst case at the `.35` default is 8.40:1 for
`fg`, 6.91:1 for `fg-heading`, 4.66:1 for `fg-muted`, and **3.47:1 for `fg-subtle`**.
This is not an opacity problem: carrying `fg-subtle` at 4.5:1 needs roughly `.16`,
by which point the pattern is invisible. Put the pattern behind a card and the fine
print on the card. `EmptyState` and `ErrorState` are the live case — their
description line is `text-fg-subtle`. Checked by `scripts/check-contrast.mjs`
against a measured stand-in; re-measure if a crest is added or the opacity raised.

**The empty-state treatment is decided — 2026-08-13, from four rendered options
in `preview/_sandbox/empty-1-pattern.html`.** The pattern goes on the **page
ground**; the content sits on a **flat card** above it. Built as `EmptyStage` in
`ui_kits/flows/shell.tsx`. Two alternatives were rendered and rejected: pattern
behind everything **fails** at 3.47:1, and promoting the description to `fg`
passes but flattens the hierarchy — message and description become one block —
and would change `EmptyState` everywhere, patterned or not. Do not re-open this
by reaching for the simpler markup.

**Which surfaces carry the ground — settled 2026-08-16.** There was no rule
until now, and it showed: the crest reached 4 of 16 flow states, and the four it
reached were simply the ones somebody happened to be editing. Empty states got
it when the empty-state work happened; the lesson list got it in #30; loading
and error never did. The inconsistency was not a judgment call anybody made.

> **A full-screen state that is not showing content carries the crest.
> A state showing content does not.**

| State | Ground | Why |
| --- | --- | --- |
| loading · empty · error | **crest** | the screen would otherwise be a message floating on bare stone |
| lesson list | **crest** | decided in #30 — the cards are glass panes over it |
| card, drill, chart, keyboard, summary | **bare** | the card needs its separation, and a texture behind a judged answer competes with the maru |

Two consequences worth stating, because both were live bugs before this rule
existed. **The rule is what makes loading, empty and error one family** — they
are the three faces of "nothing to show yet", and they should differ by their
signal (spinner, hanko, Akane triangle), not by whether the floor is there.
And **the crest stays away from any surface where an answer is being judged**,
which `docs/todo.md` already required for a different reason: kamon are
circular, and ○ is taken.

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

**One radius: 4px, everywhere.** Flattened 2026-08-16. The scale used to run 6px for small chrome up to 20px for the review card, on the theory that a larger surface needs a larger radius to read as the same physical curvature. That is sound, and it made the UI look like a friendly consumer app. A single tight radius reads as a lacquered panel instead, which is the Zuihōden reference.

Nothing is sharp-cornered and nothing is a pill. The six `--radius-*` tokens all resolve to the same value but are **kept as separate names**, so components still ask for a radius by role — restoring a scale is a six-line edit in `src/tokens.css` rather than a repo-wide sweep.

The one distinctive form is the **hanko** — the circular ア seal that serves as the brand mark, and the **maru** (○) it shares its geometry with. Both are circles by cultural logic, not styling: a hanko is round because seals are round, and ○ means correct in Japanese schooling regardless of what this product decides.

## Components

### Buttons
- **Shape:** 4px radius (`rounded-lg`), minimum 44px tall.
- **Primary:** **Ai-iro** ground, paper text. One per screen — if two buttons are both primary, the screen has not decided what it wants. Settled 2026-08-16 against the drop's Akane; see `docs/colors.md` correction 11.
- **Secondary:** **Ōgon 100** ground, Ōgon 800 text, Ōgon 600 hairline. The fill is only 1.09:1 against the page, so the stroke is what gives the control its shape — it is not decoration and must stay ≥3:1.
- **Active:** every button has a visible `active:` state. There are **no hover-only affordances** — the primary input is a thumb.

### Inputs / Fields
- **Style:** paper ground, strong hairline stroke, 4px radius, 44px minimum height.
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
- **Do** run `scripts/check-contrast.mjs` and read what it says. WCAG 2.1 AA — 4.5:1 text, 3:1 non-text — is the **target**, and the script checks it on every build. Since 2026-08-10 it **fails the build** on any miss that has no recorded reason; before that it printed and exited 0, so it never stopped anything. The palette author still owns the call, and some misses are deliberate — record those in the `KNOWN` map with a written reason rather than re-tinting. Four are recorded today: the scenario tag and the Ōgon focus ring on three grounds. Do not silently re-tint a brand value to make a number go green, and do not add a `KNOWN` entry without a reason worth reading.
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
