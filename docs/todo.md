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

**Updated 2026-08-10 — the utility now works and is measured.** What follows
described a system that was painting nothing; that is fixed. What remains true
is that **zero components use it**, so `.emboss-bg` is still a §2.6 orphan role
and this item is still its answer.

[`src/brand.css`](../src/brand.css) ships:

- `.emboss-bg` — tiling ground with `isolation` and z-indexed children
- `.crest-1` / `.crest-2` — which clan crest tiles the ground
- density modifiers: `.tile-sm` / `.tile-md` / `.tile-lg`
- knobs: `--emboss-opacity` (default `.35`), `--tile-size`, `--emboss-blend`

Three things changed and matter to this item:

1. **The missing asset is fixed.** It pointed at `/assets/pattern-sakura.png`,
   which did not exist — a failed `background-image` renders nothing, silently.
   It now uses `assets/clan-symbol1.png` / `clan-symbol2.png`, relative so the
   consuming app's bundler rewrites them.
2. **The six surface presets were deleted** (`.on-paper` `.on-warm` `.on-cream`
   `.on-mist` `.on-brand` `.on-plum`). v2 holdovers — two named tokens that no
   longer exist, the rest named legacy aliases, and all tuned for the deleted
   white sakura tile. Set the knobs directly.
3. **Legibility is settled, and it constrains this item.** See The Patterned
   Ground Rule in `DESIGN.md`: a pattern carries `fg`, `fg-heading` and
   `fg-muted` only — **`fg-subtle` and `fg-faint` fail at any opacity that
   leaves the pattern visible.** `EmptyState` and `ErrorState` use
   `text-fg-subtle` for their description, so step 1 below cannot simply drop a
   pattern behind them; the pattern goes behind the card, or that line promotes
   to `fg`. `scripts/check-contrast.mjs` now covers this and fails the build.

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

---

## 4. The app is growing surfaces that never touch the design system

**Found 2026-08-10**, while auditing the migration plan. Not scheduled — parked
here so it doesn't get re-derived.

Five components landed on the app's `feature/terminal-checkpoints` branch. **None
of them import `aburungo-design-system`.** Not one line:

| App component | Lines | What it is |
|---|---|---|
| `CanDoCheckpoint.tsx` | 255 | a checkpoint gate |
| `HanaChat.tsx` | 155 | a streaming chat UI |
| `CheckpointSweep.tsx` | 111 | a sweep queue runner |
| `UnitConversation.tsx` | 104 | scoped conversation entry |
| `FeedbackSheet.tsx` | 96 | a feedback sheet |

Their only imports are React, `@/types`, `@/api/*`, `@/srs/*`, and each other.

**What they do use** is the token sheet — the app imports
`aburungo-design-system/src/tokens.css`, so `text-fg-subtle`, `text-body-sm`,
`rounded-2xl` all resolve. So this is not a rogue visual language. It is ~720
lines of hand-rolled layout sitting *on top of* our tokens, with no component
between.

**Two things that make it worse than "they'll import later":**

- **They are on the outgoing ramp.** `bg-brand-700`, `text-brand-600` — the v2
  purple, the exact vocabulary v3 replaces. Every one of these files is v3
  migration work that nobody has counted.
- **`text-white` appears in all five.** That is a raw Tailwind colour, not a role
  token. On warm stone (`#FFFDF8`) pure white is the thing the palette
  deliberately does not use. `check-adherence.mjs` runs on `src/` in *this* repo,
  so it never saw them.

### 4a. Every focus ring in the app is Akane

**Found 2026-08-10**, while re-auditing orphaned roles against both repos. This is
the sharpest instance of the ramp problem above, and it is a live defect rather
than a tidiness one.

The app styles focus **8 times** on `ring-brand-500` / `focus:border-brand-500`,
and uses this package's `ring-focus` **zero times**. `--color-brand-500` resolves
to `#D72E2E` — **Akane**. So a focused input draws a ring in the colour reserved
for errors and for the hanko: focused and errored look identical.

Nobody wrote this bug. `brand-500` was v2 purple, a purple ring was unremarkable,
and repointing the alias to Akane turned all 8 red without one file changing.

Sites: `HanaChat.tsx:142`, `FeedbackSheet.tsx:80`, `KanaPage.tsx:122,130`,
`KanaPracticePage.tsx:402`, `AdminLoginPage.tsx:161,178`, `AdminLogsPage.tsx:97`.

Coverage is separately thin: 32 app files contain interactive elements, 7 have
any focus styling at all.

Nothing can catch this. `scripts/check-adherence.mjs` has a
`focus-ring-without-offset` rule, but it scans `src/components/**` *in this repo*
— the app's focus styling is ungated by anything, here or there.

**Do not simply repoint the 8 sites to `ring-focus`.** That trades a semantic bug
for a contrast one: `--color-focus` is Ōgon, which is **2.26:1 on the page** and
is one of the four `KNOWN` failures in `check-contrast.mjs`. Plan task 5.7 already
reserves the focus ring for the palette author. **Two repos now wait on that one
decision, which is the argument for raising it rather than working around it.**

Order: (1) settle Ōgon-or-darker with the palette author, (2) repoint all 8 in one
pass, (3) decide whether adherence should run against the app's `src/` too.

**What to work out when this is picked up:**

- Which of the five are genuinely app-shaped (routing, streaming, API state) and
  which are DS-shaped surfaces that got built in the wrong repo. `HanaChat`'s
  message bubbles and `FeedbackSheet` are the obvious candidates.
- Whether the boundary is even discoverable. A developer in the app has no signal
  telling them a sheet or a bubble belongs here — which is the same gap that let
  `FillBlankCard` and `GrammarClozeCard` drift apart before `AnswerResult`.
- Whether `check-adherence` should run against the app's `src/` too, or whether
  that is the app's own gate to own.

**Do not start by rewriting these.** The app branch is active. Read it after it
lands, or the diff moves under us.
