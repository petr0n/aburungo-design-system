# AburunGo Design System (ADS)

Component library and design token source for the AburunGo app. Published as a local npm package consumed by `../aburungo` via a `file:` reference.

## Shared memory

All sessions must read and write memories to:

```
/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo/memory/
```

Check `MEMORY.md` there at the start of every conversation.

## What lives here

| Path | Purpose |
| --- | --- |
| `src/components/` | TypeScript React components — the shipped package source |
| `src/index.css` | Tailwind v4 `@theme` tokens + base resets — the design token source of truth |
| `storybook/` | Custom HTML storybook (uses JSX mirrors in `ui_kits/mobile/components.jsx`) |
| `ui_kits/` | JSX component mirrors and screen mockups for design/preview use |
| `preview/` | Static HTML design spec pages |
| `SKILL.md` | Claude Code plugin entry point — defines the `/aburungo-design` skill |

## Commands

```
pnpm build        compile src/components/ → dist/ (tsup)
pnpm dev          tsup --watch for live rebuilds during development
pnpm typecheck    tsc --noEmit
```

## Consuming app

The AburunGo app lives at `../aburungo`. It imports from this package as:

```ts
import { Button, PhraseCard } from 'aburungo-design-system'
```

After any changes here, run `pnpm build` before testing in the app. The app's pnpm `file:` link resolves to `dist/` via the `exports` field.

## Component rules

- All components in `src/components/` are pure React + TypeScript. No app routing, no Supabase, no Zustand.
- Use Tailwind v4 utility classes from `src/index.css` tokens only. No inline styles, no hard-coded hex values.
- Touch targets ≥ 44px. `active:` states required. No hover-only affordances.
- No gamification: no XP, hearts, badges, streaks, mascots, or reward-loop ornaments.
- Export all public components from `src/components/index.ts`. Never export internals.

## Design rules

- One accent: `brand-500` (`#aa3bff`) on auth CTAs and focus rings only.
- Noto Sans for English UI (`font-sans`), M PLUS Rounded 1c for Japanese content (`font-jp`).
- Filled inline SVG icons only. No emoji, no outline icons.
- See `SKILL.md` and `colors_and_type.css` for the full brand spec.

## TypeScript conventions

Identical to the AburunGo app:
- `verbatimModuleSyntax` on — use `import type` for type-only imports.
- `erasableSyntaxOnly` on — no parameter properties, no enums.
- No `any`. No `as` casts except at validated trust boundaries.
- Functional components only: `export function Name(props: Props)` with explicit `Props` type.

## Adding a new component

1. Create `src/components/MyComponent.tsx` with an explicit `Props` type.
2. Export it from `src/components/index.ts`.
3. Run `pnpm typecheck` to confirm no type errors.
4. Run `pnpm build` to verify the dist output.
5. Add a story to `storybook/stories.jsx` and a JSX mirror to `ui_kits/mobile/components.jsx`.
6. Run `/handoff-to-app` to generate the integration spec for the AburunGo app.

## Git workflow

Same conventions as the AburunGo app: Conventional Commits, descriptive branch names, never push without explicit user confirmation.
