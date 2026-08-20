# AburunGo — Mobile UI kit

Every product screen in an iPhone frame, **built from the shipped components**.

Serve the repo (`pnpm serve`) and open
[`/ui_kits/mobile/`](http://127.0.0.1:6006/ui_kits/mobile/). Every screen is
deep-linkable: `?screen=lessons&state=list`, `?screen=flashcard&state=error`.

## It is no longer a mirror

Until 2026-08-17 this kit retyped every component in browser JSX — `components.jsx`,
`screens.jsx`, `ios-frame.jsx` — rather than importing `src/components`. It was
several palettes behind, and it had shipped two defects for as long as it existed:

- **The landing screen's primary CTA rendered as bare text.** It asked for
  `variant="accent"`, which no `Button` has ever implemented. The variant map
  returned `undefined`, so the class list came out empty. Plain JSX with no
  types cannot say that; TSX can, and now does.
- **A violet 3D mark sat in the logo position** — `assets/hero.png`, a v2
  artefact that survived the whole v3 merge on five surfaces. The mark is the
  ア hanko. The asset is deleted.

`main.tsx` now imports `src/components` and the *same* flow definitions
[`../flows/`](../flows/README.md) renders, from `../flows/registry.ts`. A
component cannot be right in TSX and wrong here, and adding a screen means
adding it once.

## What's here

| File | Purpose |
| --- | --- |
| `main.tsx` | The host — screen switcher, state rails, page chrome |
| `device.tsx` | iPhone 16 Pro frame: status bar, Dynamic Island, home indicator |
| `onboarding.tsx` | Landing and sign-in — the two screens with no header band, so they live here rather than in a flow |
| `index.html` | Static host page. Loads `bundle.js`; `@theme` injected by `scripts/build-tokens.mjs` |
| `bundle.js` | **Generated** by `pnpm build:flows`. Committed, so the page needs no build step |

Everything else — the four flows and all their states — comes from
`../flows/*.tsx`.

`device.tsx` is the one file here that uses raw hex and inline styles on
purpose. It is Apple's chrome, not ours: `#F2F2F7`, the black island and the
0.25-alpha home indicator are iOS values, and writing them as AburunGo tokens
would claim they belong to this palette. `check-adherence.mjs` scopes itself to
`src/components/**` for exactly this reason.

## Still a mirror, elsewhere

`components.jsx` stays on disk because `storybook/index.html` and
`ui_kits/app/` still load it. Those two are the remaining drift surface —
converting them is follow-up work, not done here.

## Caveats

- Tailwind's browser runtime is for previews, not production. The app builds
  with `@tailwindcss/vite`.
- The audio button cycles `idle → loading → playing` but plays nothing.
  AburunGo has not chosen an audio source yet.
