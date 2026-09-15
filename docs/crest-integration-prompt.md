# Crest integration — generation prompts

For image-to-image with an attached crest. **Attach your crest export from Affinity
alongside the prompt** and the model composes a scene that incorporates it.

The point is not to produce final art. It is to get **several placements to react to** —
where the crest sits, how big it is, and whether it reads as part of the print or as
something pasted on top.

Pair each block below with a scene from [`illustration-prompt.md`](illustration-prompt.md).
That file's style block governs the print quality and now *asks* for borders, seals,
cartouches and real Japanese text; this file only adds the crest on top of it.

---

## The rule that used to block this is gone

`illustration-prompt.md` used to carry this, written before the crest direction existed:

> Avoid any decorative border or frame around the image, and any ornamental marks,
> seals, glyphs or characters in the corners or margins.

**Already done — 2026-09-13.** That sentence is gone from all five chapter blocks, replaced
by a positive requirement for borders, seals, cartouches and real Japanese text, all
carrying the same woodcut artefacts as the picture. The no-lettering rule went with it, so
the variants below no longer need to argue that a crest is a mark rather than type — though
they still say so, which costs nothing and keeps each block self-contained.

## Two things the scene prompts should NOT inherit

**Do not tell the model the crest must stay subordinate to the ア hanko.** The hanko is app
chrome — it sits in the header, outside the illustration. That relationship gets judged
when the image lands on a screen, not inside the frame. Constraining it here just makes the
model shrink the crest to nothing.

**The scene palette does not include every book colour, and each block below says so.**
The chapter scenes are built from deep indigo `#1F3A66`, verdigris `#4F9C8D`, antique gold
`#C9A045` and paper `#FFFDF8`. Akane `#D72E2E` and Sumi `#2D2D2D` are *not* in it.

That is useful rather than a problem — a Book Three crest in Akane over an
indigo-and-verdigris scene reads as a separate printed plane, which is what a book mark
should do. **But the scene prompt says every filled area must be one of its four colours**,
so pasted together without a qualifier the two instructions contradict each other and the
model resolves it by recolouring the crest or dropping it. Every variant below therefore
states that the crest is the sole exception and that all other areas stay on the scene
palette. If you rewrite a block, keep that sentence.

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

The crest's colour is the ONE exception to the scene's four-colour palette. Every
non-crest area in the image stays on deep indigo #1F3A66, verdigris #4F9C8D, antique gold
#C9A045 and the paper ground #FFFDF8. Do not recolour the crest to fit that palette and do
not drop it because it falls outside — it is a separate block in a separate ink, which is
exactly why it reads as a mark rather than as part of the picture.
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

The crest's colour is the ONE exception to the scene's four-colour palette. Every
non-crest area in the image stays on deep indigo #1F3A66, verdigris #4F9C8D, antique gold
#C9A045 and the paper ground #FFFDF8. Do not recolour the crest to fit that palette and do
not drop it because it falls outside — it is a separate block in a separate ink, which is
exactly why it reads as a mark rather than as part of the picture.
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

Reproduce the attached mark's geometry faithfully. Print it in a PALE TINT of
[BOOK COLOUR HEX] — light enough that it never competes with the key line block, strong
enough to read clearly as a deliberate shape rather than a stain. Flat colour, no gradient,
no outline, no drop shadow.

It must sit in the paper, not float above it: same woodgrain, same uneven ink density, same
slight misregistration against the key block as every other colour area.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

The crest's colour is the ONE exception to the scene's four-colour palette. Every
non-crest area in the image stays on deep indigo #1F3A66, verdigris #4F9C8D, antique gold
#C9A045 and the paper ground #FFFDF8. Do not recolour the crest to fit that palette and do
not drop it because it falls outside — it is a separate block in a separate ink, which is
exactly why it reads as a mark rather than as part of the picture.
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
the style block already permits under SHADING, not an exception to "avoid gradients" — no
gradient wraps an object, and the crest takes no gradient on its own account.

The crest is a mark, not text, and the scene's transcribe-only text rule does not apply to
it.

The crest's colour is the ONE exception to the scene's four-colour palette. Every
non-crest area in the image stays on deep indigo #1F3A66, verdigris #4F9C8D, antique gold
#C9A045 and the paper ground #FFFDF8. Do not recolour the crest to fit that palette and do
not drop it because it falls outside — it is a separate block in a separate ink, which is
exactly why it reads as a mark rather than as part of the picture.
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

The crest's colour is the ONE exception to the scene's four-colour palette. Every
non-crest area in the image stays on deep indigo #1F3A66, verdigris #4F9C8D, antique gold
#C9A045 and the paper ground #FFFDF8. Do not recolour the crest to fit that palette and do
not drop it because it falls outside — it is a separate block in a separate ink, which is
exactly why it reads as a mark rather than as part of the picture.
```

---

## Running these

Replace `[BOOK COLOUR HEX]` with the book's identity value:

| Book | Hue | Hex |
| --- | --- | --- |
| One — the foundation | Rokushō 緑青 | `#4F9C8D` |
| Two — the bridge | Ai-iro 藍色 | `#1F3A66` |
| Three — the wall | Akane 茜色 | `#D72E2E` |
| Four — register | Ōgon 黄金 | `#C9A045` |
| Five — refinement | Sumi-iro 墨色 | `#2D2D2D` |

**Book Two is the awkward one.** Ai-iro is also the scene's line-block colour, so an Ai
crest on an Ai-heavy scene will disappear. For Book Two, either run the crest at
`#0a1322` (Ai 900) so it reads as a deeper block, or pick a scene whose ground is
verdigris rather than indigo.

**Run one variant across two or three different crests before running one crest across all
five variants.** The question you are answering first is which integration strategy works
at all; which crest belongs to which book is a later and cheaper decision.
