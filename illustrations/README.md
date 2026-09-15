# Illustration pipeline

The repeatable process for producing AburunGo's situation illustrations. Perfected on
Book One; reused as-is for Books Two–Five. This folder is self-contained — lift it into
any repo whole.

**The loop:** paste a prompt → Gemini generates → judge against the checklist → if it
fails, fix the *prompt*, never the image → when it passes, file it and mark the ledger.

**Ground:** every image is on the dark app ground. Warm near-black `#1A1815`, cream
carved line — a negative of the traditional print. Decided 2026-09-09 when the app went
dark. The five paper-ground images from August are superseded and get regenerated.

**This replaced `docs/illustration-prompt.md`,** the paper-ground prompt from August,
deleted on 2026-09-14 once its content had been ported here. The carved borders and seals,
the real Japanese strings and the turned-up print artefacts all came from it and were
re-cut for the dark ground. Nothing is left to port — this is the only prompt.

---

## Folder and file structure

```
illustrations/
├── README.md                      ← this file: the template and the rules
├── reference/
│   ├── sheet-prompt.md            ← the one-time prompt that produces the sheet below
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

## The style block — paste this VERBATIM every time, unchanged

Changing one word between images is the main cause of style drift. Copy the whole block.

```
Match the attached reference image exactly — same dark ground, same cream carved line,
same flat inked colour, same print texture. Every image in this set must look like it
came from the same printer's hand as the reference.

A Japanese woodblock print (mokuhanga) on a DARK ground: the key block is printed LIGHT.
Cream line on warm near-black — a negative of the traditional print, the way a night
scene reads when the paper itself is dark. The linework must look carved into wood:
irregular weight, slight chatter along the edges, blunt terminations, the character of a
knife rather than a pen tool.

Composition is clear and confident: one subject, readable silhouettes, generous dark
ground around them. Within those shapes, carved detail is welcome and wanted — hatching,
wood grain, fabric folds, repeated knife marks. Detail lives INSIDE the large shapes; it
never becomes clutter around them. The image is displayed large, so fine linework will be
seen. Do not simplify.

The people are ordinary contemporary Japanese adults, observed plainly. Adults with real
faces, carved rather than cartooned — the restraint of a print portrait, not the
blankness of a pictogram and not the expressiveness of a cartoon.

Square format, 1:1.

Colour is assigned by PRINT BLOCK, not by observation. Objects are not coloured the
colour they would be in life — a metal pot, a wooden table and a ceramic bowl are all
filled with flat colour from the palette, chosen for composition rather than realism.

THE PALETTE, and nothing outside it:
  ground     warm near-black  #1A1815   the paper. It is dark.
  line       warm cream       #FFFDF8   the key block. Line and small highlights ONLY.
  gold       #C9A045
  verdigris  #4F9C8D
  indigo     #8fa5c7   (the light rung — deep indigo vanishes on this ground)
  red        #D72E2E   used once at most, as one large sharp note, never as a line
Use only two or three of the colours in any one image, plus the ground and the line.
There are no browns, no greys, no beiges, no wood tones, no metal tones anywhere. The
cream appears as LINE and as small carved highlights — never as a field, a panel, a sky,
or any light area wider than a few strokes. No white. No light sections.

SHADING — permitted, in the two ways a woodblock print actually does it:
- BOKASHI: a colour hand-wiped so it fades into the dark ground across a flat plane — a
  night sky, a pool of lamplight, a wet street. It sits IN the plane and never wraps
  around an object. This is the signature move on a dark ground; use it once.
- CARVED HATCHING: parallel or crossed knife strokes cut into the block, for fabric
  folds, hair, and areas in shadow. It is line, not tone.
NOT permitted: volumetric rendering. No gradient following the curve of an object, no
specular highlight, no sheen on metal or ceramic, no soft cast shadow, no glow.

PRINT ARTEFACTS — the marks of an actual hand-pulled print, not simulated wear. These are
wanted, and wanted VISIBLY: this is a print with character, not a clean reproduction with a
hint of texture. The first four must be obvious at a glance; the last three are fine detail
for close viewing and stay subtle.

OBVIOUS — carry these at full strength:
- Woodgrain from the block printing clearly through every large flat colour area, running
  in one consistent direction within each area, unmistakable rather than hinted at.
- Strongly uneven ink density across each flat field — markedly heavier where the baren
  pressed hard, thinning to streaks and patches of bare dark ground where the block ran
  dry. A flat area should never read as an even fill.
- Dry-brush flecking along the trailing edge of the broad colour areas, where the block
  carried too little ink to cover: broken, ragged, bare dark ground showing through in
  flecks.
- MISREGISTRATION, and at least one colour block per image is CLEARLY off — a visible band
  of bare dark ground down one side of a shape and a corresponding overlap of colour across
  the cream key line on the other, wide enough to read instantly as a hand-pulled
  misalignment. This is the signature mistake of the medium and it should be unmissable.
  The remaining blocks stay within a hairline.

FINE — these stay subtle, and must not be exaggerated:
- Faint circular burnishing swirls from the baren across the broadest colour areas.
- Pigment feathering a fraction of a millimetre at the edge of each colour area, softening
  the edge without blurring it.
- Occasional small ticks and specks of stray colour just outside a shape's edge, where the
  block picked up ink it should not have.

All of this texture must be IRREGULAR. It does not repeat, does not align to the shape it
sits in, and varies in density across one flat area. A uniform cross-hatch, an even
screen tone, or a repeating weave swatch is wrong — that reads as digital fill. Wood grain
is the model for how ALL of it should behave.

Avoid entirely: anime, manga, chibi, kawaii, cartoon mascots, large expressive eyes.
Avoid Mount Fuji, cherry blossoms, torii gates, geisha, samurai, dragons, koi, and every
other tourist emblem of Japan. Avoid modern flat-vector corporate illustration and rounded
blobby figures. Avoid gradients that describe form, drop shadows, glows, 3D rendering and
photorealism.

BORDERS, SEALS AND ORNAMENT are wanted. Enclose the scene in a carved border: a key-fret
band, a seigaiha wave, a plain double rule, or a simple cornered frame. Place one or two
seals or cartouches in the margins where a hand-pulled print would carry them. Cut all of
it from the same block as the picture.

On this dark ground the border is CREAM LINE — carved rule work on the near-black sheet.
It is never a filled cream band, never a light panel, and never anything that turns the
margin into a light area. A seal or cartouche may be a filled shape, but it is filled from
the COLOUR palette above — gold, verdigris, indigo, or the one red — never from the cream.
It takes a colour the picture is already using; it does not add another one.

These live OUTSIDE the picture, on the sheet around it. Where a scene below limits what it
contains — a count of objects, or an empty ground — that limit governs the picture only and
never rules out the border, the seal or the margin.

JAPANESE TEXT — render EXACTLY AND ONLY the strings THE SCENE names below, on the surfaces
it names, and nothing else. This is transcription, not composition: do not invent
characters, do not add a second sign because a wall looks empty, do not letter the
packaging or the lantern unless the scene says to, do not produce decorative pseudo-kanji,
and do not render approximate glyph-shaped marks. Every other surface in the image stays
blank, or carries the abstract carved marks the scene asks it to carry. Where the scene
names no text at all, the image contains no text at all. No English anywhere, ever.

The strings are given large and few on purpose — a three-character noren survives printing
where a nine-item menu board turns to mush. Render them at the size the scene asks for,
carved simply, legible.

Every one of these — border, seal, cartouche, and every single character of text — is
carved into the same block as the picture and carries the same woodcut artefacts described
above: irregular knife-cut edges, blunt terminations, uneven ink density, misregistration
against the key line block, pigment feathering, and woodgrain printing through. Clean
vector ornament or crisp digital type laid over a textured print is the specific failure
to avoid.

Output one image only.
```

---

## Writing a scene block

Every image = the style block above + one scene block. The scene block follows this
formula, and the formula is the reusable part:

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
| Ground | any light field, white panel, pale sky | *"The cream is line only. No light area wider than a few strokes."* |
| Colour | grey, brown, beige, wood tone, metal tone | restate the palette list at the very END of the prompt |
| Monochrome | line only, no colour fills | *"Every illustration carries at least two palette colours as flat inked areas."* |
| Text | a character the scene did not name, invented kanji, glyph-shaped scribble, any English | restate the scene's strings at the very END of the prompt: *"render exactly and only these"* |
| Border | no border at all, or a clean vector one with no print texture | *"The border is carved from the same block as the picture and carries the same artefacts."* |
| Light margin | the border printed as a filled cream band, or a pale margin panel | *"The border is cream LINE on the dark ground. Seals fill from the colour palette, never the cream."* |
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

0. **First time only:** generate the reference sheet from `reference/sheet-prompt.md`
   with nothing attached. Judge all six panels. Save the winner as
   `reference/style-reference.jpg`. Never regenerate it after that.
1. Open a **new Gemini chat** for each image. Follow-up edits inside one chat drift the
   style; a fresh chat with the full prompt does not.
2. **Attach `reference/style-reference.jpg`.**
3. Paste the style block, then the scene block, as one message.
4. Save the result with its ledger filename into `book-N/`.
5. Judge it. Approved → mark the row. Rejected → move to `_rejected/` with `-rN`, note
   the reason, fix the prompt, go to 1.

Order of work for a new book: **the chapter with the most objects first** (a kitchen, a
shop) — it stress-tests the style hardest. If that one holds, the rest will.
