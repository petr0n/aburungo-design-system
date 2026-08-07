# AnswerResult + Maru — design

**Date:** 2026-08-07 · **Branch:** `feature/answer-result` · **Status:** built, committed on `feature/answer-result`

## Problem

The components that judge an answer in the shipped app are not design-system components. `FillBlankCard` and `GrammarClozeCard` each hand-roll an identical result banner out of `bg-success-bg` / `bg-error-bg`, and `KanaPracticePage` marks its choice tiles with literal `"✓ "` / `"✗ "` strings.

Because nothing owns the pattern, each surface re-decides its own copy. That is why `FillBlankCard:65` renders `"Correct!" / "Not quite"` while `GrammarClozeCard:61` renders `"Recalled!" / "Worth another look"` — the same component, written twice, disagreeing about the words. The drift is structural, not carelessness.

It also means §3.0's correctness vocabulary reaches no surface that actually judges an answer: the plan puts ○/✕ on `FlipCard`, `ScoreCard`, `KanaGrid`, and `EmptyState`, none of which are where the app checks an answer.

## Decisions taken

| Question | Decision |
|---|---|
| Scope | The verdict banner (`FillBlankCard`, `GrammarClozeCard`) plus `KanaPracticePage`'s choice tiles. Self-grading (`WordDrillCard`, `KanjiDrillCard`) already routes through `FlipCard` and is untouched. `RecognitionPass` shows no feedback by design and is untouched. |
| Reveal style | **Tinted banner above a neutral reveal block** — the treatment both consumers already had. A quiet, markless reveal was built first and rejected on review of the rendered result (2026-08-07); the banner reads better in place. |
| Verdict prose | **Owned by the component, not passable.** `Recalled!` / `Not quite` — the approved wording. Call sites cannot supply their own, which is what stops the drift. |
| Glyph ownership | One `Maru` component, exported independently. `AnswerResult` does not use it; `KanaPracticePage` uses it directly on choice tiles, replacing literal `"✓ "` / `"✗ "` strings. |

## API

```tsx
export type AnswerOutcome = 'recalled' | 'review'

// Maru — the mark itself.
type MaruProps = {
  outcome: AnswerOutcome
  /** Visually-hidden label. Defaults to the outcome's approved wording. */
  label?: string
  className?: string
}

// AnswerResult — the banner + reveal frame.
type AnswerResultProps = {
  outcome: AnswerOutcome
  /** What the learner typed. Shown in the banner when passed. */
  userAnswer?: string
  /** The correct answer — JP, reading, polite forms. The consumer's shape. */
  children: ReactNode
}
```

**`outcome`, not `correct: boolean`.** A boolean invites `correct ? "…" : "…"` at every call site, which is exactly how the copy drifted. Naming the states after the approved vocabulary keeps the banned words out of the component's type.

**Content is `children`, not a prop.** The two consumers render Japanese, reading, and sometimes polite forms; the shapes differ. The design system owns the frame — banner, wording, `You answered` line — and card semantics stay with the card.

## Rendering

`AnswerResult` renders a tinted banner (`bg-success-bg` / `bg-error-bg`) carrying the headline and, when `userAnswer` is passed, a `You answered: …` line — above a neutral `bg-surface-2` block holding the children.

`Maru` renders ○ in Rokushō (`text-success-500`) for `recalled`, ✕ in Akane (`text-error-500`) for `review`, each with a visually-hidden label.

## Accessibility

`AnswerResult` states its outcome in words, so it never depends on colour alone.

`Maru` is the case Phase 3's gate is about — it requires meaning on three channels and states that a screen reader must never receive a bare "circle". The glyph is `aria-hidden`, paired with an `sr-only` span carrying the approved wording. Sighted users get shape plus colour; screen-reader users get a word; shape alone distinguishes the states if colour is stripped.

## Boundaries

`compareAnswer` stays in the app. It is drill logic, not a design system concern, and the app keeps computing the outcome and passing it in. This follows the existing stateless-in-ADS / stateful-adapter-in-app split.

## Blast radius

**This repo:** two new components, two new exports, one JSX mirror, one story.

**`../aburungo`:** three files. `FillBlankCard` and `GrammarClozeCard` lose ~35 lines of duplicated banner between them; `KanaPracticePage` swaps its `"✓ "` / `"✗ "` string markers for `Maru`. Requires `pnpm build` here first, since the app resolves through `dist/`.

## Out of scope

- `RecognitionPass` — shows no per-answer feedback. Whether it should is a separate product question.
- `ScoreCard`'s `label` default was flipped to `"recalled"` in the same branch — it fixed two app call sites with no app change.
- The plan's "no new components — 18 is enough" exclusion is now wrong and should be amended to record this component and why.
