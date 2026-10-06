# Illustration pipeline

The repeatable process for producing AburunGo's situation illustrations. Perfected on
Book One; reused as-is for Books Two–Five. This folder is self-contained — lift it into
any repo whole.

**The loop:** paste a prompt → Gemini generates → judge against the checklist → if it
fails, fix the *prompt*, never the image → when it passes, file it and mark the ledger.

**Style:** whatever `reference/style-reference.jpg` shows — hand-carved woodcut panels in
full colour on cream paper, set on a dark charcoal sheet the way they sit on the dark app.
Black is line and the one night scene. The sheet came from `reference/sheet-prompt.md`
(2026-10-05); its first cut, the dark sheet, is in `reference/_rejected/`. That sheet is attached to every generation and is the
whole style instruction. Set 2026-10-04, replacing the dark-ground rules of 2026-09-09.

**This replaced `docs/illustration-prompt.md`,** the paper-ground prompt from August,
deleted on 2026-09-14 once its content had been ported here. The carved borders and seals,
the real Japanese strings and the turned-up print artefacts all came from it and were
re-cut for the dark ground, and that dark prompt was itself dropped on 2026-10-04.

---

## Folder and file structure

```
illustrations/
├── README.md                      ← this file: the template and the rules
├── crest-integration.md           ← five ways to put a book's crest in a scene,
│                                     for concept rounds. Start with variant A.
├── reference/
│   ├── sheet-prompt.md            ← the prompt that produces the six-panel sheet. Copy all
│   ├── style-reference.jpg        ← the approved DARK-GROUND six-panel sheet. ATTACH IT
│   │                                 TO EVERY GENERATION. It anchors the style better
│   │                                 than any description.
│   ├── site-reference-mobile.jpg  ← Gemini's paper-ground mobile sheet. Site direction
│   │                                 only; never attached to an illustration prompt.
│   └── site-reference-desktop.jpg ← same, desktop.
├── book-1/
│   ├── plan.md                    ← the ledger + every scene block, ready to paste
│   ├── b1-ch01-s01-greetings-basics.png
│   ├── b1-ch01-s02-food-drink.png
│   ├── b1-ch02-s01-shopping.png
│   ├── …
│   ├── b1-shared-checkpoint.png
│   ├── b1-shared-final.png
│   └── _rejected/
│       ├── b1-ch01-s01-greetings-basics-r1.png   ← every option that lost, kept
│       └── …                                        (append-only, never deleted)
├── book-2/
│   ├── plan.md
│   └── …
└── …
```

### Naming

`b<book>-ch<chapter:02>-s<situation:02>-<slug>.png`

- `b1-ch03-s02-directions.png` — Book One, chapter 3, second situation, "Directions".
- Chapter and situation are zero-padded so the folder sorts in curriculum order.
- The slug is the situation name, lowercased. Spaces and `&` become hyphens, other
  punctuation is dropped, and **any run of hyphens collapses to one**: "Greetings & basics"
  → `greetings-basics`, not `greetings---basics`.
- Book-level images that don't belong to one chapter: `b1-shared-<name>.png`.
- Rejected variants keep the exact approved name plus `-r1`, `-r2`… inside `_rejected/`.
  They are the record of what was tried. Never delete them; never regenerate what a
  rejected variant already showed you.

### Where approved images go

An approved image is copied — same filename, unchanged — into the app's asset folder.
The filename *is* the reference: `b1-ch01-s02-food-drink.png` is what the chapter
opener for Book One chapter 1 loads. No renaming step, no mapping table.

### The ledger

`book-N/plan.md` carries one row per image:

| status | meaning |
| --- | --- |
| `todo` | not generated yet |
| `generated` | an image exists, not yet judged |
| `approved` | passed the checklist, filed |
| `rejected` | failed; reason in notes; variant in `_rejected/` |

Update the row when the status changes. It is the only place that knows what exists.

---

## The prompt — the attached sheet carries the style

Restarted 2026-10-04. The dark-ground style block was deleted (git history has it). Every
scene prompt now opens with the same style section — one bordered panel like the sheet's,
then the WOODCUT and HAND-MADE lists copied from `reference/sheet-prompt.md` — followed by
the scene. The sheet alone did not carry the roughness: the first single scene with only a
one-line lead came back smooth and polished (2026-10-05).

Each scene's full prompt is a file in `book-N/prompts/`, named after the image it makes —
`book-1/prompts/b1-ch11-s01-meals-kitchen.md` makes `b1-ch11-s01-meals-kitchen.png`. If the style section changes, change it in every file and in the sheet prompt.

---

## Writing a scene block

Every image = the one-line lead above + one scene block, in its own prompt file.
The scene block follows this formula, and the formula is the reusable part:

```
THE SCENE: <the setting, one clause>. <Three or four named objects>. <People: how many
and what they are doing — or "No people. The objects carry it.">. <Every surface that
could carry writing: either the exact string to render, or "bearing only abstract carved
marks".> <One framing note: what is cropped, or what is deliberately absent>.
Contemporary, not historical.
```

### The rules, each earned by a failure in the first batch

1. **Three or four objects. Never five.** Every scene that named five or more came back
   busy; every scene that named three or four came back clean. Object count, not
   adjectives, is what makes an image reductive.
2. **Every surface that could carry writing gets an explicit instruction — either the
   exact string, or abstract marks.** Left open, "a menu" produced the word MENU. Name the
   characters you want (`食堂`, large, on the noren) and it renders those; say "a standing
   card bearing only tally marks and carved dashes" and it renders no text. The failure is
   naming the object and saying nothing about its surface.

   Strings stay **few, large and real**. Three characters on a noren survive printing; a
   nine-item price board turns to mush, and digits are the worst of all — a clock gets
   hands and no numerals, a price tag gets carved marks. Four of the 23 scenes below carry
   text; the other nineteen carry none, deliberately. **Adding a string to a scene is a
   scene rewrite, not a decoration** — the surface has to already belong there.
3. **Say "Contemporary, not historical" every time.** The kitchen scene drifted to the
   Edo period the one time it was left out.
4. **Name what is absent when the model tends to add it.** "No window, no view, no
   background scene, no shelving." The window is what smuggled in fake signage.
5. **People are 0–3 adults, and you name the action, not the emotion.** "Inclining
   slightly in a greeting" works. "Looking happy" produces a cartoon.
6. **One subject.** If you cannot say what the picture is OF in four words, cut until
   you can.
7. **Derive the scene from the lessons' can-do lines, not from the situation title.**
   "Getting around" is vague; "buy a train ticket, ask which platform" gives you a
   ticket gate and a platform sign.

---

## Judging an image — the checklist

Run every generated image through this before it gets `approved`. Each line is a
failure that actually happened.

| check | fail looks like | fix (append to the prompt, re-roll) |
| --- | --- | --- |
| Style | does not look like the attached sheet | re-roll in a fresh chat with the sheet attached |
| Monochrome | line only, no colour fills | *"Every illustration carries at least two palette colours as flat inked areas."* |
| Text | a character the scene did not name, invented kanji, glyph-shaped scribble, any English | restate the scene's strings at the very END of the prompt: *"render exactly and only these"* |
| Border | no border at all, or a clean vector one with no print texture | *"The border is carved from the same block as the picture and carries the same artefacts."* |
| Registration | every block perfectly aligned | *"At least one colour block is clearly misregistered — a visible band of bare ground down one side of a shape."* |
| Faces | big eyes, expressions, anime | *"Faces carved — the restraint of a print portrait."* |
| Period | kimono, paper lanterns, tatami, wooden shutters | *"Contemporary, not historical."* — and cut the object that triggered it |
| Texture | regular cross-hatch, screen tone, weave swatch | *"Wood grain is the model. Irregular, non-repeating."* |
| Sprawl | more than four things competing | cut the scene block to three objects |
| Volume | shiny pot, shaded bowl, cast shadows | *"A pot is a flat shape with carved line. No sheen, no shadow."* |

**One re-roll rule:** if the same prompt fails the same check twice, the prompt is wrong,
not the dice. Rewrite the scene block. Do not roll a third time hoping.

**Two-strike rule for "almost":** if an image is close but not right, generate the
identical prompt twice more before changing a word. Half the time the prompt was fine.

---

## Running it

1. Open a **new Gemini chat** for each image. Follow-up edits inside one chat drift the
   style; a fresh chat with the full prompt does not.
2. **Attach `reference/style-reference.jpg`** and, for Book One, the approved 11.1 print — the sheet carries colour and people, 11.1 carries the carving.
3. Open `book-N/prompts/<image-name>.md`, copy all of it, paste as one message.
4. Save the result with its ledger filename into `book-N/`.
5. Judge it. Approved → mark the row. Rejected → move to `_rejected/` with `-rN`, note
   the reason, fix the prompt, go to 1.

Order of work for a new book: **the chapter with the most objects first** (a kitchen, a
shop) — it stress-tests the style hardest. If that one holds, the rest will.
