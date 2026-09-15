# Crest integration — generation prompts

For image-to-image with an attached crest. **Attach your crest export from Affinity
alongside the prompt** and the model composes a scene that incorporates it.

The point is not to produce final art. It is to get **several placements to react to** —
where the crest sits, how big it is, and whether it reads as part of the print or as
something pasted on top.

> **Rebuilt for the dark ground, 2026-09-14.** This file was first written against
> `docs/illustration-prompt.md`, the paper-ground prompt, which has since been deleted. The
> live pipeline is [`illustrations/`](../illustrations/README.md): warm near-black
> `#1A1815`, cream carved line, the negative of a traditional print.
>
> **The five integration strategies are ground-independent and stand.** Seal,
> carried-by-an-object, ghosted field, in-plane, corner anchor — all describe where a mark
> sits, not what colour it is. **Everything about colour inverted**, and two of those
> inversions are worth knowing before you run anything:
>
> - **Four of the five book inks ARE scene-palette colours on this ground** — Book One is
>   the scene's verdigris, Two its indigo, Three its red, Four its gold. So the crest is
>   not "an exception to the palette", as this file first claimed. It is a **reserved**
>   colour: the crest uses that ink and nothing else in the image does.
> - **A large crest on a dark sheet must be DARKER than the scene, not paler.** Variant C
>   asked for a pale tint, which is the paper-ground instinct. On near-black the eye goes
>   to the lightest thing in the frame, so a pale ghost would out-shout the cream key line.
>   C is corrected below.

Pair each block below with a scene from the live pipeline's style block. That block
governs print quality; this file only adds the crest on top of it.

---

## The rule that used to block this is gone

Both prompts used to carry a version of this, written before the crest direction existed:

> Avoid any decorative border or frame around the image, and any ornamental marks,
> seals, glyphs or characters in the corners or margins.

**Gone from the live style block since 2026-09-14.** It is replaced by a positive
requirement for carved borders, margin seals, cartouches and real Japanese text, all
carrying the same woodcut artefacts as the picture. The no-lettering rule went with it, so
the variants below no longer need to argue that a crest is a mark rather than type — though
they still say so, which costs nothing and keeps each block self-contained.

**This makes variant A much cheaper than it looks.** Every image in the live pipeline
already carries one or two margin seals. A is not introducing a new element into the
composition; it is telling the model *which mark* one of those seals carries.

## Two things the scene prompts should NOT inherit

**Do not tell the model the crest must stay subordinate to the ア hanko.** The hanko is app
chrome — it sits in the header, outside the illustration. That relationship gets judged
when the image lands on a screen, not inside the frame. Constraining it here just makes the
model shrink the crest to nothing.

**The crest's ink has to be RESERVED, and each block below says so.** On the dark ground
the scene palette is gold `#C9A045`, verdigris `#4F9C8D`, indigo `#8fa5c7` and one red
`#D72E2E`, over near-black `#1A1815` with a cream `#FFFDF8` key line. Four of the five book
inks are drawn from that list exactly. So the crest is not a colour the scene lacks — it is
a colour the scene has to **stop using**.

That is the whole mechanism, and it is worth stating plainly because it is not obvious: a
verdigris crest over a verdigris teapot is a shape lost in a field, while the same crest
over a gold-and-indigo scene is unmistakably a separate block. The style block also caps
each image at two or three colours, so an unqualified crest instruction makes the model
either recolour the crest or spend that cap twice. Every variant below therefore states
that the ink belongs to the crest alone and that the scene draws its own colours from what
is left. If you rewrite a block, keep that paragraph.

---

## A · Printed seal

The most authentic option and the smallest. Real woodblock prints carry the artist's and
publisher's seals; this is that, doing a different job.

```
Include the attached crest in the image as a PRINTED SEAL, the way a hand-pulled woodblock
print carries an artist's or publisher's seal.

Place it in one margin of the composition — a corner or along one edge, in the empty ground,
never overlapping a figure's face or the focal object. Size it small: roughly 6–9% of the
image width. Reproduce the attached mark's geometry faithfully; do not redraw, simplify or
reinterpret it, and do not add a border, ring or cartouche around it unless the attached
artwork already has one.

Print it in FLAT [BOOK COLOUR HEX], one solid colour with no gradient and no outline. It is
its own colour block, pulled from its own woodblock: it carries the same ink-density
variation, the same slight misregistration, and the same pigment feathering into the paper
as every other colour area in the print. It must look pressed into the same sheet, not
placed on top of it.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

PALETTE — the crest's ink is RESERVED. [BOOK COLOUR HEX], in whatever tint this block
asks for, is used for the crest and for nothing else in the image. Every other filled area
stays on the warm near-black ground #1A1815, the cream key line #FFFDF8, and the scene's
own two or three colours, chosen from whatever is left of gold #C9A045, verdigris #4F9C8D,
indigo #8fa5c7 and the one red #D72E2E. Do not recolour the crest to match something in the
scene, and do not drop it for falling outside the palette — it is a separate block in a
reserved ink, which is exactly why it reads as a mark rather than as part of the picture.
```

## B · Carved into the scene

The crest appears on something in the world — a noren curtain, a lantern, a roof tile, a
cup, the back of a jacket. The most native-looking result and the hardest to control.

```
Include the attached crest as a KAMON CARRIED BY AN OBJECT WITHIN THE SCENE — dyed into a
noren curtain, painted on a paper lantern, glazed onto a cup, pressed into a roof tile,
or woven into a garment. Choose whichever object the scene already contains and wears a
family crest most naturally.

Reproduce the attached mark's geometry faithfully. It may follow the surface it sits on —
curving with a hanging curtain, foreshortened on a tilted plane — but it must not be
redrawn, simplified or reinterpreted, and it must remain recognisable as the same mark.

Print it in FLAT [BOOK COLOUR HEX] against its object, one solid colour, carved edges, no
gradient. Where the object's own colour would fight it, change the OBJECT's colour rather
than the crest's.

Size it so the crest is legible without dominating: it should be the clearest single motif
in the frame after the human subject, not before.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

PALETTE — the crest's ink is RESERVED. [BOOK COLOUR HEX], in whatever tint this block
asks for, is used for the crest and for nothing else in the image. Every other filled area
stays on the warm near-black ground #1A1815, the cream key line #FFFDF8, and the scene's
own two or three colours, chosen from whatever is left of gold #C9A045, verdigris #4F9C8D,
indigo #8fa5c7 and the one red #D72E2E. Do not recolour the crest to match something in the
scene, and do not drop it for falling outside the palette — it is a separate block in a
reserved ink, which is exactly why it reads as a mark rather than as part of the picture.
```

## C · Large ghosted field

The boldest version, and the closest to what the emboss was reaching for — without the
tiling.

```
Include the attached crest as a LARGE FIELD BEHIND THE SCENE, printed as an additional
woodblock before the scene's own blocks.

Scale it very large — 60–85% of the image height — and centre it, or anchor it off one
edge so it runs out of frame. The figures and objects of the scene print OVER it and are
fully opaque; the crest shows only in the empty ground between them.

Reproduce the attached mark's geometry faithfully. Print it in a DEEP, DARKENED tint of
[BOOK COLOUR HEX] — a shade barely lifted off the near-black ground. The sheet is dark, so
the eye goes to the LIGHTEST thing in the frame: a pale ghost would out-shout the cream key
line and wreck the picture. This one sits just above the ground — unmistakably a deliberate
shape once you look for it, never the first thing you see. Flat colour, no gradient, no
outline, no drop shadow.

It must sit in the sheet, not float above it: same woodgrain, same uneven ink density, same
slight misregistration against the key block as every other colour area.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

PALETTE — the crest's ink is RESERVED. [BOOK COLOUR HEX], in whatever tint this block
asks for, is used for the crest and for nothing else in the image. Every other filled area
stays on the warm near-black ground #1A1815, the cream key line #FFFDF8, and the scene's
own two or three colours, chosen from whatever is left of gold #C9A045, verdigris #4F9C8D,
indigo #8fa5c7 and the one red #D72E2E. Do not recolour the crest to match something in the
scene, and do not drop it for falling outside the palette — it is a separate block in a
reserved ink, which is exactly why it reads as a mark rather than as part of the picture.
```

## D · Sky or empty plane

Bokashi's natural home. Quieter than C, more integrated.

```
Include the attached crest WITHIN ONE FLAT PLANE of the scene — the sky, a water surface, a
blank wall, a paper screen, a ground plane. It belongs to that plane and is bounded by it:
it does not extend past the plane's edges or overlap any object in front.

Scale it to roughly a third of that plane's area. Reproduce the attached mark's geometry
faithfully.

Print it in a tint of [BOOK COLOUR HEX] one or two steps from the plane's own colour — close
enough to read as part of the same field, separate enough to be unmistakably a mark. A
bokashi gradient may be hand-wiped ACROSS the plane and across the crest together, as a
single wipe over both; the crest itself takes no gradient of its own. This is the bokashi
the style block already permits under SHADING — it sits IN the plane and never wraps an
object, which is the only kind of gradient the block bans. The style block allows one
bokashi per image, so a scene that already spends it elsewhere cannot also wipe this one.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

PALETTE — the crest's ink is RESERVED. [BOOK COLOUR HEX], in whatever tint this block
asks for, is used for the crest and for nothing else in the image. Every other filled area
stays on the warm near-black ground #1A1815, the cream key line #FFFDF8, and the scene's
own two or three colours, chosen from whatever is left of gold #C9A045, verdigris #4F9C8D,
indigo #8fa5c7 and the one red #D72E2E. Do not recolour the crest to match something in the
scene, and do not drop it for falling outside the palette — it is a separate block in a
reserved ink, which is exactly why it reads as a mark rather than as part of the picture.
```

## E · Corner anchor, scene composed around it

Mid-size. Tests whether the scene can be built to make room for the mark rather than having
it added afterwards.

```
Include the attached crest as a CORNER ANCHOR, and compose the scene around it.

Place it in one corner at roughly 18–25% of the image width. Then build the scene's
composition to accommodate it: leave that corner's ground genuinely empty, let the figures
and objects mass toward the opposite diagonal, and let the crest balance them. The result
should look composed for the mark, not cropped around it.

Reproduce the attached mark's geometry faithfully. Print it in FLAT [BOOK COLOUR HEX], one
solid colour, no gradient, no outline, no surrounding frame or ring.

Same block artefacts as the rest of the print: woodgrain, uneven density, slight
misregistration, pigment feathering.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

PALETTE — the crest's ink is RESERVED. [BOOK COLOUR HEX], in whatever tint this block
asks for, is used for the crest and for nothing else in the image. Every other filled area
stays on the warm near-black ground #1A1815, the cream key line #FFFDF8, and the scene's
own two or three colours, chosen from whatever is left of gold #C9A045, verdigris #4F9C8D,
indigo #8fa5c7 and the one red #D72E2E. Do not recolour the crest to match something in the
scene, and do not drop it for falling outside the palette — it is a separate block in a
reserved ink, which is exactly why it reads as a mark rather than as part of the picture.
```

---

## Running these

Replace `[BOOK COLOUR HEX]` with the book's ink on the **dark ground** `#1A1815`:

| Book | Hue | Crest ink | On the dark ground | What the scene gives up |
| --- | --- | --- | --- | --- |
| One — the foundation | Rokushō 緑青 | `#4F9C8D` (500) | 5.46:1 | its verdigris |
| Two — the bridge | Ai-iro 藍色 | **`#8fa5c7` (300)** | 7.06:1 | its indigo |
| Three — the wall | Akane 茜色 | `#D72E2E` (500) | 3.64:1 | its red — read the note |
| Four — register | Ōgon 黄金 | `#C9A045` (500) | 7.25:1 | its gold |
| Five — refinement | Sumi-iro 墨色 | unsettled — read the note | — | nothing; it is outside the palette |

The last column is the reserved-ink rule in practice. A Book Four scene is built from
verdigris and indigo, because the gold now belongs to the crest.

**Book Two takes the light rung, and this is not a second identity value.** At Ai 500 it
measures **1.57:1** on near-black — invisible. The dark pipeline already hit this and
already solved it for the scene ink, listing indigo as *"`#8fa5c7` (the light rung — deep
indigo vanishes on this ground)"*. Book Two's crest just uses the ink the scenes already
use.

The 500-step lock in
[`book-identity-and-checkpoint-mockups-plan.md`](book-identity-and-checkpoint-mockups-plan.md)
is untouched by this. That lock governs a book's **chrome** — its band, its tag, its
accent. This is the **printed ink** a crest is pulled in, inside an illustration whose
whole palette is already re-rung for the dark ground. Same identity, the print's ink set.

**If the author would rather Book Two keep its 500 anyway:** the only other way out is
giving it a light plane to sit on inside the picture, which means designing Book Two's
scenes around a constraint the other four do not have. The light rung is cheaper, and it
follows the pipeline's own precedent.

### Book Three — the one with a hard constraint

Akane *is* the scene palette's red, and the style block caps red at *"used once at most, as
one large sharp note, never as a line"*. So if the crest is red, **the crest is that note**
and the scene gets no other red anywhere. Add this line to whichever block you run:

```
The crest is the image's ONE red. No other red appears anywhere in the scene.
```

At 3.64:1 Akane is also the weakest of the five, though still clear of the 3:1 a non-text
mark needs. Watch it in the first generation; if it reads thin, Akane 300 `#ec9791` gives
7.93:1.

### Book Five — unsettled, and it does not block the first round

Sumi 500 on near-black is **1.29:1**. It *is* the ground. Stone-300 `#CFC9B9` measures
10.72:1 and was the earlier recommendation here, but it collides with the live style block,
which says the cream and near-cream values appear *"as LINE and as small carved highlights
— never as a field, a panel, a sky, or any light area wider than a few strokes."* At
variant A's 6–9% a filled stone seal is a small carved highlight and is fine. At C's 60–85%
or E's 18–25% it is a light field, which the block bans outright.

**Recommendation: Book Five's crest is drawn in the cream key line — outlined, not filled.**
It is the one form that works at every size, needs no contrast arithmetic, and is honest
about what Sumi is on this ground: the mark is *carved*, left in reserve, the block uncut.
The cost is real — it reads as part of the drawing rather than as a separate printed block,
which is the thing this whole file argues a crest should be. Variant A survives that
anyway, because a seal reads as a seal by where it sits, not by what colour it is.

**The alternative, if the outline reads too weak:** stone-300 filled, restricted to variants
A and B. That is the author's call, and nothing waits on it — the first round runs one
variant across two or three crests, so Book Five's ink is a decision for later.

**Run one variant across two or three different crests before running one crest across all
five variants.** The question you are answering first is which integration strategy works
at all; which crest belongs to which book is a later and cheaper decision.
