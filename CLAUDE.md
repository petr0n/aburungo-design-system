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
| Colour | Akane 茜色 `#D72E2E` — `var(--color-accent)` in CSS, matching the rasters |

> **Closed 2026-08-10.** This carried a "Known gap" saying `.hanko` filled with the outgoing purple and that `--color-accent` did not exist yet. Both are false now: `--color-accent` is defined at `src/tokens.css:173` as Akane `#D72E2E`, `.hanko` fills with `var(--color-accent)`, and `brand.css` contains no `brand-500` reference at all. The CSS mark and the raster mark are the same colour. Plan task 5.5d is done. The instruction that still stands: **do not hard-code Akane** — use `var(--color-accent)`.

This is enforced, not just documented. `scripts/check-forbidden-assets.mjs` fails on the exact blob under any filename, on the bolt geometry even if recolored, and on any surviving `logo.svg` reference. It runs in `pnpm build`, in CI before install, and in `.git/hooks/pre-commit`. Run `sh scripts/install-hooks.sh` once per clone. **Do not weaken, skip, or allowlist your way past this check.**

## 🔴 HIGH-PRIORITY RULE — never report a problem without a recommendation

**Every finding ships with a fix.** If you tell the author about a gap, nit, caveat,
risk, stale doc, failing check, "one thing to note", "worth flagging", or anything
else you noticed — you must attach, in the same message:

1. **What you recommend**, stated as a decision, not a menu. Lead with it.
2. **The concrete fix** — the file, the line, the change. Not "this could be improved."
3. **The cost**, if it isn't obvious: one line vs. an afternoon.
4. **Options only when they genuinely differ**, and only after your recommendation.
   Two or three, each with a one-line trade-off. Never a survey.

Applies to every place a finding can appear: audits, reviews, sitreps, the last
paragraph of an unrelated answer, and especially the trailing "one more thing"
that used to get dropped with no follow-through.

**Banned shapes:**

- A finding with no recommendation attached.
- "Worth deciding", "worth a look", "something to consider", "you may want to" —
  with nothing after it. Decide, then say what you decided and why.
- Ending a message on a problem. End on a proposed action.
- Burying the recommendation under paragraphs of evidence. Recommendation first,
  evidence under it.
- Asking "want me to fix it?" *instead of* saying what the fix is. Say the fix,
  then ask for the go-ahead.

**If you genuinely can't recommend** — the call is the author's taste, or it needs
information you don't have — say that explicitly, say what you'd need to decide,
and give your best guess anyway. "I don't know" is not an acceptable stopping point;
"here's my read, and here's what would change it" is.

This rule outranks brevity. A shorter message that drops the recommendation is
worse than a longer one that keeps it.

## Shared memory

All sessions must read and write memories to:

```
/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo/memory/
```

Check `MEMORY.md` there at the start of every conversation.

## What lives here

| Path | Purpose |
| --- | --- |
| `src/components/` | TypeScript React components — the shipped package source (21 components, 24 exports) |
| `src/tokens.css` | Tailwind v4 `@theme` block — **the design token source of truth** |
| `src/index.css` | Package entry: `@import "tailwindcss"`, `@import "./tokens.css"`, `@font-face`, base resets |
| `src/brand.css` | Brand utilities — `.hanko`, `.maru`, `.wm`, `.kata-vert`, `.ctype`, `.frame`, `.emboss-bg` |
| `dist/tokens.plain.css` | **Generated** from `src/tokens.css`. The only `dist/` file that is committed, because the preview pages import it and are served with no build step |
| `colors_and_type.css` | Preview harness stylesheet. Imports the generated tokens; declares only non-colour harness primitives |
| `storybook/` | Custom HTML storybook (uses JSX mirrors in `ui_kits/mobile/components.jsx`) |
| `ui_kits/flows/` | **Flow mockups built from the real components** — TSX importing `src/components`, bundled by `pnpm build:flows`. Deep-linkable states (`?state=empty`) |
| `ui_kits/` | JSX component *mirrors* and screen mockups. Hand-written copies — see the drift warning below |
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
pnpm build:flows  bundle ui_kits/flows/*.tsx -> ui_kits/flows/bundle.js
pnpm shots        render every surface to scripts/.shots-out/ (gitignored)
```

## ⚠️ Two kinds of harness — know which one you are looking at

`ui_kits/mobile/`, `ui_kits/app/` and `storybook/` are **hand-written mirrors**.
Each component is typed out a second time in browser JSX. They do not import
`src/components`, so a component can be correct in TSX and wrong on screen —
`ui_kits/mobile/screens.jsx` still renders a bare-`<h1>` `AppHeader` and v2
colours. Adding a component means mirroring it by hand, in the same commit.

`ui_kits/flows/` is **not a mirror.** It imports `src/components` and is
bundled. Prefer it for anything screen-shaped: it cannot drift, and it is where
`bg-inverse` was caught rendering nothing after passing typecheck, lint, and
the contrast gate. Build a flow before trusting a component.

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

- **Restraint over decoration.** Saturated colour is used sparingly and structurally, against a calm ground. That principle is durable; the specific palette is not — see the migration note below. Use the role token, never a hex.
- Noto Sans for English UI (`font-sans`), M PLUS Rounded 1c for Japanese content (`font-jp`).
- Filled inline SVG icons only. No emoji, no outline icons.
- Prefer role tokens (`bg-surface`, `text-fg-muted`) over value tokens (`brand-500`).
- `DESIGN.md` is the full visual spec — palette roles, type hierarchy, the maru boundary rule, per-surface taste dials, and which skill generators are switched off. Read it before any design work.

### The palette — v3 "Zuihoden", merged

Five colours, one job each, on warm stone. **Not** one accent on monochrome —
that was v2 and it is gone.

| Colour | Job |
| --- | --- |
| Akane 茜色 `#D72E2E` | the hanko, error states, and available as a card accent |
| Ai-iro 藍色 `#1F3A66` | primary action, headings, **Japanese content** |
| Rokushō 緑青 `#4F9C8D` | progress, correctness, secondary action, links, kana keyboard |
| Ōgon 黄金 `#C9A045` | focus rings, scenario tags, hairlines on dark chrome |
| Sumi-iro 墨色 `#2D2D2D` | body text and the header band |

Three things that get broken if you do not know them:

1. **Warm stone is load-bearing.** Page `#F7F6F1`, cards `#FFFDF8`. Cards are
   *lighter* than the page so they lift without a shadow. `#FFFDF8` is not a
   mistake for `#FFFFFF` — do not "clean it up".
2. **One dark slab per screen.** The header band is Sumi-iro; the kana keyboard
   is Rokushō so the screen does not get two near-black sections.
3. **Accents are inputs.** `PhraseCard` takes an `accent` prop over the brand
   set. Colour carries meaning — which scenario, which state — rather than being
   locked per component. Never invent a hex.

`docs/colors.md` is the authority, including every deviation from the drop.

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
- **Push without asking.** Commit, then push. Do not stop for confirmation.
- **Open a PR without asking**, and **give the full URL** — `https://github.com/petr0n/aburungo-design-system/pull/NN`, not "PR #NN". The author is often on a phone or another machine and cannot resolve a bare number. Same for any other link they need: artifact URLs, CI runs, deploy previews.
- **Do not merge.** The author reviews and merges. This is the one step that stays manual.
- **Exception: merge when asked.** The author will sometimes say "merge it" — then merge, and confirm CI was green first.
- **Pause only for destructive or irreversible operations** — `git reset --hard`, force-push over shared history, deleting data, rewriting published history.

> **This is the single source for git behaviour**, superseding anything narrower elsewhere. Set 2026-08-13, replacing a rule that required confirmation before every push and forbade PRs unless asked. The reasoning: this is pre-alpha with no public users, CI plus the brand and contrast gates are real protection, and a bad merge costs a revert — while a confirmation prompt on every push costs the author's time on every single change. Merging stays manual because this package is consumed by `../aburungo`, whose CI builds against **this repo's default branch**, so a merge here immediately changes what the app compiles against.
