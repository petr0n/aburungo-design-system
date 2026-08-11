# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Peter Abeln, solo developer, building and maintaining AburunGo. Works in this repo to change how the app looks and behaves, then rebuilds and tests in `../aburungo`.

**Secondary:** Claude Code sessions operating in either repo. They are a real consumer — much of this repo's structure (CLAUDE.md, the enforced brand check, non-overridable component APIs) exists because guidance alone did not survive across sessions.

**Downstream, not direct:** the AburunGo learner — an adult English speaker studying Japanese, on a phone, over months. This library never talks to them directly; every constraint below exists to serve them through the app.

## Product Purpose

The single source of design tokens and stateless React components for AburunGo. It exists so that a visual decision is made once, in one file, and reaches every surface — rather than being re-decided per screen.

Success is that a design change is a one-file diff, and that a rule the product depends on cannot be violated by a call site that forgets it.

## Positioning

Two things distinguish this from an ordinary internal component library:

1. **Product rules are enforced through API design, not convention.** `AnswerResult` holds its verdict wording in a constant with no prop to override it, because two call sites that each owned their own copy had already drifted to different words for the same state. When copy can drift, the prop is removed.
2. **Stateless by contract.** Every component is pure presentation; the app owns all stateful adapters. Drill logic like `compareAnswer` stays in the app deliberately.

## Operating Context

- Consumed by `../aburungo` via a local package reference; `pnpm build` compiles to `dist/`, which the app's `exports` field resolves. Changes here are invisible to the app until it is rebuilt.
- Touch-first, mobile-primary. Reviewed at 375 / 768 / 1024 / 1440.
- Design review happens on static harnesses, not in the app: a custom storybook and 27 `preview/` spec pages, served over `python3 -m http.server` (they do not work from `file://`).
- Every TSX component is mirrored by hand as JSX in `ui_kits/mobile/components.jsx`. New components do not appear in any harness until mirrored.
- CI runs a forbidden-asset check before install, then typecheck and build. A git pre-commit hook runs the same check; `sh scripts/install-hooks.sh` once per clone.

## Capabilities and Constraints

**Contents:** 21 components, 24 exports (`Card` also ships `CardHeader` / `CardBody` / `CardFooter`) — 5 primitives (`Button`, `TextInput`, `Card`, `Badge`, `IconButton`) and 16 domain components — plus design tokens, brand CSS utilities, and a second entry point (`/lib`) for pure logic (`kanaData`, `romajiToKana`).

**Hard boundaries:** no routing, no Supabase, no Zustand, no runtime dependencies. Components are pure React + TypeScript.

**TypeScript:** `verbatimModuleSyntax` and `erasableSyntaxOnly` on — no parameter properties, no enums, `import type` for type-only imports. No `any`. No `as` casts outside validated trust boundaries. Functional components only, with an explicit `Props` type. Public API exported from `src/components/index.ts`; internals never exported.

**Interaction floor:** touch targets ≥ 44px, `active:` states required, no hover-only affordances, filled inline SVG icons only, no emoji.

**No gamification:** no XP, hearts, badges, streaks, mascots, or reward-loop ornaments.

**How decisions are made here.** Design calls are currently made against
components in isolation — no screen, no flow, no session. They are therefore
**provisional**, including ones that contradict each other. Raise conflicts,
propose a resolution, keep moving; nothing is frozen until it has been seen in
context. Designs that keep the choice open (a prop rather than a fixed value)
are preferred for the same reason.

**Explicitly undecided:**
- Whether Akane should stay confined to the mark and error states. It is currently available as a card accent too, which overlaps with its error meaning. Recorded, not settled.
- Whether `.emboss-bg` and link styling get component owners, or stay ad-hoc in the app.

## Brand Commitments

- **Name:** AburunGo.
- **The mark is the ア hanko**, in Akane. The purple lightning-bolt glyph is Supabase's trademarked logo, was never the AburunGo mark, and is banned. It was repeatedly revived from old branches because prose describing it read as authoritative, so it is now enforced by `scripts/check-forbidden-assets.mjs` in build, CI, and a pre-commit hook — not by documentation. Do not weaken or allowlist past that check.
- **Type is locked:** Noto Sans for English UI, M PLUS Rounded 1c for Japanese content.
- **Colour is structural, and it carries meaning.** Every hue answers "what is this for"; none are decorative. v3 "Zuihoden" expresses that as five colours with one job each on warm stone. Where a component's colour can legitimately vary — a card accent by scenario — it is a **prop over the brand set**, never an invented hex and never one value locked per component. Roles live in `src/tokens.css`.
- **Verdict wording is owned by the library and not overridable:** `Recalled!` / `Not quite`. Banned as a verdict: "correct", "wrong", "incorrect", "failed", "missed", percentages, letter grades, pass/fail. "Worth another look · n" is valid as a list heading only.
- **The maru boundary rule**, binding: *A maru marks an answer. It never accumulates. Transient and per-answer is annotation. Persistent and per-user is a badge. The moment a maru survives onto a profile screen, it has become gamification.*
- **Voice:** the interface reads more serious than the copy sounds. Calm, concise, literate, dry rather than cheerful. Playfulness belongs in empty states and progress language, never in structure. Full brief in `docs/design-direction.md`.

## Evidence on Hand

- `docs/design-direction.md` — the brand brief. The authority for tone and personality.
- `docs/colors.md` — palette rationale and values.
- `docs/superpowers/specs/` — dated design specs recording why a decision was made, including which alternatives were built and rejected.
- `assets/logo-a-128.png`, `assets/logo-a-tile.png` — the mark as raster.
- `fonts/` — Noto Sans variable TTFs, shipped locally.
- The v3 "Zuihoden" drop: a full parallel snapshot of this repo, repainted, with its own `HANDOFF.md`, `INTEGRATION.md`, and adherence lint config.

**Absences future work must not paper over:** there is no vector version of the mark — the rasters are hue-remapped and adequate on screen, but a redraw is required before large or print use. There is no dark mode, in the brief or the tokens. There are no user research findings, usage analytics, or testimonials; this product has one known user.

## Product Principles

1. **One source, or it will drift.** Every duplicated definition in this repo — tokens across seven files, components mirrored as JSX, verdict copy in two call sites — has already caused a regression. The tokens are now consolidated: `src/tokens.css` is the only place a value is written, and `pnpm build` propagates it. The JSX mirrors are the remaining duplicate. Consolidation is the highest-value work available at any time.
2. **Enforce in the API, not the docs.** If a rule can be violated by a call site that forgets it, remove the prop or add a check that fails the build. Prose that reads as authoritative but isn't enforced has repeatedly caused the exact regression it warned against.
3. **Stateless by contract.** The library owns presentation; the app owns state and domain logic. This is what makes a component reviewable in a static harness with no build step.
4. **Touch-first, no hover-only.** The learner is on a phone. An affordance that only exists on hover does not exist.
5. **Reflection, not reward.** Feedback describes what happened, never scores the person. The line sits at prose and persistence: a per-answer mark is annotation; verdict prose and anything that accumulates onto a profile is a reward loop.

## Accessibility & Inclusion

WCAG 2.1 AA — 4.5:1 for text, 3:1 for non-text indicators — is the **target**, and `scripts/check-contrast.mjs` reports every miss on every build. It is advisory rather than blocking: the palette author owns the call, and some misses are deliberate. What is not acceptable is a miss nobody knows about, or quietly re-tinting a brand value to turn a number green.

- Correctness marks (○ / ✕) carry meaning on **three channels** — glyph, colour, and text label. Never colour alone, never the glyph alone. A screen reader must never receive a bare "circle".
- Visible keyboard focus on every interactive element, on every surface it can land on.
- Touch targets ≥ 44px.
- `prefers-reduced-motion` must be honoured. It currently is not — see Capabilities and Constraints.
