# The reference sheet — six prints, assembled

This produces `style-reference.jpg`: six full-size prints, generated **one at a time**,
laid out on one dark ground in Affinity. Once the sheet passes, it is attached to every
generation and never regenerated.

**Why six separate images and not one six-panel prompt.** The single-pull version was
tried twice on 2026-09-30 and both pulls are in `_rejected/` with their reasons. A
six-panel prompt is one 1,500-word instruction that has to hold six scenes at once, and
it didn't: r1 broke the grid, r2 merged two scenes and invented a third. Both printed the
cream as a field and neither misregistered a single block. One scene per prompt is the
exact shape every later illustration uses, a failure costs one re-roll instead of six,
and the panels are **full-size prints that go in the Book One ledger** — the sheet is a
by-product of work that has to be done anyway, not a detour before it.

The six scenes are 1.2, 2.2, 11.1, 10.1, 3.3 and 12.1 from `../book-1/plan.md`, chosen
because between them they exercise every check: carved Japanese on a noren and a menu
card, carved Japanese on a station sign, objects only, a night bokashi, a rain bokashi,
and a face frieze. **The scene blocks below are copies of the plan's — if one changes,
change both.**

---

## The order, and what to attach

The first image has nothing to anchor on, so it has to earn its place. Everything after
it is anchored on it, so the six converge instead of scattering.

| #   | Scene                 | Attach      | Why this order                                                                                                                   |
| --- | --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 11.1 · the table · `b1-ch11-s01-meals-kitchen.png` | **nothing** | The most object-heavy scene is the hardest test of the style. If it holds, the rest will — the README says so for every new book |
| 2   | 1.2 · the counter · `b1-ch01-s02-food-drink.png` | image 1     | First carved kana, two strings                                                                                                   |
| 3   | 2.2 · the ticket gate · `b1-ch02-s02-getting-around.png` | image 1     | Kana on a sign, a face in motion                                                                                                 |
| 4   | 10.1 · the streetlamp · `b1-ch10-s01-yesterday.png` | image 1     | First bokashi, gold                                                                                                              |
| 5   | 3.3 · the rain · `b1-ch03-s03-weather.png` | image 1     | Second bokashi, indigo                                                                                                           |
| 6   | 12.1 · the frieze · `b1-ch12-s01-people-clothes.png` | image 1     | Three faces, empty ground                                                                                                        |

Every image: a **new Gemini chat**, the attachment above, and **one pasted message**.
Don't assemble it by hand — the style block lives in `../README.md`, and the first pull
on 2026-09-30 went out without it (3:2, no border, four colours, red as line: the
carving was right and every rule was missing). Let the script put the three parts
together from their single sources:

```
pnpm prompt 11.1 --no-ref | pbcopy     # image 1: nothing attached, so no "match the attached" paragraph
pnpm prompt 1.2 | pbcopy               # images 2–6, and every scene after
```

That is the style block, the scene block for that id from `../book-1/plan.md`, and the
tail below, in order. `scripts/prompt.mjs` is the only place the order is written.

Judge each against the README checklist **with the Border and Light-margin rows
switched back on** — unlike the single-pull sheet, these are full-size prints and
carry their borders. Approved → file it in `../book-1/` under its ledger name and mark
the row. Rejected → `../book-1/_rejected/` with `-rN`, note the reason, re-roll.

---

## The tail — append to EVERY one of the six, after the scene block

Both single-pull sheets failed the same two checks, and the README's fix for an ignored
instruction is to restate it at the end. These four rules close the prompt every time:

```
RESTATED, because these govern everything above:
- The cream is LINE ONLY. No light area wider than a few strokes. No cream wall, no
  cream sky, no cream shirt. Every large area is one of the palette colours or the dark
  ground.
- At least one colour block is clearly misregistered — a visible band of bare dark
  ground down one side of a shape, and colour crossing the cream key line on the other.
- This image is ONE scene, the one named above. Nothing merged in, nothing added.
- OUTPUT as PNG, not JPEG. The dark ground is part of the print and stays fully opaque
  edge to edge — no transparency, no alpha. PNG is for the carved line surviving
  without compression artefacts.
```

PNG, not transparency: the ground `#1A1815` *is* the paper. Every bokashi fades into it
and the app sets it on `stone-900`, the same value. A transparent export would cut the
ground out of a print whose whole premise is the dark sheet. The crest tiles in
`assets/crests/` are the one place alpha is wanted, and they are not generated here.

---

## The six scene blocks

### 1 · 11.1 Meals & the kitchen — attach nothing

**Save as:** `b1-ch11-s01-meals-kitchen.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch11-s01-meals-kitchen-rN.png`

```
THE SCENE: a low table seen from slightly above, set with a rice bowl, a soup bowl, and
chopsticks on a rest. Behind it, cropped by the frame, a pot on a modern burner with
steam rising as carved strokes. Four objects total. No window, no view, no background
scene, no shelving, no hanging utensils. No people. The objects carry it. Contemporary,
not historical.
```

### 2 · 1.2 Food & drink — attach image 1

**Save as:** `b1-ch01-s02-food-drink.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch01-s02-food-drink-rN.png`

```
THE SCENE: a small restaurant counter seen from the customer's side. A split noren curtain
hanging above, carrying exactly these two characters, large and simply carved: 食堂
One seated customer and one cook behind the counter. A bowl and chopsticks on the counter.
A standing menu card beside them carrying exactly two dish names, large, stacked: the first
line reads ラーメン and the second line directly beneath it reads ぎょうざ. Render no slash,
bullet or separator between them.
Render only those characters. No other lettering anywhere in the image.
No other diners, no kitchen behind. Contemporary, not historical.
```

### 3 · 2.2 Getting around — attach image 1

**Save as:** `b1-ch02-s02-getting-around.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch02-s02-getting-around-rN.png`

```
THE SCENE: a station ticket gate. One commuter with a shoulder bag passing through it.
The sign above the gate carries exactly these two characters, large and simply carved: 改札
A clock face beside it with hands but no numerals. A train in flat silhouette behind,
cropped by the frame.
Render only those characters. No other lettering anywhere in the image.
No crowd, no shopfront. Contemporary, not historical.
```

### 4 · 10.1 Talking about yesterday — attach image 1

**Save as:** `b1-ch10-s01-yesterday.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch10-s01-yesterday-rN.png`

```
THE SCENE: one adult walking home at night under a single streetlamp, a bag over one
shoulder. The lamp casts a bokashi pool of gold onto the pavement, fading into the dark
ground — the one gradient, and the subject. A low wall beside the pavement. No buildings
beyond the wall, no other people. Contemporary, not historical.
```

### 5 · 3.3 Weather — attach image 1

**Save as:** `b1-ch03-s03-weather.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch03-s03-weather-rN.png`

```
THE SCENE: one adult walking under an umbrella, coat pulled against the wind. Rain as
carved diagonal strokes. A single puddle catching the reflection. A bokashi wash of
indigo fading into the dark ground across the sky — this is the one gradient, and it is
the subject. No buildings, no other people. Contemporary, not historical.
```

### 6 · 12.1 People & what they wear — attach image 1

**Save as:** `b1-ch12-s01-people-clothes.png` — approved into `../book-1/`; rejected into `../book-1/_rejected/` as `b1-ch12-s01-people-clothes-rN.png`

```
THE SCENE: three adults standing together in contemporary everyday clothing — one coat,
one satchel, one scarf; one of them in glasses. Large in the frame, a flat frieze against
completely empty ground. Nothing else in the image. Contemporary, not historical.
```

---

## Assembling the sheet

In Affinity Designer, a 3:2 document on ground `#1A1815`. Six squares, three across and
two down, in the table's order, each scaled to the same size with a thumb's-width gutter
of bare ground between them. No labels, no rules, nothing in the margins — six prints on
one dark sheet. Export as `style-reference.jpg`, long edge 2048.

Lay them out **before** exporting and look. If one print reads as an outlier beside the
other five — thinner line, a colour that wandered, a face gone cartoon — that is the
judgement the composite gives you for free. The sheet teaches whatever it carries,
including a mistake.

Which print is the outlier decides what gets re-rolled:

- **One of images 2–6:** drop it and re-roll that one scene with image 1 attached. The
  other four stand.
- **Image 1 itself:** it is the anchor, so it cannot be re-rolled against itself. Re-roll it
  with **nothing attached**, exactly as the first time, until it passes — and then
  **regenerate images 2–6 against the replacement**. They converged on the old anchor;
  five prints anchored on a rejected one are five more copies of the rejection. This is
  the expensive case, which is why image 1 is judged hardest before anything is anchored
  on it.

---

## The rejected single-pull sheets

| File                                | What failed                                                                                                                                                                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_rejected/style-reference-r1.jpeg` | Not a 3×2 grid — two wide panels over four small. Cream as a field (rice bowl, counter top, faces). Browns, greys and beiges. No misregistration anywhere. Buildings beyond the wall in panel 4. Kana clean                                         |
| `_rejected/style-reference-r2.jpeg` | Grid correct. Panels 4 and 5 merged into one; the vacated slot filled with an invented scene; the menu card left panel 1 for it. Cream as a field in four panels — worse than r1. No misregistration. Four adults in panel 6, not three. Kana clean |

The single-pull prompt is in git history (`git log -- illustrations/reference/sheet-prompt.md`)
if it is ever wanted again. It isn't recommended: two pulls proved the model can cut kana at
panel scale and cannot hold six scenes, two artefact rules and a grid in one instruction.
