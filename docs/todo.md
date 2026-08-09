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

---

## 3. Give the app a visual identity — kamon and modern woodcut

**The ask, in the author's words:** *"It's so bland and lacks any style. I want
to add creative backgrounds that use japanese clan symbols. I want more japanese
aesthetic like modern woodcut art."*

### Why this fits better than it looks

v3 "Zuihoden" is **already a woodblock palette**. Five flat colours, one job
each, printed on warm paper — that is mokuhanga's constraint, not a coincidence.
The system has the vocabulary and has simply never spent it on anything but
controls. Techniques worth stealing directly:

- **Key-block outline** — the black line drawing every colour registers against.
- **Registration offset** (kentō 見当) — deliberate 1–2px misalignment between a
  colour field and its outline. Reads as hand-printed rather than as a bug.
- **Bokashi** (ぼかし) — the hand-wiped gradient at a colour's edge. The one
  gradient this system could justify.
- **Mokume** — visible wood grain in the flat fields.

### What already exists and is going to waste

[`src/brand.css`](../src/brand.css) ships a **complete embossed-pattern system**
that nothing uses:

- `.emboss-bg` — tiling ground with `isolation`, z-indexed children, blend modes
- per-surface presets: `.on-paper` `.on-warm` `.on-cream` `.on-mist`
- dark-surface handling: `.on-brand` / `.on-plum` invert the tile and switch to
  `soft-light`, so a pattern reads as embossed shadow rather than a bleached blob
- density modifiers: `.tile-sm` and friends

**Zero components use it**, and its asset is missing: `brand.css:123` points at
`/assets/pattern-sakura.png`, which is not in `assets/`. It has been painting
nothing, silently, because a failed `background-image` just doesn't render.
`.emboss-bg` is also a §2.6 orphan role with no owner — this is its answer.

Also unused and relevant: `.wm` (oversized watermark type), `.kata-vert`
(vertical katakana), `.frame`, `.ctype`.

### The tension to resolve first

`CLAUDE.md` says **"restraint over decoration"** and bans gamification ornament.
This item asks for more decoration. Both were written by the same person, so it
is a real call, not a gotcha.

**Proposed reading, for the author to accept or reject:** the restraint rule is
about *saturated colour on interactive surfaces* — it exists so an accent means
something when it appears. Texture on a **ground** is a different axis. A
low-contrast woodcut field behind a card does not compete with a button, and
does not make a control ambiguous. Under that reading both rules stand and this
work is unblocked. If the author disagrees, the rule wins and this item shrinks
to empty states and chrome only.

### Cautions that are not negotiable

- **Kamon are circular, and ○ already means "correct."** A circular crest
  behind or beside content can read as a maru. Keep crests off any surface where
  an answer is being judged, or use non-circular framings.
- **Some kamon are not free to use.** The 16-petal chrysanthemum (菊花紋章) is
  the Imperial Seal, and the paulownia (五七桐) is used by the Japanese
  government. Avoid both. Prefer geometric motifs without state association —
  and note that "clan symbol" means a real family's crest, so pick with the same
  care you would give any borrowed heraldry.
- **Nothing here becomes an alternative logo.** The ア hanko is the mark. See the
  absolute rule at the top of `CLAUDE.md`.
- **Legibility is the gate.** Japanese sits at `jp-display` on these grounds.
  Any pattern has to keep body text above 4.5:1 and non-text above 3:1, and be
  checked with `scripts/check-contrast.mjs` extended to cover patterned grounds
  — it currently only understands flat colours.

### Where it should land, roughly in order

1. **Empty states** — the hanko already anchors them; the most forgiving place
   to establish the vocabulary and the least likely to hurt a task.
2. **The header band** — Sumi-iro is a large flat field with an Ōgon hairline;
   a key-block texture there is nearly free.
3. **Page grounds per scenario** — this is option C from the colour review,
   which lost to "colour the card". Texture may be the version of C that works,
   since it adds identity without taking the card's separation away.
4. **The scenario card** — `.emboss-bg`'s intended owner per the plan's
   Phase 3B table, and the one surface where the pattern is already sanctioned.

Render options rather than argue them: every colour decision in this project has
been made by putting three versions on a phone and looking.
