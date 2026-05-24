# AburunGo Design System

> Practical Japanese for English speakers. The reward is being able to **use the language** — not points, streaks, hearts, badges, or any reward‑loop mechanic. The system is designed around that single anti‑promise.

This design system captures the visual language, content rules and component library of [AburunGo](https://github.com/petr0n/aburungo). Use it to build new screens, mocks, slides or marketing for the product without re‑inventing or drifting.

---

## Product context

AburunGo is a mobile‑first web app (Vite + React 19 + TypeScript, Tailwind v4) that teaches English‑speaking learners practical Japanese for **real situations** — transit, restaurants, day‑to‑day interactions. Scenarios first, vocab lists last. Phrases are hand‑authored, kept small and good. The core surface today is a **fill‑in‑the‑blank review loop** with three input modes (romaji → kana converter, on‑screen kana grid, system Japanese IME) plus voice input.

Currently English‑only (UI strings), with Japanese content delivered in kanji + hiragana reading + romaji.

### Sources used to build this system

- **GitHub:** [`petr0n/aburungo`](https://github.com/petr0n/aburungo) — production codebase. Tailwind theme, components, content schema, hero artwork, favicon.
  - `src/index.css` — Tailwind v4 theme tokens
  - `src/components/*.tsx` — Card, AudioButton, AuthForm, FillBlankCard, FillInput, KanaKeyboard, VoiceInput
  - `src/content/phrases/*.yaml` — voice & content sample
  - `public/favicon.svg`, `src/assets/hero.png` — brand marks
  - `CLAUDE.md`, `README.md` — product rules and intent

The reader can explore the repo above to do a more thorough job recreating UIs not yet covered here.

---

## Index

| File / folder | What's in it |
|---|---|
| `README.md` | This — context, content rules, visual foundations, iconography |
| `colors_and_type.css` | Brand + semantic CSS variables, type presets, spacing, radii, shadows (no Tailwind) |
| `SKILL.md` | Cross‑compatible Agent Skill manifest |
| `src/index.css` | **Production tokens** — Tailwind v4 `@theme` block; generates the `bg-*`, `text-*`, `font-*`, `rounded-*`, `shadow-*` utility families |
| `src/components/ui/` | **Production primitives** (TSX): `Button`, `TextInput`, `Card`, `Badge`, `IconButton` |
| `src/components/` | **Production domain components** (TSX): `PhraseCard`, `KanaGrid`, `ProgressBar`, `AudioButton` + the `icons.tsx` set + barrel `index.ts` |
| `assets/logo.svg` | Brand mark (purple glyph) |
| `assets/hero.png` | Stacked‑card hero illustration |
| `assets/icons/` | Inline SVG icons extracted from the codebase (audio, microphone, backspace, spinner) |
| `preview/*.html` | Cards for the Design System tab — colors, type, spacing, components |
| `ui_kits/mobile/` | Mobile UI kit — click‑thru demo of the four core screens, browser‑runnable JSX mirror of the production components |

### Using the React component library

```tsx
import {
  Button, TextInput, Card, Badge, IconButton,
  PhraseCard, KanaGrid, ProgressBar, AudioButton,
} from '@/components'

export function Demo() {
  return (
    <PhraseCard
      scenario="restaurant"
      japanese="これをください"
      reading="これをください"
      english="I'll have this."
      audioSlot={<AudioButton onPress={() => {}} />}
    />
  )
}
```

The TSX components are written against the AburunGo source conventions: explicit `Props` types, named exports, `import type` for type‑only imports, `@/` path alias, no `any`, no enums (union types only). Drop them into `src/components/` of the AburunGo Vite app and they'll compile.

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
- Hand‑written YAML, validated at build time. Bad content fails `npm run build`.
- Every phrase has: `id` (stable slug), `japanese`, `reading` (hiragana), `romaji`, `english`, `scenario`. Optional: `audioUrl`, `notes`.
- **Notes are usage, not translation.** "Universal — works at info desks, on the street, at hotel front desks." Practical, not academic.

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
- Code applies the JP font via a `.jp` / `font-jp` class on any element containing kanji or kana.
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
- **Press, not hover.** Hover‑only affordances are banned (touch‑first).
- Standard pattern: `active:bg-zinc-100` on neutral buttons, `active:bg-zinc-800` on primary `zinc-900` buttons, `active:opacity-80` on the purple accent. No transforms, no shrink, no glow.
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

### What lives in the codebase today
- **Audio** (volume‑with‑waves) — `AudioButton`
- **Microphone** (filled mic) — `VoiceInput` idle / listening
- **Spinner** (circle‑with‑arc) — `VoiceInput` processing
- **Backspace** (rounded rectangle with X) — `KanaKeyboard`

All four are extracted and saved as standalone SVGs in `assets/icons/`. Use them by inlining the markup or pasting the SVG content into your component — *do not* link to an icon library.

### When you need an icon that doesn't exist yet
Pick the **closest Material Icons (Filled)** match — Material's geometry (24px frame, solid fills, rounded but not pill, modest visual weight) is the nearest neighbour to what's in‑repo. Substituted icons should be flagged ("Material Icons stand‑in for X — needs custom").

- **Substitution flag:** all icons sourced outside the in‑repo SVGs are stand‑ins until designed. Don't paint over this.

### Other iconographic conventions
- **No emoji.** Not in copy, not as icons.
- **No unicode glyph icons** (no ✓, ✕, ▶, ←). Use SVG.
- **No outline (line‑weight) icons.** Filled only — matches the rounded type.
- **Logo / brand mark** lives in `assets/logo.svg` — a geometric purple glyph (lightning‑like Z form, `#863bff` with `#7e14ff` shadow gradient and `#ede6ff` highlight). Use as‑is; don't recolor.

---

## Caveats & substitutions

- **Fonts:** **Noto Sans** ships locally as a variable font in `fonts/` (wght 100–900, wdth 62.5–100). Italic is the matching variable italic. **M PLUS Rounded 1c** still loads from Google Fonts — drop the local `.ttf`/`.woff` files into `fonts/` when ready and update the `@font-face` block in `colors_and_type.css` + `src/index.css`.
- **English‑only UI strings** today. JP content is in JP; the chrome is in English. Add `lang="ja"` to any JP text node.
