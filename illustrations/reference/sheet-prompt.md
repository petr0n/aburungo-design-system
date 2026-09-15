# The reference sheet — run once per direction

This produces `style-reference.jpg`: six dark-ground panels in one image. Once a sheet
passes, it is attached to every single generation and never regenerated. Nothing here is
attached; this is the one prompt that runs without a reference.

**Judging the sheet:** every panel must pass every line of the checklist in
`../README.md` **except the Border and Light margin rows**, which are deliberately
switched off here — six carved borders on one 3:2 sheet eat the panel area the sheet
exists to show, and the border rule is restated in full in every single generation
anyway. What the sheet must anchor is line quality, palette, the print artefacts, faces,
and **carved Japanese characters**, which panels 1 and 2 carry for exactly that reason:
if the model cannot cut legible kana at panel scale, you want to know before twenty-three
generations and not after. One failing panel fails the sheet — a reference with one wrong panel
teaches the wrong thing to twenty-three images. Re-roll the whole sheet, identical prompt,
up to two more times before changing a word. Losing sheets go to `_rejected/` as
`style-reference-rN.jpg`.

The six scenes are 1.2, 2.2, 11.1, 10.1, 3.3 and 12.1 from `../book-1/plan.md`,
chosen because between them they exercise every check: carved Japanese characters on a
noren and a menu card, carved Japanese on a station sign, objects only, a night bokashi,
a rain bokashi, and a face frieze.
The panels are too small to ship; those six still get generated individually.

---

```
A Japanese woodblock print (mokuhanga) on a DARK ground: the key block is printed LIGHT.
Cream line on warm near-black — a negative of the traditional print, the way a night
scene reads when the paper itself is dark. The linework must look carved into wood:
irregular weight, slight chatter along the edges, blunt terminations, the character of a
knife rather than a pen tool.

Composition is clear and confident: one subject per panel, readable silhouettes, generous
dark ground around them. Within those shapes, carved detail is welcome and wanted —
hatching, wood grain, fabric folds, repeated knife marks. Detail lives INSIDE the large
shapes; it never becomes clutter around them. Do not simplify.

The people are ordinary contemporary Japanese adults, observed plainly. Adults with real
faces, carved rather than cartooned — the restraint of a print portrait, not the
blankness of a pictogram and not the expressiveness of a cartoon.

FORMAT: one landscape image, 3:2. It contains SIX SQUARE PANELS in a grid, three across
and two down, all printed on ONE continuous dark ground. The gap between panels is bare
dark ground, about a thumb's width. No frames, no borders, no rules or lines between
panels, and nothing in the margins. Six separate prints pulled by the same hand on the same
dark paper — that is the whole image.

Nothing labels, numbers, captions or titles the SHEET: it carries no text of its own and no
panel is identified. Text INSIDE a panel is a different matter entirely — panels 1 and 2
carry the Japanese characters named below, printed as part of the picture, and that
instruction is not overridden by anything in this paragraph.

Colour is assigned by PRINT BLOCK, not by observation. Objects are not coloured the
colour they would be in life — a metal pot, a wooden table and a ceramic bowl are all
filled with flat colour from the palette, chosen for composition rather than realism.

THE PALETTE, and nothing outside it:
  ground     warm near-black  #1A1815   the paper. It is dark.
  line       warm cream       #FFFDF8   the key block. Line and small highlights ONLY.
  gold       #C9A045
  verdigris  #4F9C8D
  indigo     #8fa5c7   (the light rung — deep indigo vanishes on this ground)
  red        #D72E2E   used once at most per panel, as one large sharp note, never as a line
Each panel uses only two or three of the colours, plus the ground and the line. Across
the six panels, all four colours appear. There are no browns, no greys, no beiges, no
wood tones, no metal tones anywhere. The cream appears as LINE and as small carved
highlights — never as a field, a panel, a sky, or any light area wider than a few
strokes. No white. No light sections. Every panel carries at least two palette colours
as flat inked areas — no panel is line only.

SHADING — permitted, in the two ways a woodblock print actually does it:
- BOKASHI: a colour hand-wiped so it fades into the dark ground across a flat plane — a
  night sky, a pool of lamplight, a wet street. It sits IN the plane and never wraps
  around an object. Exactly two panels use it, named below; the other four use none.
- CARVED HATCHING: parallel or crossed knife strokes cut into the block, for fabric
  folds, hair, and areas in shadow. It is line, not tone.
NOT permitted: volumetric rendering. No gradient following the curve of an object, no
specular highlight, no sheen on metal or ceramic, no soft cast shadow, no glow.

PRINT ARTEFACTS — the marks of an actual hand-pulled print, not simulated wear. These are
wanted, and wanted VISIBLY: prints with character, not clean reproductions with a hint of
texture. The first four must be obvious at a glance; the last three are fine detail for
close viewing and stay subtle.

OBVIOUS — carry these at full strength in every panel:
- Woodgrain from the block printing clearly through every large flat colour area, running
  in one consistent direction within each area, unmistakable rather than hinted at.
- Strongly uneven ink density across each flat field — markedly heavier where the baren
  pressed hard, thinning to streaks and patches of bare dark ground where the block ran
  dry. A flat area should never read as an even fill.
- Dry-brush flecking along the trailing edge of the broad colour areas, where the block
  carried too little ink to cover: broken, ragged, bare dark ground showing through.
- MISREGISTRATION, and in every panel at least one colour block is CLEARLY off — a visible
  band of bare dark ground down one side of a shape and a corresponding overlap of colour
  across the cream key line on the other, wide enough to read instantly as a hand-pulled
  misalignment. This is the signature mistake of the medium and it should be unmissable.
  The remaining blocks stay within a hairline. Each panel is misregistered differently;
  they were pulled one at a time.

FINE — these stay subtle, and must not be exaggerated:
- Faint circular burnishing swirls from the baren across the broadest colour areas.
- Pigment feathering a fraction of a millimetre at the edge of each colour area.
- Occasional small ticks and specks of stray colour just outside a shape's edge.

All of this texture must be IRREGULAR. It does not repeat, does not align to the shape it
sits in, and varies in density across one flat area. A uniform cross-hatch, an even
screen tone, or a repeating weave swatch is wrong — that reads as digital fill. Wood grain
is the model for how ALL of it should behave.

Avoid entirely: anime, manga, chibi, kawaii, cartoon mascots, large expressive eyes.
Avoid Mount Fuji, cherry blossoms, torii gates, geisha, samurai, dragons, koi, and every
other tourist emblem of Japan. Avoid modern flat-vector corporate illustration and rounded
blobby figures. Avoid gradients that describe form, drop shadows, glows, 3D rendering and
photorealism.

JAPANESE TEXT — render EXACTLY AND ONLY the strings the panels below name, on the surfaces
they name, and nothing else. This is transcription, not composition: do not invent
characters, do not letter a second surface because it looks empty, do not produce
decorative pseudo-kanji, and do not render approximate glyph-shaped marks. Panels 1 and 2
carry text. Panels 3, 4, 5 and 6 carry none at all. No English anywhere, ever.

Those characters are carved into the same block as the picture and carry the same woodcut
artefacts as everything else: irregular knife-cut edges, blunt terminations, uneven ink
density, misregistration against the key line, woodgrain printing through. Crisp digital
type laid over a textured print is the specific failure to avoid.

This sheet carries NO decorative borders, frames, rules or margin seals — not because the
finished prints avoid them (they carry them), but because this is a reference sheet of six
small panels and the borders would crowd out what it exists to show.

THE SIX PANELS, left to right, top row then bottom row:

PANEL 1: a small restaurant counter seen from the customer's side. A split noren curtain
hanging above, carrying exactly these two characters, large and simply carved: 食堂
One seated customer and one cook behind the counter. A bowl and chopsticks on the counter.
A standing menu card beside them carrying exactly two dish names, large, stacked: the first
line reads ラーメン and the second line directly beneath it reads ぎょうざ. Render no slash,
bullet or separator between them. Render only those characters, nothing else in this panel.
No other diners, no kitchen behind. Contemporary, not historical.

PANEL 2: a station ticket gate. One commuter with a shoulder bag passing through it.
The sign above the gate carries exactly these two characters, large and simply carved: 改札
A clock face beside it with hands but no numerals. A train in flat silhouette behind,
cropped by the panel edge. Render only those characters, nothing else in this panel.
No crowd, no shopfront. Contemporary, not historical.

PANEL 3: a low table seen from slightly above, set with a rice bowl, a soup bowl, and
chopsticks on a rest. Behind it, cropped by the panel edge, a pot on a modern burner with
steam rising as carved strokes. Four objects total. No window, no view, no background
scene, no shelving, no hanging utensils. No people. The objects carry it. Contemporary,
not historical.

PANEL 4 (bokashi): one adult walking home at night under a single streetlamp, a bag over
one shoulder. The lamp casts a bokashi pool of gold onto the pavement, fading into the
dark ground — the one gradient, and the subject. A low wall beside the pavement. No
buildings beyond the wall, no other people. Contemporary, not historical.

PANEL 5 (bokashi): one adult walking under an umbrella, coat pulled against the wind.
Rain as carved diagonal strokes. A single puddle catching the reflection. A bokashi wash
of indigo fading into the dark ground across the sky — the one gradient, and it is the
subject. No buildings, no other people. Contemporary, not historical.

PANEL 6: three adults standing together in contemporary everyday clothing — one coat,
one satchel, one scarf; one of them in glasses. Large in the panel, a flat frieze against
completely empty ground. Nothing else in the panel. Contemporary, not historical.

Output one image only.
```
