# Flow mockups

Phase 4 of [`docs/color-palette-and-app-flow-plan.md`](../../docs/color-palette-and-app-flow-plan.md).
Whole screens, assembled from the shipped components, with every state a real
session reaches — not just the happy path.

## Run it

```
python3 -m http.server 6006          # from the repo root
open http://localhost:6006/ui_kits/flows/
```

Serve from the repo root, not this directory: the token sheet, the fonts, and
the `.hanko` mask are all resolved from there. `file://` will not work.

Rebuild after changing a component or a flow:

```
pnpm build:flows
```

## Why this is not `ui_kits/mobile/screens.jsx`

That file is a **mirror** — every component typed out a second time in browser
JSX. It is a palette behind and still renders a bare-`<h1>` `AppHeader`.

These import `src/components` directly and are bundled by
[`scripts/build-flows.mjs`](../../scripts/build-flows.mjs). There is no second
copy, so there is nothing to drift. React stays external and arrives from
esm.sh via the import map in `index.html`, which keeps the committed
`bundle.js` down to our own source.

`bundle.js` is committed on purpose, for the same reason
`dist/tokens.plain.css` is: these pages are static, and a preview that needs a
build step first is a preview nobody looks at.

## Deep links

Every state has a URL, so it can be shared and so `pnpm shots` can capture it
without driving clicks:

| URL | State |
|---|---|
| `?state=round&step=prompt` | the card, English hidden |
| `?state=round&step=reveal` | flipped, self-grade pair |
| `?state=round&step=summary` | round summary with the per-answer mark row |
| `?state=loading` | round being assembled |
| `?state=empty` | nothing due |
| `?state=error` | load failed |
| `?state=checked` | `AnswerResult` — the app grading, for contrast with self-grading |

## Flows

| File | Mirrors | Status |
|---|---|---|
| `flashcard-round.tsx` | `../aburungo/src/pages/FlashcardPage.tsx` | built |

Session start, kana practice, pronunciation, and progress are still to come.

## What it found

Four things no component in isolation could show — the header band resolving to
no colour at all, the self-grade pair sitting on the correctness colour,
`FlipCard`'s faces not matching height, and `ProgressBar` colliding with the
band's hairline. Written up under **What the first flow found** in the plan.
