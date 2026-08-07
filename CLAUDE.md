# AburunGo Design System (ADS)

Component library and design token source for the AburunGo app. Published as a local npm package consumed by `../aburungo` via a `file:` reference.

## ⛔ ABSOLUTE RULE — the lightning-bolt mark is banned

**The purple lightning-bolt glyph is Supabase's trademarked logo. It is NOT the AburunGo logo and never was.**

It lived at `assets/logo.svg`, was described as "the brand mark" in `README.md` and `preview/01-logo.html`, and was **repeatedly revived from old branches and commits** because that prose read as authoritative. It was purged from all git history on 2026-08-07.

**Never** add, restore, generate, copy, re-export, recolor, or describe that mark as the AburunGo logo. If you check out an old branch, cherry-pick an old commit, or restore from a backup and the file reappears — **delete it. Do not commit it.**

**The AburunGo mark is the ア hanko:**

| | |
| --- | --- |
| CSS | `.hanko` / `.maru` in `src/brand.css` |
| Raster | `assets/logo-a-128.png`, `assets/logo-a-tile.png` |
| Colour | Akane 茜色 in the rasters — **the CSS does not match yet** |

> **Known gap.** The rasters are Akane. `.hanko` fills with `var(--color-brand-500)`, which today is the outgoing purple, so the CSS mark and the raster mark are different colours. `--color-accent` does not exist yet; it arrives with the v3 palette. Plan task 5.5d repoints `.hanko` — and eight other `brand.css` sites — at it. Do not "fix" this by hard-coding Akane.

This is enforced, not just documented. `scripts/check-forbidden-assets.mjs` fails on the exact blob under any filename, on the bolt geometry even if recolored, and on any surviving `logo.svg` reference. It runs in `pnpm build`, in CI before install, and in `.git/hooks/pre-commit`. Run `sh scripts/install-hooks.sh` once per clone. **Do not weaken, skip, or allowlist your way past this check.**

## Shared memory

All sessions must read and write memories to:

```
/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo/memory/
```

Check `MEMORY.md` there at the start of every conversation.

## What lives here

| Path | Purpose |
| --- | --- |
| `src/components/` | TypeScript React components — the shipped package source (20 components) |
| `src/tokens.css` | Tailwind v4 `@theme` block — **the design token source of truth** |
| `src/index.css` | Package entry: `@import "tailwindcss"`, `@import "./tokens.css"`, `@font-face`, base resets |
| `src/brand.css` | Brand utilities — `.hanko`, `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame`, `.emboss-bg` |
| `dist/tokens.plain.css` | **Generated** from `src/tokens.css`. The only `dist/` file that is committed, because the preview pages import it and are served with no build step |
| `colors_and_type.css` | Preview harness stylesheet. Imports the generated tokens; declares only non-colour harness primitives |
| `storybook/` | Custom HTML storybook (uses JSX mirrors in `ui_kits/mobile/components.jsx`) |
| `ui_kits/` | JSX component mirrors and screen mockups for design/preview use |
| `preview/` | Static HTML design spec pages |
| `PRODUCT.md` | Durable product truth — users, purpose, constraints, brand commitments |
| `DESIGN.md` | The visual system + per-surface taste dials + which skill generators are disabled |
| `scripts/` | `check-forbidden-assets` (brand), `build-tokens`, `check-adherence` |
| `SKILL.md` | Claude Code plugin entry point — defines the `/aburungo-design` skill |

## ⚠️ One token source — do not hand-edit the copies

`src/tokens.css` is the only place a token value is written. `pnpm build` runs
`scripts/build-tokens.mjs`, which:

1. emits `dist/tokens.plain.css` (consumed by `colors_and_type.css` → all 27 preview pages), and
2. **regenerates the `@theme` block inside `storybook/index.html` and all three `ui_kits/*` harnesses**, between `/* build-tokens:start */` and `/* build-tokens:end */` markers.

**Anything you type between those markers is overwritten on the next build.** Change
`src/tokens.css` instead. A palette change is a one-file diff; if you find yourself
editing a second file to change a colour, stop — that is the bug this exists to prevent.

The Tailwind CDN the harnesses use will not process `@theme` out of an imported
file, which is why the block is injected rather than imported. Don't "simplify" it
back to an `@import`.

## Commands

```
pnpm build        brand check → lint → tsup → regenerate tokens
pnpm dev          tsup --watch for live rebuilds during development
pnpm typecheck    tsc --noEmit
pnpm lint         oxlint (adherence config) + scripts/check-adherence.mjs
pnpm build:tokens regenerate dist/tokens.plain.css and the harness @theme blocks
```

`build:tokens` runs **after** `tsup` — tsup has `clean: true` and would otherwise
delete the generated sheet.

## Consuming app

The AburunGo app lives at `../aburungo`. It imports from this package as:

```ts
import { Button, PhraseCard } from 'aburungo-design-system'
```

After any changes here, run `pnpm build` before testing in the app. The app's pnpm `file:` link resolves to `dist/` via the `exports` field.

## Component rules

- All components in `src/components/` are pure React + TypeScript. No app routing, no Supabase, no Zustand.
- Use Tailwind v4 utility classes from `src/tokens.css` tokens only. No inline styles, no hard-coded hex values. Enforced by `scripts/check-adherence.mjs` in `pnpm lint`, which fails the build.
- Touch targets ≥ 44px. `active:` states required. No hover-only affordances.
- No gamification: no XP, hearts, badges, streaks, mascots, or reward-loop ornaments.
- Export all public components from `src/components/index.ts`. Never export internals.

## Design rules

- Restraint over decoration: colour lands on CTAs, focus rings, and the brand mark, nowhere else. Each is a separate role token in `src/tokens.css` — use the role, never a hex. Values live in `docs/colors.md`.
- Noto Sans for English UI (`font-sans`), M PLUS Rounded 1c for Japanese content (`font-jp`).
- Filled inline SVG icons only. No emoji, no outline icons.
- Prefer role tokens (`bg-surface`, `text-fg-muted`) over value tokens (`brand-500`).
- `DESIGN.md` is the full visual spec — palette roles, type hierarchy, the maru boundary rule, per-surface taste dials, and which skill generators are switched off. Read it before any design work.

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
4. Run `pnpm lint` — adherence (no raw hex, no non-DS fonts) must pass.
5. Run `pnpm build` to verify the dist output.
6. Add a story to `storybook/stories.jsx` **and** a JSX mirror to `ui_kits/mobile/components.jsx`. A component with no mirror is invisible in every harness — this is the known drift machine, so do it in the same commit.
7. Run `/handoff-to-app` to generate the integration spec for the AburunGo app.

## Git workflow

- **Never commit or push directly to `main`.** Always create a feature branch first.
- **Branching:** Check current branch with `git branch --show-current`. If on `main`, create and switch to a descriptive branch before making any changes: `feature/`, `fix/`, or `docs/` prefix as appropriate.
- **Branch names must be descriptive.** No auto-generated or random strings. Examples: `feature/score-card`, `fix/flip-animation`, `docs/storybook-fill-input`.
- **Commit format:** Conventional Commits — `<type>(<scope>): <description>`. Types: `feat`, `fix`, `refactor`, `docs`, `build`. Subject max 50 chars, no trailing period. ASCII only.
- **Review before writing message:** Always run `git status` and `git diff` before crafting the commit message.
- **Atomic commits:** Commit at logical boundaries. Do not bundle unrelated changes.
- **Never push without explicit user confirmation.** After committing, stop and ask before running `git push`.
- **Never create a PR unless asked.** Push the branch and wait.
- **After pushing:** the user will review and merge via PR. Do not merge branches yourself.
