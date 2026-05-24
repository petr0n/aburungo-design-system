# AburunGo — Mobile UI kit

A click-through high-fidelity recreation of the actual AburunGo mobile surface, built on top of the design system's primitives.

## What's here

- **`index.html`** — the demo host. Click through the four core screens:
  1. **Landing** — hero, wordmark, sign-in / create-account CTAs
  2. **Sign in** — email + password form, accent CTA
  3. **Review** — fill-in-the-blank flashcard with three input modes (romaji / kana grid / JP keyboard) + audio button, result banner (Correct! / Not quite)
  4. **All caught up** — empty state
- **`components.jsx`** — browser-runnable mirror of `src/components/ui/*` and the domain components (`PhraseCard`, `KanaGrid`, `AudioButton`, `ProgressBar`). Mirrors the canonical TSX in `src/components/` 1:1 but as plain Babel JSX so the demo runs without a build step.
- **`screens.jsx`** — `LandingScreen`, `SignInScreen`, `ReviewScreen`, `EmptyScreen`. Composed entirely from `components.jsx`. Real phrase content from `src/content/phrases/*.yaml`.
- **`ios-frame.jsx`** — iPhone device chrome (status bar, dynamic island, home indicator).

## What the demo proves

- Tokens applied: every utility class (`text-fg`, `bg-brand-500`, `text-jp-display`, `rounded-2xl`) resolves against the `@theme` block in `src/index.css` via the Tailwind v4 browser runtime.
- Components compose: `PhraseCard` uses `Card` + `Badge` + the JP type tokens; `ReviewScreen` uses every primitive at least once.
- Touch-first: every interactive element is ≥ 44px (try tapping in iOS Safari or a phone-sized window).

## Caveats

- Tailwind v4 browser runtime is for design-system previews, not for production. The production app is built with `@tailwindcss/vite` per the AburunGo `package.json`.
- The kana-to-romaji converter shown in `FillInput.tsx` is not wired up here — the romaji mode is a plain input. The kana-grid mode is fully interactive.
- The audio button cycles through `idle → loading → playing → idle` on press but plays no audio. AburunGo has not chosen an audio source yet (recordings vs TTS vs licensed).
