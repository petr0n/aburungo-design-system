---
name: aburungo-design
description: Use this skill to design or build AburunGo interfaces and assets — production components, throwaway mocks, prototypes, slides, or marketing — for the practical Japanese-learning app for English speakers. Covers the v3 "Zuihoden" palette, type, the ア hanko mark, voice, and the real-component harnesses. Anti-gamification is core: no points, streaks, hearts, badges, mascots, or reward loops.
user-invocable: true
---

# AburunGo design skill

## Read first, in this order

1. `DESIGN.md` — the visual system. Use its Contents list; read only the sections the task touches.
2. `docs/colors.md` — palette authority, every role token, every deviation.
3. `PRODUCT.md` — users, purpose, voice.

Do **not** use `README.md` as a design source. Parts of it still describe the retired v2 palette.

If invoked with no task, ask what to build, then proceed.

## Non-negotiables

1. **No gamification.** No points, XP, streaks, hearts, badges, mascots, level-ups, or reward-loop ornaments.
2. **Touch-first.** Every control ≥ 44px. Every control has an `active:` state. No hover-only affordances.
3. **Five colours, one job each, on warm stone.** Use role tokens (`bg-surface`, `text-fg-muted`), never a hex. Page `#F7F6F1`, cards `#FFFDF8` — never "clean up" to white.
4. **One dark slab per screen.** Header band is Sumi-iro; the kana keyboard is Rokushō.
5. **The mark is the ア hanko** (`.hanko`, `assets/logo-a-128.png`, `var(--color-accent)`). The lightning-bolt glyph is banned.
6. **Type:** Noto Sans for English UI (`font-sans`), M PLUS Rounded 1c for Japanese (`font-jp`).
7. **Icons:** filled inline SVG only. No emoji, no outline icons, no unicode glyph icons.
8. **Voice:** plain, declarative, second person. No emoji. No exclamation marks unless load-bearing.

## Where output goes

| Output | Location |
| --- | --- |
| Design variants, mocks, explorations | `preview/_sandbox/` as static HTML. Append-only: tag rejected options, never delete them |
| A screen built from real components | `ui_kits/flows/` (registry: `ui_kits/flows/registry.ts`) |
| A production component | `src/components/` — only after a sandbox variant is chosen. Follow CLAUDE.md "Adding a new component" |

## Verify with code, not by eye

Run these. Do not hand-check what a script checks.

```
pnpm check:brand    # banned mark, by blob and geometry
pnpm lint           # raw hex, non-DS fonts, contrast, harness tests
pnpm build          # all of the above + tokens + flows bundle
pnpm verify         # build + touch-target gate in a real browser
pnpm shots          # render every surface to scripts/.shots-out/ to look at
```

Judge the work by the rendered screen (`pnpm shots`), not by the diff.
