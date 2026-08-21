# Five Books — identity, chapter pages, and checkpoints

**Status:** plan only, nothing built · **Scope:** `aburungo-design-system` — mockups, tokens and
brand utilities. No app code · **Written:** 2026-08-21 · **Branch prefix:** `feat/book-*`

> **What this plan is for.** The app has landed on Books → Chapters → Lessons and needs five books
> that look like five books. This plan designs the identity system that makes that true, and the
> 22 rendered surfaces that prove it before a line of app code changes.
>
> **What this plan is not.** It does not author content, model data, or touch `../aburungo`. The
> `Book` type already exists there and this plan does not change it — see §2.

---

## 1. Ground truth — what the app already decided

Read from `../aburungo` on 2026-08-21. **This plan does not get to contradict any of it.** Where
this document and the app's `docs/plans/` disagree, the app wins; where the app's plans and its
`src/content/` disagree, [the content wins](../../aburungo/docs/decision-records.md).

| | |
|---|---|
| **Model** | `Book → Chapter → Lesson` (DR-024). A learner never reads "N5" |
| **Book One** | Built and shipping. 11 chapters · 93 lessons (81 teaching + **12 checkpoints**) · 451 words · 207 phrases |
| **Books Two–Five** | Not started. Book Two and Three have plans; Four and Five are deliberately thin |
| **`Book` type** | Exists on `feature/multi-book-support`: `id, order, title, chapters, lessons, difficultyShift`. The book is a **parameter**, not a hardcoded ladder |
| **Chapter length** | Varies on purpose — 9 lessons in Chapter 2, 13 in Chapter 4. Padding to a fixed number would put a checkpoint mid-situation, which DR-021 exists to prevent |

### The four checkpoint kinds

The type is `"recognition" | "production" | "conversation" | "can-do"`. Mapping the ask onto it:

| Ask | Kind | Closes | Component today |
|---|---|---|---|
| "a checkpoint after each chapter" | `recognition` | a chapter | `RecognitionCheckpoint.tsx` (111 lines) |
| "a checkpoint page for each book" | `production` | a book | `ProductionCheckpoint.tsx` (126 lines) |
| "final checkpoint page" | `can-do` | the course | `CanDoCheckpoint.tsx` (255 lines) |

**`conversation` and `can-do` are gated behind Hana, which is shelved (DR-023).** They drop out of
the ladder when it is off. The final checkpoint is therefore designed here as a **surface**, and
its content route is an open question — see §8.

**All three components import nothing from this design system.** 492 lines of hand-rolled layout
sitting on our tokens with no component between. That is `docs/todo.md` item 4, and it is why the
checkpoint mockups in this plan matter more than the lesson mockups: they are the surface with no
design-system representation at all.

### Three rules every page in this plan obeys

1. **A gate, not a grade (DR-020).** The only number is how much work is left, and it shrinks to
   zero. No percentage, no score, no pass/fail, no streak. A number that *stands* is a verdict.
2. **Furigana everywhere** outside `/kanji`. Every Japanese string with kanji renders `<ruby>`.
3. **Skip is always available** on any assessment surface. It is the relief valve.

Copy follows the existing vocabulary: **"recalled"** not "correct", **"worth another look"** not
"missed". The product never tells a learner they failed.

---

## 2. The identity system

**Decided 2026-08-21 by the author: a book is a hue *and* a crest.** Two axes, so neither carries
the identity alone.

| Book | Character (from the app's plans) | Hue | Crest |
|---|---|---|---|
| **One** — the foundation | prove the method, build the habit | Rokushō 緑青 | trefoil (`crest-1`) |
| **Two** — the bridge | recognition becomes production | Ai-iro 藍色 | kaji leaf (`crest-2`) |
| **Three** — the flagship | the intermediate wall | Akane 茜色 | **to draw** |
| **Four** — register | what a form *signals*, not means | Ōgon 黄金 | five-petal blossom |
| **Five** — refinement | near-native, nuance, idiom | Sumi-iro 墨色 | **to draw** |

The ordering is not arbitrary. Rokushō already means *progress and correctness*, which is what
Book One is entirely about. Akane is the mark and the error state — the loudest colour in the
system — and Book Three is "the wall", the book that has to feel like it costs something. Sumi 墨
*is* ink, and Book Five is the book that earns its look by giving colour up.

### The named rule this creates

> **The Two-Plane Rule.** The **book hue owns the chrome** — header band, chapter headers, progress,
> checkpoint furniture. The **situation hue stays on the cards** — `PhraseCard`'s `accent` prop
> keeps meaning *which situation*, exactly as it does today.

This exists because the accent already carries situation (`SITUATION_ACCENT` in
`ui_kits/flows/lesson-list.tsx`), and without the rule a learner would see one colour meaning two
things. Chrome and card are different planes and never adjacent, so the two readings never compete.

**The rule is load-bearing and easy to break.** The obvious "simplification" — tinting the card to
match the book — collapses the two planes and destroys the situation signal. Do not.

### What varies inside a book, and what does not

The ask is "each chapter unique but following the book's theme; each page similar but not
identical". That needs a rule, or it becomes whatever the person editing that file felt like —
which is exactly how the crest ended up on 4 of 16 flow states before `DESIGN.md` got
["Which surfaces carry the ground"](../DESIGN.md).

> **Constant across a book:** the hue, the crest motif, the type scale, the card geometry.
> **Varies by chapter:** crest **density** (`tile-sm/md/lg`), crest **opacity**
> (`--emboss-opacity`), and whether the chapter opener runs the crest full-bleed or framed.

So Chapter 1 and Chapter 7 of Book Three are unmistakably the same book and unmistakably not the
same chapter. One knob per chapter, not a redesign per chapter.

---

## 3. What already exists — reuse, do not rebuild

The palette, the components and the brand utilities are built. **This plan adds one token group and
three crest wirings. Everything else is composition.**

| Layer | Reuse |
|---|---|
| **Components** | `PhraseCard`, `AppHeader`, `ProgressBar`, `ScoreCard`, `Maru`, `AnswerResult`, `GradePair`, `FlipCard`, `EmptyState`, `ErrorState`, `LoadingPlaceholder`, `FillInput`, `KanaGrid`, `KanaKeyboard`, `AudioButton`, `VoiceInput`, and `ui/{Button,TextInput,Card,Badge,IconButton}` |
| **Accents** | `--color-accent-{ogon,ai,rokusho,akane}` and their `-fg` / `-bg` pairs — all four gated in `check-contrast.mjs` |
| **Grounds** | `.emboss-bg` + `crest-1/2` + `tile-sm/md/lg` + `--emboss-opacity`, `--tile-size` |
| **Surfaces** | `.glass` and its four `rule-*` modifiers; `EmptyStage`, `PatternedStage`, `StateStage` in `ui_kits/flows/shell.tsx` |
| **Unused, and this is their moment** | `.wm` (oversized watermark type), `.kata-vert` (vertical katakana), `.ctype`, `.frame`. Four utilities with **zero consumers** — the chapter opener is the surface they were built for |
| **Harness** | `ui_kits/flows/registry.ts` + `FlowDef`. Both harnesses read one registry; a surface is added once |

### What has to be built

| # | Thing | Why it does not exist |
|---|---|---|
| A | `--color-accent-sumi` + `-fg` + `-bg` | Sumi-iro is the header band, never an accent. Book Five needs it as one |
| B | **Two crest motifs** | Only **three distinct motifs** exist. `clan-symbol1/2` are the pre-tiled versions of `flower-symbol1/2`, not separate designs |
| C | A tile of `clan-symbol-flower` | The blossom has a full-size render and no tile |
| D | `crest-3/4/5` in `brand.css` | Two are wired |

> **B is the author's, not Claude's.** The crests are hand-made in Affinity — `flower-symbol1.afdesign`
> and `flower-symbol2-tiles.afdesign` are the sources on disk. Per the standing note in
> [MEMORY.md](/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo-design-system/memory/MEMORY.md):
> **use the author's asset file directly, never hand-trace it into SVG.** This plan asks for two
> exported PNGs and does not attempt to generate them.

---

## 4. The problem the checkpoints have

**Every crest in this system is circular, and ○ already means "recalled".**

`docs/todo.md` states the constraint plainly: *"Keep crests off any surface where an answer is
being judged, or use non-circular framings."* A checkpoint is the one surface in the product whose
entire job is judging an answer. So the book's crest — the thing that says which book you are in —
is barred from the page that most needs to say it.

Three ways out, to be **rendered and compared, not argued**:

| | Treatment | Trade-off |
|---|---|---|
| **a** | Crest confined to a non-circular framing — a `.frame` band or a strip along one edge, never behind the judged item | Keeps the crest; costs the full-bleed ground the other pages have |
| **b** | No crest on checkpoints. Book identity carried by hue and type alone | Safest; the checkpoint may read as a different product from the pages it closes |
| **c** | Crest at very low opacity behind the *header only*, page ground bare | Splits the difference; needs measuring — the ground rule in `DESIGN.md` was written for full-bleed |

**Recommendation: (a).** The framing is what `.frame` was built for and has never been used for,
and it keeps the checkpoint recognisably part of its book. Render all three before deciding.

---

## 5. The 22 surfaces

Per book, four surfaces — enough to show the variation rule, not just five static looks:

| Surface | What it proves |
|---|---|
| **Chapter opener** | The book's thesis. Where `.wm` / `.kata-vert` / `.frame` earn their keep |
| **Lesson page, early chapter** | The everyday page |
| **Lesson page, later chapter** | Same rules, different chapter — the "similar but not identical" test |
| **Chapter checkpoint** | The recognition gate, in that book's identity |

Plus, once:

| Surface | What it proves |
|---|---|
| **Book checkpoint** (production) | Closing a book, not a chapter. Writes from English rather than picking from a line-up |
| **Final checkpoint** | Closing the course. The only surface with no book identity to wear — see §8 |

**5 × 4 + 2 = 22.**

Two surfaces do double duty as regressions: a lesson page must still hold `PhraseCard`'s situation
accent (proving the Two-Plane Rule), and a checkpoint must still measure ≥44px on every control
and clear the contrast gate on the book's hue.

---

## 6. Phases

### Phase 0 — Tokens and crests

| # | Task | Done when |
|---|---|---|
| 0.1 | Add `--color-accent-sumi`, `-fg`, `-bg` to `src/tokens.css` | `pnpm build:tokens` propagates to all six harnesses; no hand-edited copy |
| 0.2 | Gate the new pair in `check-contrast.mjs` alongside the other four | `label on the Sumi accent` passes ≥4.5:1, or ships with a written exception |
| 0.3 | **Author:** export two new crest motifs + a tile of the blossom | five distinct tiles in `assets/`, greyscale, tile-safe |
| 0.4 | Wire `crest-3/4/5` in `src/brand.css` | five `.emboss-bg.crest-N` rules; a sandbox page renders all five at `tile-sm` |
| 0.5 | Re-measure the patterned-ground stand-in with five crests, not two | `#CACACA` still the darkest composited pixel, or the gate's stand-in is updated with the new measurement |

> 0.5 is not optional. The stand-in in `check-contrast.mjs` is a **measurement** of the two
> shipped crests — "the darkest luminance found was 0.5945". Three new crests can invalidate it,
> and the comment beside it already says: *"Re-measure if a crest is added."*

### Phase 1 — The identity contract

| # | Task | Done when |
|---|---|---|
| 1.1 | Write the Two-Plane Rule and the chapter-variation rule into `DESIGN.md` | both present, next to The Patterned Ground Rule; each says what breaks if ignored |
| 1.2 | Define `BookIdentity` in the flows harness: `{ id, title, hue, crest, tone }` | one object per book; no surface reads a hue directly |
| 1.3 | Extend `FlowDef`/`registry.ts` so a surface can be rendered under any book | one surface × five books is a parameter, not five files |

> 1.3 is the whole reason the mockups are affordable. Without it, 22 surfaces means 22 files and
> the five books drift apart the way `ui_kits/mobile/screens.jsx` drifted from `src/components`.
> With it, the chapter opener is **one** component rendered five times.

### Phase 2 — Render the surfaces

| # | Task | Done when |
|---|---|---|
| 2.1 | Chapter opener, all five books | deep-linkable `?book=three&surface=opener`; the four unused brand utilities have a consumer |
| 2.2 | Lesson page, early + late chapter, all five | ten surfaces; the only difference within a book is density/opacity |
| 2.3 | Chapter checkpoint, all five, in the three §4 treatments | fifteen renders on one comparison page; **author picks one** |
| 2.4 | Book checkpoint (production) | shows a shrinking set, never a score |
| 2.5 | Final checkpoint | see §8 — needs a decision before it can be built |

### Phase 3 — Gate it

| # | Task | Done when |
|---|---|---|
| 3.1 | Add every new surface to `check-touch-targets.mjs` | all controls ≥44px, in all five books |
| 3.2 | Contrast: each book's hue on its own chrome, and on its crest ground | five new pairs in the gate, all passing or explicitly excepted |
| 3.3 | Add the surfaces to `shots-responsive.mjs` | 0 horizontal overflow at 375/768/1024/1440 |
| 3.4 | `pnpm verify:plan` grows a Phase-6 block for this plan | this document's own claims are checkable by command |

> 3.4 exists because the last plan recorded a phase complete when it was not, and the failure
> stood for five days. A plan that cannot be checked by a command is a plan that will make the
> same mistake.

---

## 7. Deliverables

1. Five book identities, rendered side by side, in one place.
2. 22 surfaces, deep-linkable, built from `src/components` — no mirrors.
3. Two named rules in `DESIGN.md` and the checkpoint treatment decided from renders.
4. `--color-accent-sumi` and `crest-3/4/5`, gated.
5. A `verify:plan` block so §6's claims are a command, not a reading.

---

## 8. Open questions

**Answer these before Phase 2.5. Everything else can start.**

1. **What is the final checkpoint, given Hana is shelved?** The `can-do` and `conversation` kinds
   both route to Hana (DR-023) and drop out of the ladder when it is off. So the surface that
   closes the course currently has no content route. Options: it becomes a wide production
   checkpoint over all five books; it becomes a non-assessed can-do summary ("here is everything
   you can now do"); or it waits for Hana. **My read: the can-do summary.** DR-022 derives the
   can-do list from situations the learner has seen, so the data exists without Hana, and closing
   a course on a verdict would break DR-020 more loudly than closing a chapter on one.

2. **Does the final checkpoint wear a book identity at all?** It closes five books, so wearing one
   book's hue is wrong. **My read: it wears the hanko and warm stone and nothing else** — the only
   surface in the product with no book, which is what makes it feel like an ending.

3. **Book One is shipping with 11 chapters and no identity.** Applying a hue and crest to it is a
   visible change to a live product. Does it land with this work, or after the other four are
   agreed? **My read: last.** Get four unshipped books right first, then change the one people are
   using.

---

## 9. Explicitly out of scope

- **Content.** No lessons, chapters, words or phrases are authored here.
- **`../aburungo`.** No app code. The `Book` type is not extended by this plan — identity is a
  design-system concern and the app can read it when the mockups are agreed.
- **Hana.** Nothing here depends on it (DR-023).
- **The remaining mirrors.** `storybook/` and `ui_kits/app/` still hand-copy components. Worth
  doing, unrelated to books.
- **Books Four and Five's content shape.** Their own plan says a detailed design now *"would be
  fiction"*. This plan gives them a look, not a curriculum.
