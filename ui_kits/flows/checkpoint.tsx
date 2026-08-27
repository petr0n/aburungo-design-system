/**
 * Chapter checkpoint — the decided treatment, as a flow.
 *
 * **This is the lock-in of "After — the verdict at 800".** The lab
 * (`?flow=books&state=feedback`) still holds all five verdicts side by side so
 * a rejected one can be pointed at later; this file holds the one that won, and
 * only that one. The lab is for choosing. This is what was chosen.
 *
 * Two things follow from that, and both are the point:
 *
 * 1. **No hex.** The lab's losing rows carry literal colours because they are a
 *    record. This carries none — `Maru` and the two banners read
 *    `success-*` / `error-*`, which `src/tokens.css` now points at Rokushō 800
 *    and Akane 800. Change the token and this screen changes with it. There is
 *    nothing here to keep in step.
 * 2. **It is a `FlowDef`,** so `ui_kits/mobile/` renders it in the device frame
 *    without a second copy existing. That is the whole reason the flow contract
 *    exists — see the note on `FlowDef` in `shell.tsx`.
 *
 * The state rail is the five books rather than five screen states: the question
 * this surface answers is whether one checkpoint design survives every band,
 * and you cannot see that one book at a time.
 */
import { BOOKS, Checkpoint } from './book-lab'
import type { BookId } from './book-lab'
import type { FlowDef, FlowState } from './shell'

// `b.id` is already `BookId` -- see the type in book-lab. It used to be
// `b.id as BookId`, which CLAUDE.md bans outside a validated trust boundary,
// and an array of books is not one.
const STATES: readonly FlowState<BookId>[] = BOOKS.map((b) => ({
  id: b.id,
  label: b.title,
  note: `${b.hueName} · ${b.stage} · ${b.character}`,
}))

export const checkpointFlow: FlowDef<BookId> = {
  id: 'checkpoint',
  label: 'Checkpoint',
  title: 'Chapter checkpoint',
  blurb:
    'The gate at the end of a chapter, in each of the five books. The only number is how many are left and it shrinks to zero — no score, no percentage, per DR-020. The book keeps its chrome here: the verdict sits at Rokushō 800 and Akane 800, two steps down the same ramp, so correctness never wears a colour a band is already wearing.',
  states: STATES,
  initial: 'one',
  Screens({ state }) {
    const book = BOOKS.find((b) => b.id === state) ?? BOOKS[0]
    // `chrome="book"` and no `v`: the band keeps the book's hue, and the
    // verdict comes from the shipped tokens rather than a lab override.
    return <Checkpoint book={book} chrome="book" />
  },
}
