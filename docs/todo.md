# TODO

Design work that is queued but not scheduled into a phase. Items move out of
here into `color-palette-and-app-flow-plan.md` when they get picked up.

---

## 1. Give the loading screen motion

**Where:** [`src/components/LoadingPlaceholder.tsx`](../src/components/LoadingPlaceholder.tsx)

**What's wrong.** The whole component is one line of faint text, centred in a
`min-h-[30vh]` box:

```tsx
<p className="text-body-sm text-fg-faint">{label}</p>
```

Nothing moves, so nothing distinguishes "loading" from "stalled". A learner who
has lost signal sees the same screen as one whose round is two seconds away.
It's also the only state in the product that gives no feedback at all — even
the empty state has the hanko.

**Parts that already exist:**

- `SpinnerIcon` in [`src/components/icons.tsx`](../src/components/icons.tsx),
  already used with `animate-spin` by `AudioButton` and `VoiceInput`. Reuse it
  rather than inventing a second loading vocabulary.
- The reduced-motion guard in `src/tokens.css` neutralises `--animate-card-*`
  only, and says so deliberately: *"motion that carries meaning — a spinner, a
  progress fill — survives."* So a spinner is already sanctioned; a decorative
  flourish is not.

**Worth deciding while doing it:** whether loading should be a spinner at all,
or a skeleton of the card that is about to arrive. A skeleton holds the layout
and stops the page jumping when content lands, which matters more here than on
most surfaces because the card is the whole screen. A spinner is cheaper and
already in the vocabulary. Render both before choosing.

**Constraints:** no gamification ornament; filled inline SVG only, no emoji;
must survive `prefers-reduced-motion` without becoming invisible.

---

## 2. Make an error look like an error

**Where:** [`src/components/ErrorState.tsx`](../src/components/ErrorState.tsx)

**What's wrong.** `ErrorState` and `EmptyState` are the same component wearing
different type sizes. Diffed, they differ on **three lines, all typographic**:

| | `ErrorState` | `EmptyState` |
|---|---|---|
| message | `text-heading-sm font-semibold` | `text-body font-medium` |
| description | `text-body` | `text-body-sm` |
| action | `<div>` | `<div className="mt-1">` |

Same layout, same centring, same neutral palette. **Akane appears nowhere** —
the colour this system reserves for exactly this job. "Nothing due right now"
and "Couldn't load this card" are two completely different situations, and a
learner cannot tell them apart at a glance.

**What it needs:** a signal that reads before the words do. Candidates, to be
rendered and compared rather than argued:

- A filled Akane glyph or mark above the message — the counterpart to the
  hanko anchoring the empty state.
- An Akane-toned panel, reusing the `error-bg` / `error-border` / `error-fg`
  roles `AnswerResult` already wears, so the vocabulary matches.
- An Akane rule or edge, echoing the card accent treatment.

**Constraints:**

- Akane is the mark and errors, never a CTA — the retry button stays Ai-iro.
- Approved wording only: no "failed", no blame. The existing copy states that
  progress is intact, which is the right instinct and should survive.
- Whatever lands must also read on the `?state=error` deep links of all three
  flows, not just in isolation.

**Related:** `EmptyState` should probably keep its quiet treatment. The point is
that the two stop being interchangeable, not that both get louder.
