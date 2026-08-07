# AburunGo Design System

> Practical Japanese for English speakers. The reward is being able to **use the language** — not points, streaks, hearts, badges, or any reward‑loop mechanic. The system is designed around that single anti‑promise.

This design system captures the visual language, content rules and component library of [AburunGo](https://github.com/petr0n/aburungo).

---

## What this repo is for

ADS is the **UX/UI fabricator for AburunGo**. Interfaces are designed, built and evaluated here — as real, runnable components — and then shipped to the app. The app is where the language backend gets wired up to them.

The practical consequence: **if a UI question can be answered here, it should be.** Spacing, hierarchy, states, motion, copy, how a surface reads at 375px — all of that gets settled in this repo, against sample data, before any of it touches Supabase or routing. What arrives in the app should be a UI you have already looked at and approved.

### What lives where

| Concern | ADS | The app |
|---|---|---|
| Layout, spacing, hierarchy, type | ✅ | |
| Component states — loading, empty, error, result | ✅ | |
| Copy and microcopy | ✅ | |
| Sample content to render against | ✅ | |
| Which card comes next, scoring, SRS | | ✅ |
| Data fetching, auth, persistence | | ✅ |
| Routing and navigation | | ✅ |

The line is **data vs. presentation**, not "simple vs. complex." A component may be as elaborate as the design needs; it may not know where its content came from.

This is why `CLAUDE.md` bans routing, Supabase and Zustand here. The rule is not "keep components trivial" — it is "keep them ignorant of the backend," so the same component can be driven by a fixture in the storybook and by real data in the app without changing.

---

## Product context

AburunGo is a mobile‑first web app (Vite + React 19 + TypeScript, Tailwind v4) that teaches English‑speaking learners practical Japanese for **real situations** — transit, restaurants, day‑to‑day interactions. Scenarios first, vocab lists last. Phrases are sourced from JMdict/Tatoeba/KANJIDIC2 and kept small and good. The core surface today is a **fill‑in‑the‑blank review loop** with three input modes (romaji → kana converter, on‑screen kana grid, system Japanese IME) plus voice input.

Currently English‑only (UI strings), with Japanese content delivered in kanji + hiragana reading + romaji.

---

## Looking at a screen, not just a component

A component in isolation cannot answer most UI questions. To judge a surface you need it composed, populated and shown in each of its states.

**Components stay stateless. Compose them into a screen and feed it fixture data:**

```tsx
<FlashcardScreen state="loading" />
<FlashcardScreen state="empty" />
<FlashcardScreen state="error" />
<FlashcardScreen state="ready" phrase={fixtures.phrases[0]} />
```

The state you are looking at is a **prop**, not five separate hand-built pages.

### Interaction state belongs to the harness

When you need to click through something, the state lives in the *story*, not the component. The storybook already works this way — `AudioButton`'s Interactive story and `FlipCard`'s flip toggle both hold `useState` in the story itself. The component stays pure and the flow is still explorable.

### Do not hand-draw screens

A screen redrawn as standalone HTML or JSX is a second copy of the UI. It drifts from the components it depicts, and then it lies. Compose the real components instead.

> **Not built yet.** There are no fixtures in `src/lib/` and no screen-level compositions today, so `ui_kits/*/screens.jsx` are currently hand-drawn — the pattern this section argues against. Building the fixtures and screen components is the intended replacement.

---

## Using as an npm package

ADS is published as a local npm package consumed by the AburunGo app via a `file:` reference.

### Install

In the consuming app's `package.json`:

```json
"aburungo-design-system": "file:../aburungo-design-system"
```

Then run:

```bash
pnpm install
```

### Import components

```tsx
import {
  Button, TextInput, Card, Badge, IconButton,
  PhraseCard, ProgressBar, AudioButton,
  BackspaceIcon, MicIcon, SpeakerIcon, SpinnerIcon,
} from 'aburungo-design-system'

export function Demo() {
  return (
    <PhraseCard
      scenario="restaurant"
      japanese="これをください"
      reading="これをください"
      english="I'll have this."
      audioSlot={<AudioButton state="idle" onPress={() => {}} label="Play audio" />}
    />
  )
}
```

### Import design tokens

ADS tokens are in `src/tokens.css` — a standalone `@theme` block with no Tailwind import. In the app's CSS:

```css
@import 'tailwindcss';
@source '../node_modules/aburungo-design-system/dist';   /* scan ADS classes */

@import 'aburungo-design-system/src/tokens.css';          /* shared design tokens */

@theme {
  /* app-specific tokens only */
}
```

The `@source` line tells Tailwind v4 to scan the ADS `dist/` output for utility classes used in ADS components.

### Build commands

```bash
pnpm build        # compile src/components/ → dist/ (tsup, ESM + .d.ts)
pnpm dev          # tsup --watch for live rebuilds
pnpm typecheck    # tsc --noEmit
```

After any changes here, run `pnpm build` before testing in the consuming app.

---

## File index

| File / folder | What's in it |
|---|---|
| `README.md` | This — context, content rules, visual foundations, iconography |
| `src/tokens.css` | **Design tokens** — standalone `@theme` block; brand, semantic, type scale, spacing, radii, shadows. Import this in the consuming app. |
| `src/index.css` | Storybook CSS — `@import "tailwindcss"` + `@import "./tokens.css"` + base resets. Not for app import. |
| `src/components/` | **TypeScript source** — all React components shipped in the package |
| `src/components/index.ts` | Barrel export — all public components and types |
| `dist/` | Compiled output (ESM + `.d.ts`) — generated by `pnpm build`, not committed |
| `tsup.config.ts` | Build config — ESM, dts, treeshake, externals |
| `tsconfig.json` | TypeScript config — strict, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| `SKILL.md` | Claude Code plugin entry point — defines the `/aburungo-design` skill |
| `CLAUDE.md` | Project rules for AI sessions |
| `.claude/commands/` | Project slash commands (e.g. `/handoff-to-app`) |
| `storybook/` | Custom HTML storybook (uses JSX mirrors in `ui_kits/mobile/components.jsx`) |
| `ui_kits/` | JSX mirrors of the components (a workaround for the browser‑Babel storybook) plus screen files. Mirrors are hand‑maintained and drift from `src/components/`; the screen files are hand‑drawn — see [Looking at a screen](#looking-at-a-screen-not-just-a-component) |
| `src/lib/` | Shared logic shipped as a second entry point (`aburungo-design-system/lib`) — kana data, romaji conversion. Fixture content belongs here too, once it exists |
| `preview/` | Static HTML design spec pages |
| `colors_and_type.css` | Brand + semantic CSS variables, type presets, spacing, radii, shadows (plain CSS, no Tailwind) |
| `assets/logo-a-128.png` | Brand mark — the ア hanko |
| `assets/hero.png` | Stacked‑card hero illustration |
| `assets/icons/` | Inline SVG icons extracted from the codebase (audio, microphone, backspace, spinner) |

---

## Content fundamentals

The voice is the product. Get this wrong and the app feels like every other language app — which it isn't.

### Tone
- **Plain, declarative, second‑person.** "Where is the station?" not "Let's learn how to ask where the station is!" The app never coaches; it labels and ships.
- **Treat the user as an adult.** They want to use the language. They don't need cheerleading or a streak counter.
- **Calm > excited.** Even success states are matter‑of‑fact. Banner reads "Correct!" not "Amazing! +10 XP!".
- **No filler.** Every screen earns its words. "All caught up!" is a whole empty state — no illustration, no upsell.

### Voice rules
- **You / your**, not "we". The app speaks *to* the learner, not as a teammate.
- **No emoji** in product copy. Anywhere.
- **No exclamation marks** unless they're load‑bearing ("Correct!", "All caught up!"). Default to a period.
- **No metaphor, no slang.** "Type the Japanese…" not "Tap in your guess!".
- **Sentence case** for buttons and headings. ("Sign in", "Create an account", "Show answer".) Never ALL CAPS for emphasis except the scenario tag.
- **Polite Japanese register.** Phrases use polite forms (‑masu / ‑desu) so learners can use them everywhere. Authoring notes call out register edges.

### Specific examples (verbatim from the product)

| Surface | Copy |
|---|---|
| Landing tagline | *Practical Japanese for real life.* |
| Empty review queue | *All caught up!* / *No phrases due for review right now.* / *Start over* |
| Card prompt | *How do you say…* |
| Input mode toggle | *Romaji* / *Kana grid* / *JP keyboard* |
| Submit button | *Check answer* |
| Result | *Correct!* / *Not quite* |
| Rating buttons | *Got it* / *Didn't* |
| Auth toggle | *New here? Create an account* |
| Voice mic state | *Tap to speak* / *Listening… tap to stop* / *Processing…* |
| Voice fail | *Could not hear you. Try again.* |
| Author note | *"Said while pointing. The most useful single phrase in any Japanese restaurant — works even when you can't read the menu."* |

### How content is authored
- Hand‑written YAML, validated at build time. Bad content fails `pnpm build`.
- Every phrase has: `id` (stable slug), `japanese`, `reading` (hiragana), `romaji`, `english`, `scenario`. Optional: `audioUrl`, `notes`.
- **Notes are usage, not translation.** "Universal — works at info desks, on the street, at hotel front desks." Practical, not academic.
- **No fabricated content.** All Japanese content traces to JMdict/Tatoeba/KANJIDIC2 or a verified source.

---

## Visual foundations

### The vibe
Quiet, modern, mobile‑first. White surfaces, zinc text, one purple accent. Round corners that match the rounded type. **Nothing decorative.** If a pixel isn't earning its place, delete it.

### Colors
- **Brand purple** `#aa3bff` is the *only* accent — auth CTAs, focus rings, the logo. Used sparingly. The whole product is monochrome zinc otherwise.
- **Zinc neutrals** (`zinc-50` … `zinc-900`) carry the entire UI: text, borders, backgrounds, primary buttons. The default "primary" button is `zinc-900` filled, not purple. Purple is reserved for moments tied to the brand (auth, focus, marketing).
- **Semantic** green/red appear *only* in correctness banners (`green-50`/`green-700`, `red-50`/`red-700`). Never as decorative tints.

### Typography
- **English UI:** Noto Sans (400 / 500 / 600 / 700). Per‑user direction — was M PLUS Rounded in code originally, swapped to Noto Sans for English copy.
- **Japanese content:** M PLUS Rounded 1c (400 / 500 / 700). Friendly, rounded geometric — matches the rounded UI corners and the gentle tone. Fallback stack: `Hiragino Kaku Gothic ProN`, `Yu Gothic`.
- Code applies the JP font via a `font-jp` class on any element containing kanji or kana.
- **No font for code** in product — this isn't a dev tool.

### Spacing & layout
- 4px base; meaningful steps at 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Mobile‑first. The review screen lives in `max-w-xl` (576px) on phone widths and rarely needs more.
- **Touch targets ≥ 44px.** Non‑negotiable; enforced by `min-h-[44px]` / `h-11` / `h-12` on every interactive element.
- Single‑column. No multi‑column dashboards. Stacking and gap, not float or grid.

### Backgrounds
- **Solid white.** That's it. No imagery in app surfaces, no patterns, no gradients, no full‑bleed photography. The hero is the *only* illustration in the product (landing screen).
- Subtle zinc tints (`zinc-50`) appear inside cards as faint container backgrounds for preview rows, mode pickers, the kana keyboard frame.

### Imagery
- One illustration: **hero.png** — a stacked‑card 3D vignette in violet metallic gradient with a dashed ghost stack above. Hand‑rendered look, not photographic. Used at 220×220 only on the landing screen.
- No stock photo, no marketing photography, no people. The product is the UI.

### Animation & motion
- **Minimal.** No bounce, no parallax, no Lottie.
- Only animations in the product:
  - `transition-colors` on segmented toggles when the active state changes (durations default; ~150 ms).
  - `animate-ping` red pulse ring behind the voice mic when actively listening.
  - `animate-spin` for the processing spinner.
- Easing: standard cubic‑bezier `(0.2, 0, 0, 1)`. Durations 120 / 180 / 240 ms tiers.

### Hover / press states
- **Touch first, hover welcome.** Hover states on desktop are fine — `hover:bg-surface-2`, underlines, tints. What's banned is *hover-only* affordances: actions or labels that are invisible without hover. Every element must function and be discoverable on touch.
- Standard pattern: `hover:bg-surface-2 active:bg-surface-2` on neutral buttons, `hover:bg-brand-700 active:bg-brand-700` on primary buttons. No transforms, no shrink, no glow.
- Disabled = `opacity-50` (or `opacity-40` on a heavy button).
- Focus: 2px ring in `--accent` (purple) — focus is the one place purple appears on neutral inputs.

### Borders
- Default `1px solid` in `zinc-200`. Stronger `zinc-300` on form inputs and secondary buttons to give them more presence.
- Inputs darken to `zinc-500` on focus (plus the purple focus ring).

### Shadows
- `shadow-sm` (a single hairline drop) on the review card and kana keys. That's the entire elevation system.
- No "card with colored left border accent". No multi‑layer drop shadows. No inner shadows.

### Corner radii
Rounded, but never pill‑all‑the‑way unless it's a circular control.

| Token | Value | Where |
|---|---|---|
| `--radius-md` | 8px | Form inputs, banner |
| `--radius-lg` | 12px | Buttons, kana keys, segmented toggles |
| `--radius-xl` | 16px | Result banners, kana keyboard frame, input preview wells |
| `--radius-2xl` | 20px | Main review card |
| `--radius-full` | 9999px | Audio button, voice mic |

### Transparency & blur
- **None.** No glass morphism, no backdrop filters, no semi‑transparent overlays. White is white.

### Cards
- Rounded‑2xl, white background, `zinc-200` 1px border, `shadow-sm`. That's the formula. Always.
- Internal padding `p-6` (24px). Internal gap `gap-6` between header / prompt / input / submit zones.

### Layout rules
- One fixed element only: the top header on signed‑in screens (`AburunGo` wordmark left, `Sign out` right). Everything else scrolls.
- Centered content column `max-w-md` (auth) / `max-w-xl` (review).
- No sidebars, no bottom nav (yet — there's literally one view).

---

## Iconography

The brand uses **inline SVG icons drawn directly inside components** — no icon font, no icon library, no sprite. Each icon is a single `<svg viewBox="0 0 24 24">` path embedded next to the button that uses it. They're solid (filled), single‑colored (`fill="currentColor"`), and Material‑style in proportion (24px frame, ~5px stroke‑equivalent).

Icons are exported as React components from the package:

```tsx
import { BackspaceIcon, MicIcon, SpeakerIcon, SpinnerIcon } from 'aburungo-design-system'
```

### What lives in the codebase today
- **SpeakerIcon** (volume‑with‑waves) — `AudioButton`
- **MicIcon** (filled mic) — `VoiceInput` idle / listening
- **SpinnerIcon** (circle‑with‑arc) — `VoiceInput` processing
- **BackspaceIcon** (rounded rectangle with X) — `KanaKeyboard`

All four are also saved as standalone SVGs in `assets/icons/`. Use them by inlining the markup or importing the React component.

### When you need an icon that doesn't exist yet
Pick the **closest Material Icons (Filled)** match — Material's geometry (24px frame, solid fills, rounded but not pill, modest visual weight) is the nearest neighbour to what's in‑repo. Substituted icons should be flagged ("Material Icons stand‑in for X — needs custom").

### Other iconographic conventions
- **No emoji.** Not in copy, not as icons.
- **No unicode glyph icons** (no ✓, ✕, ▶, ←). Use SVG.
- **No outline (line‑weight) icons.** Filled only — matches the rounded type.
- **Logo / brand mark** lives in `assets/logo-a-128.png` — the ア hanko, a seal-style katakana *a* in Akane 茜色. Rendered in CSS via `.hanko` in `src/brand.css`; the raster is for favicons and fixed-size marks. Use as‑is; don't recolor.

---

## Caveats & substitutions

- **Fonts:** **Noto Sans** ships locally as a variable font in `fonts/` (wght 100–900, wdth 62.5–100). Italic is the matching variable italic. **M PLUS Rounded 1c** still loads from Google Fonts — drop the local `.ttf`/`.woff` files into `fonts/` when ready and update the `@font-face` block in `colors_and_type.css` + `src/tokens.css`.
- **English‑only UI strings** today. JP content is in JP; the chrome is in English. Add `lang="ja"` to any JP text node.
