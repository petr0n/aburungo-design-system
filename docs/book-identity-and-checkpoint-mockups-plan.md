# Five Books — identity, chapter pages, and checkpoints

**Status:** plan only, nothing built · **Scope:** `aburungo-design-system` — mockups, tokens and
brand utilities. No app code · **Written:** 2026-08-21 · **Branch prefix:** `feat/book-*`

> **What this plan is for.** The app has landed on Books → Chapters → Lessons and needs five books
> that look like five books. This plan designs the identity system that makes that true, and the
> 25 rendered surfaces that prove it before a line of app code changes.
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

Copy follows the existing vocabulary: **"correct"** and **"worth another look"** — not "wrong",
"incorrect", "failed" or "missed". ("Correct" replaced "recalled" on 2026-08-21.) The product
never tells a learner they failed.

---

## 2. The identity system

**Decided 2026-08-21 by the author: a book is a hue *and* a crest.** Two axes, so neither carries
the identity alone.

| Book | ~ | Character (from the app's plans) | Hue | Crest |
|---|---|---|---|---|
| **One** — the foundation | N5 | prove the method, build the habit | Rokushō 緑青 | trefoil (`crest-1`) |
| **Two** — the bridge | N4 | recognition becomes production | Ai-iro 藍色 | kaji leaf (`crest-2`) |
| **Three** — the flagship | N3 | the intermediate wall | Akane 茜色 | **to draw** |
| **Four** — register | N2 | what a form *signals*, not means | Ōgon 黄金 | five-petal blossom |
| **Five** — refinement | N1 | near-native, nuance, idiom | Sumi-iro 墨色 | **to draw** |

The `~` column is the JLPT level each book *loosely* corresponds to — Book One is semi-related to
N5, Book Two is like N4, and so on. **It is internal only.** A learner never reads it, the app's
plans are explicit that this is "the invisible skeleton", and no surface in this plan renders it.
It is here so the reader knows which book maps to which existing content and nothing more.

The hue ordering is not arbitrary. Rokushō already means *progress and correctness*, which is what
Book One is entirely about. Akane is the mark and the error state — the loudest colour in the
system — and Book Three is "the wall", the book that has to feel like it costs something. Sumi 墨
*is* ink, and Book Five is the book that earns its look by giving colour up.

### ✅ Resolved: the verdict moved down the ramp

**Decided 2026-08-21 by the author, after rendering it.** The five identities stay exactly as they
are, at their 500 step. **The verdict colours moved instead.**

`--color-success-500` and `--color-error-500` were hardcoded to `#4F9C8D` and `#D72E2E` — the
literal Rokushō and Akane brand values, and therefore the literal values Book One and Book Three
now wear as chrome. A ○ could land in exactly its own header band's colour.

They point at **Rokushō 800 and Akane 800** now. Same two colours, two steps darker:

| | vs its 500 band | on its own tint | on a card |
|---|---|---|---|
| Rokushō 800 `#264d46` | 114 apart | 7.61:1 | 9.25:1 |
| Akane 800 `#6f1616` | 109 apart | 9.53:1 | 11.46:1 |

**This also fixed a standing defect.** The 500 glyph on its own tint measured **3.98:1** and failed
AA — recorded on `preview/16-accent-usage.html` as a note rather than a fix. Both pairs are gated
now; the contrast gate went 39/42 → 41/44.

> **What was tried first, and was wrong.** An earlier pass drafted two new hues — wisteria and
> decayed-leaf — measured them, cut a third for sitting 55 from Akane, and rendered all three.
> The author's answer was that the palette already contained the fix. Adding a sixth and seventh
> colour to resolve a collision between five is how a palette stops meaning anything, and the
> ramps existed the whole time. **Look at the ramp before drafting a hue.**

Rendered at `?flow=books&state=feedback`, before and after, on the two books whose chrome the old
verdict matched.

### The Band Ink Rule

**Added 2026-08-21, after the identities were rendered.** `AppHeader` draws its title in paper and
its subtitle in `fg-on-inverse-2`, a muted grey. That works because its band is Sumi — near-black,
with room underneath. Put the same pair on a mid-tone hue and it collapses: measured across the
five books, **six of ten labels failed AA**, worst at Book Four's subtitle on **1.02:1**.

> **A book band chooses its ink by luminance, and the subtitle uses the same ink as the title.**

| Band | Ink | title | subtitle |
|---|---|---|---|
| Book One · Rokushō | stone-900 | 5.46 | 5.46 |
| Book Two · Ai-iro | paper | 11.13 | 11.13 |
| Book Three · Akane | paper | 4.78 | 4.78 |
| Book Four · Ōgon | stone-900 | 7.25 | 7.25 |
| Book Five · Sumi | paper | 13.55 | 13.55 |

Both halves are load-bearing. Ink-by-luminance is obvious once measured; **the subtitle sharing it
is the part that is easy to undo.** There is no muted step that survives on Akane — the grey is
1.95:1 there — so a "make the subtitle sit back" edit re-breaks it. Hierarchy comes from size and
weight, which it mostly already did. Dimming with opacity re-spends the contrast this recovers.

**When book chrome becomes a real component, this rule travels with it.** `AppHeader` today takes
no hue and is correct as it stands; the moment it does, it needs the ink parameter too.

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
| B | **Crest motifs** | Only **three distinct motifs** exist — `clan-symbol1/2` are the pre-tiled versions of `flower-symbol1/2`, not separate designs. **The author is drawing three more (2026-08-21)**, giving six for five books. The spare is unassigned; if it is meant for the final checkpoint, say so |
| C | ~~A tile of `clan-symbol-flower`~~ | **done 2026-08-21** — `scripts/make-crest-tile.mjs` |
| D | ~~`crest-3/4/5` in `brand.css`~~ | **done 2026-08-21** — all five wired |

> **B is the author's, not Claude's.** The crests are hand-made in Affinity — `flower-symbol1.afdesign`
> and `flower-symbol2-tiles.afdesign` are the sources on disk. Per the standing note in
> [MEMORY.md](/Users/peterabeln/.claude/projects/-Users-peterabeln-Documents-japanese-aburungo-design-system/memory/MEMORY.md):
> **use the author's asset file directly, never hand-trace it into SVG.** This plan asks for two
> exported PNGs and does not attempt to generate them.
>
> **Update 2026-08-21.** Five slots are now filled from the author's own files, without drawing
> anything: crest 3 is the blossom, laid out and brought to weight by `make-crest-tile.mjs`;
> crests 4 and 5 are the flat silhouettes `japanese-flower1 2.png` and `pasted-1779754339988-0.png`
> with the white keyed out. Those two are the leaf and the clover again — a different *cut* of the
> same drawing, which reads as a different ground but is not a new motif. **B is still open**, and
> what it needs is two drawings, not two more derivations.

---

## 4. ⚠️ Blocked: whether a checkpoint carries its book's crest

**Blocked 2026-08-21, and this section previously decided it — which was the error.**

An earlier draft barred crests from checkpoints, citing `docs/todo.md`: *"Kamon are circular and
○ already means correct … keep crests off any surface where an answer is being judged."* A later
draft argued the opposite — that the caution was written about one large crest and does not reach a
72px tiled ground at `.35` opacity, which is wallpaper.

**Both drafts were out of step with where the question actually stands.** The author parked that
caution as **NEEDS REVIEW** on 2026-08-21, explicitly: *nothing should be designed around it, or
removed because of it, until it is reviewed.* A plan that then decides the question is the plan
overruling the park.

So: **undecided, and recorded in one place.** `docs/todo.md` holds the caution and its status;
this section holds the consequence. When the caution is reviewed, both get the answer.

**What that blocks:** the crest treatment on chapter checkpoints and final checkpoints only.
Chapter openers and lesson pages are unaffected — the caution never reached a page that is not
judging an answer. Phase 2.1 and 2.2 can proceed.

**When it is reviewed, the treatments worth comparing** — render, do not argue:

| | Treatment |
|---|---|
| **a** | Full tiled ground, same as every other page in the book |
| **b** | Crest confined to a non-circular framing — a `.frame` band or an edge strip, never behind the judged item |
| **c** | No crest; the book carried by hue and type alone |

## 5. The 25 surfaces

**Five per book. Decided 2026-08-21: every book ends in its own final checkpoint** — there is no
separate page closing the whole course.

| Surface | What it proves |
|---|---|
| **Chapter opener** | The book's thesis. Where `.wm` / `.kata-vert` / `.frame` earn their keep |
| **Lesson page, early chapter** | The everyday page |
| **Lesson page, later chapter** | Same rules, different chapter — the "similar but not identical" test |
| **Chapter checkpoint** | The recognition gate that closes a chapter, in that book's identity |
| **Final checkpoint** | The production gate that closes the **book**. Writes from English rather than picking from a line-up — a different skill, which is why it is its own kind and not a harder recognition round |

**5 × 5 = 25.**

The last two are the point of the exercise. A chapter checkpoint arrives ten times in a book and a
final checkpoint once, so they must feel different in weight while staying obviously the same book
— the same problem as the two lesson pages, one level up.

Two surfaces double as regressions: a lesson page must still hold `PhraseCard`'s situation accent
(proving the Two-Plane Rule), and every checkpoint must clear ≥44px on all controls and pass the
contrast gate on its book's hue.

## 6. Phases

### Phase 0 — Tokens and crests

| # | Task | Done when |
|---|---|---|
| 0.1 | ~~Add `--color-accent-sumi`, `-fg`, `-bg` to `src/tokens.css`~~ | **done 2026-08-21.** Aliases `stone-800` — Sumi has no ramp of its own, it *is* the stone scale's 800 step. Propagated to the generated sheet and all five harness `@theme` blocks by `build:tokens` |
| 0.2 | ~~Gate the new pair in `check-contrast.mjs`~~ | **done 2026-08-21.** `label on the Sumi accent` = **13.55:1**. Gate 38/41 → 39/42. A second check — the card ground against the page — was added, failed at 1.08:1, and was **removed as wrong**: every accent ground measures 1.09–1.17 and the plain card is 1.06, so cards here separate by warmth, not luminance. The measurement is recorded beside the block so it is not re-added |
| 0.3 | **Author:** export two new crest motifs | **still open.** The blossom tile is done — `scripts/make-crest-tile.mjs` builds it from the full-size render already in `assets/`, on the same diagonal layout as crests 1 and 2. What is still missing is two *motifs*: books four and five wear the solid cut of the leaf and the clover as a stand-in |
| 0.4 | ~~Wire `crest-3/4/5` in `src/brand.css`~~ | **done 2026-08-21.** Five `.emboss-bg.crest-N` rules, five tiles in `assets/`, five distinct grounds on the lab's `identities` state. `preview/_sandbox/crest-3-4-5.html` renders all five over page and card |
| 0.5 | ~~Re-measure the patterned-ground stand-in with five crests, not two~~ | **done 2026-08-21.** It did not survive: the worst case is **0.5879** (crest-2 on a well at `tile-lg`), darker than the `#CACACA` the gate checked against (0.5906). Stand-in moved to **`#C8C8C8`** (0.5775). No role ever failed — `fg-muted`, the tightest, measures 4.61:1 there — but a stand-in lighter than the thing it stands in for is the wrong way round |

> 0.5 is not optional, and it paid for itself twice. The stand-in in `check-contrast.mjs` is a
> **measurement**, and the sweep that re-took it found (a) the old value was optimistic because
> `tile-lg` had never been swept — a large tile keeps broad dark areas that a small one averages
> away — and (b) the three new crests came in at 0.4468, 0.3318 and 0.3318 raw, far past the bar.
>
> **The three new tiles are brought to weight in the ART, not with a lower `--emboss-opacity`.**
> `--alpha` in `make-crest-tile.mjs` scales the alpha channel; the opacity knob stays at `.35` for
> all five. A per-crest opacity default would have fixed the numbers on paper and left the public
> knob able to undo it at any call site, where the gate cannot see it.

### Phase 1 — The identity contract

| # | Task | Done when |
|---|---|---|
| 1.1 | Write the Two-Plane Rule and the chapter-variation rule into `DESIGN.md` | both present, next to The Patterned Ground Rule; each says what breaks if ignored |
| 1.2 | Define `BookIdentity` in the flows harness: `{ id, title, hue, crest, tone }` | one object per book; no surface reads a hue directly |
| 1.3 | Extend `FlowDef`/`registry.ts` so a surface can be rendered under any book | one surface × five books is a parameter, not five files |

> 1.3 is the whole reason the mockups are affordable. Without it, 25 surfaces means 25 files and
> the five books drift apart the way `ui_kits/mobile/screens.jsx` drifted from `src/components`.
> With it, the chapter opener is **one** component rendered five times.

### Phase 2 — Render the surfaces

> **Book One first, then the rest.** It is the only book with content (451 words, 207 phrases,
> real chapter titles). Building its identity against invented copy would let the system look good
> against text chosen to flatter it. Prove it on Book One, then apply what survived.


| # | Task | Done when |
|---|---|---|
| 2.1 | Chapter opener, all five books | deep-linkable `?book=three&surface=opener`; the four unused brand utilities have a consumer |
| 2.2 | Lesson page, early + late chapter, all five | ten surfaces; the only difference within a book is density/opacity |
| 2.3 | Chapter checkpoint, all five | carries its book's crest and hue like any other page (§4); shows a shrinking set, never a score |
| 2.4 | Final checkpoint, all five books | shows a shrinking set, never a score; reads heavier than a chapter checkpoint without leaving the book's identity |

### Phase 3 — Gate it

| # | Task | Done when |
|---|---|---|
| 3.1 | Add every new surface to `check-touch-targets.mjs` | all controls ≥44px, in all five books |
| 3.2 | Contrast: each book's hue on its own chrome, and on its crest ground | five new pairs in the gate, all passing or explicitly excepted |
| 3.3 | Add the surfaces to `shots-responsive.mjs` | 0 horizontal overflow at 375/768/1024/1440 |
| 3.3b | Every book surface renders at **1280** as well as 390 | `?view=desktop` in the flows harness; no surface leaves a dead half-screen |
| 3.4 | `pnpm verify:plan` grows a Phase-6 block for this plan | this document's own claims are checkable by command |

> 3.4 exists because the last plan recorded a phase complete when it was not, and the failure
> stood for five days. A plan that cannot be checked by a command is a plan that will make the
> same mistake.

> **3.3b is new, 2026-08-21, and it is not a formality.** Until that day nothing in this repo had
> ever rendered a product surface at a desktop width — every flow lived inside a 390px `<Phone>`,
> and the surfaces `pnpm shots` captured at a 1280 viewport were the *harness page* around a phone,
> not the product at 1280. The app carries fifteen responsive utilities in total and runs in a
> browser.
>
> The first desktop render found two things. One is fixed: `AppHeader` capped its own band at
> `max-w-3xl`, so at 1280 the ア mark left the edge of the band and floated in level with the body
> text. Inert at phone widths, wrong at desktop; the cap is gone and nothing moved on a phone.
>
> The other is open and belongs to these 25 surfaces. **A card-shaped screen top-anchors in an
> 820px frame and leaves the bottom half empty** — the flashcard round and the kana drill are the
> clearest. The fix is one class on `Screen`'s column in `ui_kits/flows/shell.tsx`:
> `[justify-content:safe_center]`. `safe` is what makes it correct — it centres when there is room
> and falls back to top-aligned when the content overflows, so it cannot make the top of a long
> screen unreachable the way a plain `justify-center` would. It is not applied yet because it
> changes the vertical position of content on **every phone screen too**, which is a bigger call
> than a desktop fix and wants looking at rather than assuming.

---

## 7. Deliverables

1. Five book identities, rendered side by side, in one place.
2. 25 surfaces, deep-linkable, built from `src/components` — no mirrors.
3. Two named rules in `DESIGN.md` and the checkpoint treatment decided from renders.
4. `--color-accent-sumi` and `crest-3/4/5`, gated.
4b. A desktop view of every flow, at 1280, in the harness that cannot drift.
5. A `verify:plan` block so §6's claims are a command, not a reading.

---

## 8. Decisions taken, and the one thing still to settle

All three of the questions this plan originally carried have been answered.

1. ~~**What does "final checkpoint page" mean?**~~ — **answered 2026-08-21: the last checkpoint
   inside a book, and every book has one.** There is no separate page closing the whole course, so
   the Hana question below it never arises: a book-closing checkpoint is a `production` gate, which
   needs no Hana. The surface count is 25, not 22, because the final checkpoint is per book rather
   than once.

2. ~~**Does Book One go last, being live?**~~ — **answered: it goes FIRST**, and the author agrees.
   The original reasoning here was "it ships, so changing it is visible", which is hollow —
   `CLAUDE.md` records this as pre-alpha with no public users.

   The argument runs the other way. **Book One is the only book with content**: 11 chapters, 93
   lessons, 451 words, 207 phrases. `grep "jlpt: N4" src/content/` returns nothing, and the same
   holds for N3–N1. Every other book can only be mocked with invented text, which would let the
   identity system look good against copy chosen to flatter it. Build Book One's identity against
   real Japanese, real lesson lengths and real chapter titles; then apply what survived.

3. **Still to settle: the sixth crest.** The author is drawing three more motifs, giving six for
   five books. The spare is unassigned. It does not block anything — assign it when the motifs
   exist and one of them turns out to want a job.

## 9. Explicitly out of scope

- **Content.** No lessons, chapters, words or phrases are authored here.
- **`../aburungo`.** No app code. The `Book` type is not extended by this plan — identity is a
  design-system concern and the app can read it when the mockups are agreed.
- **Hana.** Nothing here depends on it (DR-023).
- **The remaining mirrors.** `storybook/` and `ui_kits/app/` still hand-copy components. Worth
  doing, unrelated to books.
- **Books Four and Five's content shape.** Their own plan says a detailed design now *"would be
  fiction"*. This plan gives them a look, not a curriculum.
