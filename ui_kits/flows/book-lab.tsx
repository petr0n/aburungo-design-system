/**
 * Book identity lab — the two decisions the plan is blocked on, rendered.
 *
 * `docs/book-identity-and-checkpoint-mockups-plan.md` records both as text and
 * that was not enough to decide from. This is the "render options rather than
 * argue them" the plan itself asks for.
 *
 * Nothing here is a component yet. It is deliberately composed at the call site
 * so a decision can change it without touching `src/components` — the shipped
 * `AppHeader` is `bg-inverse` and takes no hue, which is correct until a book
 * hue is agreed.
 *
 * `BOOKS`, `BookBand` and `Checkpoint` are exported because `checkpoint.tsx`
 * renders the chosen treatment as a real flow, in both harnesses. The lab keeps
 * every option; the flow carries only the one that won. Neither copies the
 * other — that is the drift this repo keeps paying for.
 *
 * Crests: all five slots are wired now (2026-08-21). Three MOTIFS are drawn —
 * the clover, the leaf and the blossom — so books four and five wear the solid
 * cut of the leaf and the clover rather than a motif of their own. Different
 * ground at a glance, same drawing underneath. See the crest block in
 * `src/brand.css` for how they are generated and brought to weight.
 */
import { useState } from 'react'
import { AppHeader, Button, Maru, ProgressBar } from '../../src/components'
import type { AnswerOutcome } from '../../src/components'
import { Phone, Screen, fromUrl } from './shell'

export type Book = {
  id: string
  title: string
  level: string
  hue: string
  hueName: string
  /** Tailwind classes for the book's chrome band and its rule. */
  /** The label ink this band can actually carry. See BookBand. */
  ink: string
  band: string
  /** The 900 step. The 500s cannot carry white text -- see the lab's note. */
  deep: string
  rule: string
  tag: string
  crest: string
  tile: string
  character: string
}

/**
 * The books. **There is deliberately no limit on how many.**
 *
 * An earlier version of this file declared `BookId` as a closed five-way union
 * so a sixth book failed the build. The author's call, 2026-08-21: *"I don't
 * want a limit on books because this site isn't static."* Books get added; a
 * type that has to be edited before content can ship is a tax on the thing the
 * product is for.
 *
 * So `BookId` is read back off this array instead. Add an entry and every
 * surface that keys off a book id — the checkpoint flow's state rail, its deep
 * links — widens with it, with no second place to edit and still no `as` cast
 * anywhere. `satisfies` keeps each entry checked against `Book` while leaving
 * the ids as literals rather than widening them to `string`.
 *
 * What does NOT come for free is the identity. See "Where a sixth identity
 * comes from" in the plan: the hue and the crest are two axes and they
 * multiply, so book six is an existing hue with a different crest, not a
 * sixth hue. The palette is five colours with one job each and adding to it
 * is how a palette stops meaning anything.
 */
export const BOOKS = [
  { id: 'one', ink: 'text-stone-900',   title: 'Book One',   level: '~N5', hue: 'rokusho', hueName: 'Rokushō 緑青',
    band: 'bg-accent-rokusho', deep: 'bg-rokusho-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-rokusho-bg text-accent-rokusho-fg',
    crest: 'crest-1', tile: 'tile-sm', character: 'the foundation' },
  { id: 'two', ink: 'text-fg-inverse',   title: 'Book Two',   level: '~N4', hue: 'ai', hueName: 'Ai-iro 藍色',
    band: 'bg-accent-ai', deep: 'bg-ai-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-ai-bg text-fg-heading',
    crest: 'crest-2', tile: 'tile-md', character: 'the bridge' },
  { id: 'three', ink: 'text-fg-inverse', title: 'Book Three', level: '~N3', hue: 'akane', hueName: 'Akane 茜色',
    band: 'bg-accent-akane', deep: 'bg-akane-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-akane-bg text-error-fg',
    crest: 'crest-3', tile: 'tile-sm', character: 'the wall' },
  { id: 'four', ink: 'text-stone-900',  title: 'Book Four',  level: '~N2', hue: 'ogon', hueName: 'Ōgon 黄金',
    band: 'bg-accent-ogon', deep: 'bg-ogon-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-ogon-bg text-accent-ogon-fg',
    crest: 'crest-4', tile: 'tile-md', character: 'register' },
  { id: 'five', ink: 'text-fg-inverse',  title: 'Book Five',  level: '~N1', hue: 'sumi', hueName: 'Sumi-iro 墨色',
    band: 'bg-accent-sumi', deep: 'bg-accent-sumi', rule: 'border-rule-on-inverse', tag: 'bg-accent-sumi-bg text-fg',
    crest: 'crest-5', tile: 'tile-lg', character: 'refinement' },
] as const satisfies readonly Book[]

/** Every id in BOOKS, as a union — derived, so adding a book is one edit. */
export type BookId = (typeof BOOKS)[number]['id']

/**
 * The book's chrome band. Composed here, not in AppHeader — see the file note.
 *
 * **The ink is per band, and the subtitle shares it.** `AppHeader` draws its
 * title in paper and its subtitle in `fg-on-inverse-2`, a muted grey — which
 * works because that band is Sumi, near-black, with room underneath. Put the
 * same pair on a mid-tone hue and it collapses: measured across the five,
 * **six of ten labels failed AA**, worst at Book Four's subtitle on 1.02:1.
 *
 * Two rules fix all ten:
 *
 *   1. the ink is chosen per band — dark on the light hues (Rokushō, Ōgon),
 *      paper on the dark ones (Ai, Akane, Sumi);
 *   2. the subtitle uses the *same* ink as the title, not a muted step. There
 *      is no muted step that survives on Akane — the grey is 1.95:1 there.
 *
 * Hierarchy comes from size and weight instead, which it mostly already did.
 * Dimming the subtitle back with opacity would just re-spend the contrast this
 * is recovering.
 */
export function BookBand({ book, title, subtitle, progress, deep = false }: {
  book: Book; title: string; subtitle?: string; progress?: number; deep?: boolean
}) {
  // Every 900 step is dark enough for paper, so the deep band ignores the
  // per-hue ink and always uses it.
  const ink = deep ? 'text-fg-inverse' : book.ink
  return (
    <header className={`border-b-[6px] ${book.rule} ${deep ? book.deep : book.band}`}>
      <div className="grid min-h-[56px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-jp text-body font-bold text-accent-fg"
          aria-hidden="true"
        >
          ア
        </span>
        <div className="text-center">
          <h1 className={`text-heading-sm font-semibold ${ink}`}>{title}</h1>
          {subtitle !== undefined && (
            <p className={`text-caption ${ink}`}>{subtitle}</p>
          )}
        </div>
        <span />
      </div>
      {/* The ink class goes on the bar's wrapper, not only on the labels:
          `on-accent` draws in `currentColor`, and without it the bar inherited
          body text and came out #2D2D2D on every band — 1.00:1 against Book
          Five's Sumi. The first fix moved the bug rather than removing it, and
          only measuring the render showed that. */}
      {progress !== undefined && (
        <div className={`px-4 pb-2 ${ink}`}>
          {/* `on-accent`, not the default/inverse pair: those only swap the
              TRACK, and the fill stayed Rokushō 500 — the same colour as Book
              One's own band, measured at 1.00:1. See the tone note on
              ProgressBar. This draws in the band's ink, which is already
              chosen to be legible on the hue. */}
          <ProgressBar value={progress} tone="on-accent" />
        </div>
      )}
    </header>
  )
}

/**
 * Every verdict colour this lab has rendered, kept.
 *
 * **Nothing is removed from this list when it loses.** A rejected option is the
 * most useful thing on the page six weeks later — it is the answer to "why not
 * purple", and re-deriving it costs another round of rendering and another
 * round of the author's time. The three candidates below were cut on
 * 2026-08-21 and then deleted from this file, which is the mistake this comment
 * exists to stop repeating. Add a verdict; never replace one.
 *
 * `hex: undefined` means the shipped tokens, so the chosen row cannot drift
 * from what actually ships. Every other row carries literal hex on purpose:
 * they are a historical record, not a source of truth, which is why the raw
 * values are allowed here and nowhere in `src/`.
 */
type Tone = { bg: string; border: string; glyph: string; fg: string }

type Verdict = {
  id: string
  name: string
  note: string
  /** Where it ended up. `chosen` is what ships. */
  status: 'chosen' | 'superseded' | 'rejected'
  /** undefined = the shipped tokens. */
  hex?: { correct: Tone; review: Tone }
}

/**
 * The live tint and edge, as `var()` rather than as hex.
 *
 * Only the *glyph* changed on 2026-08-21 — `success-500` and `error-500` moved
 * from the 500 step to the 800. `success-bg` and `success-border` were not part
 * of that and are not part of the record, so the `before` row below spreads
 * these and overrides the glyph alone. That is exactly the comparison being
 * made: the old mark on today's tint.
 *
 * Written as `var(--color-…)` after review on #40. As hex they were a second
 * copy of four token values, sitting under a name that claimed to be the
 * shipped roles — the drift this repo has a whole build step to prevent. An
 * inline style resolves `var()` against the same cascade the class would.
 *
 * They had already drifted, in the commit that introduced them: the correct
 * tint was written #EDF5F3 against rokusho-100's real #D9EBE7, and the edge
 * #A7CFC7 against rokusho-300's #85BFB3. The `before` row was therefore
 * comparing the old glyph on a tint the product has never shipped. Read back
 * off the rendered page, both rows now differ in the glyph alone, which is the
 * only thing that changed.
 */
const LIVE_CORRECT: Tone = {
  bg: 'var(--color-success-bg)',
  border: 'var(--color-success-border)',
  glyph: 'var(--color-success-500)',
  fg: 'var(--color-success-fg)',
}
const LIVE_REVIEW: Tone = {
  bg: 'var(--color-error-bg)',
  border: 'var(--color-error-border)',
  glyph: 'var(--color-error-500)',
  fg: 'var(--color-error-fg)',
}

const VERDICTS: Verdict[] = [
  {
    id: 'before',
    name: 'Before — the verdict at 500',
    status: 'superseded',
    note: 'success-500 was hardcoded #4F9C8D and error-500 #D72E2E: exactly Rokushō and Akane, exactly what Book One and Book Three wear as chrome.',
    hex: {
      correct: { ...LIVE_CORRECT, glyph: '#4F9C8D', fg: '#4F9C8D' },
      review: { ...LIVE_REVIEW, glyph: '#D72E2E', fg: '#D72E2E' },
    },
  },
  {
    id: 'after',
    name: 'After — the verdict at 800',
    status: 'chosen',
    note: 'Rokushō 800 and Akane 800. Same two colours, two steps down: 114 and 109 away from the bands in RGB distance, and both finally clear AA on their own tint, where the 500s measured 3.98:1 and failed.',
  },
  {
    id: 'fuji-kuchiba',
    name: 'Rejected — Fuji 藤 + Kuchiba 朽葉',
    status: 'rejected',
    note: 'Wisteria and decayed-leaf. Both traditional, both well clear of the five. Cut because the palette already had darker steps of the two colours it needed, and adding hues six and seven to resolve a collision between five is how a palette stops meaning anything.',
    hex: {
      correct: { bg: '#EDE7F4', border: '#C4B3DC', glyph: '#7B5EA7', fg: '#3F2B5B' },
      review: { bg: '#F2EADB', border: '#D9C49A', glyph: '#7A5F2C', fg: '#4A3A1C' },
    },
  },
  {
    id: 'kikyo-kuchiba',
    name: 'Rejected — Kikyō 桔梗 + Kuchiba 朽葉',
    status: 'rejected',
    note: 'Bellflower is deeper and cooler than wisteria — more separation from the warm ground. Cut with the rest of the off-palette set.',
    hex: {
      correct: { bg: '#E8E6F2', border: '#B3AED2', glyph: '#5F4E9B', fg: '#332A55' },
      review: { bg: '#F2EADB', border: '#D9C49A', glyph: '#7A5F2C', fg: '#4A3A1C' },
    },
  },
  {
    id: 'fuji-quiet',
    name: 'Rejected — Fuji 藤 + quiet ink',
    status: 'rejected',
    note: 'One new hue, not two. “Worth another look” is the product’s own wording — gentle, not a verdict — so it went quiet instead of taking a colour of its own. The quiet-review half is the part of this worth keeping in mind.',
    hex: {
      correct: { bg: '#EDE7F4', border: '#C4B3DC', glyph: '#7B5EA7', fg: '#3F2B5B' },
      review: { bg: '#EFEDE5', border: '#CFC9B9', glyph: '#6B665E', fg: '#403D38' },
    },
  },
]

const PHRASE = { jp: 'はじめまして', reading: 'はじめまして', en: 'Nice to meet you.' }
const MARKS: AnswerOutcome[] = ['correct', 'correct', 'review', 'correct']

/**
 * A chapter checkpoint. The gate, per DR-020: the only number is how many are
 * left and it shrinks to zero. No score, no percentage, no verdict.
 *
 * `chrome` is the decision under test — whether the book's hue reaches a
 * surface that is judging an answer.
 */
export function Checkpoint({ book, chrome, v }: {
  book: Book; chrome: 'book' | 'neutral'; v?: Verdict
}) {
  const fb = v?.hex
  const banded = chrome === 'book'
  return (
    <>
      {banded ? (
        <BookBand book={book} title="Chapter 3" subtitle="checkpoint" />
      ) : (
        <AppHeader title="Chapter 3" subtitle="checkpoint" />
      )}
      <Screen>
        <div className={`emboss-bg ${book.crest} ${book.tile} -mx-4 -mt-5 flex flex-1 flex-col gap-4 px-4 py-5`}>
          <div className="glass flex flex-col gap-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-fg-muted">
              8 left
            </span>
            <p className="text-body-sm text-fg-muted">
              Everything from this chapter, once each. Misses come back later.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 text-center">
            <p lang="ja" className="font-jp text-jp-lg text-fg-heading">{PHRASE.jp}</p>
            <p className="mt-4 text-body-sm text-fg-muted">Which one is this?</p>
            <div className="mt-3 flex flex-col gap-2">
              {['Nice to meet you.', 'See you later.', 'Good evening.'].map((o, i) => (
                <button
                  key={o}
                  type="button"
                  className={[
                    'min-h-[44px] rounded-lg border px-4 text-body',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                    i === 0
                      ? 'border-success-border bg-success-bg text-success-fg font-semibold'
                      : 'border-border bg-surface text-fg active:bg-surface-2',
                  ].join(' ')}
                >
                  {i === 0 && (fb
                    ? <span aria-hidden="true" className="mr-2" style={{ color: fb.correct.glyph }}>○</span>
                    : <Maru outcome="correct" className="mr-2 inline-block" />)}
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* The row of marks so far — this is where correctness colour lives. */}
          <div className="glass flex items-center gap-3">
            <span className="text-caption font-semibold uppercase tracking-wider text-fg-muted">So far</span>
            <div className="flex gap-2">
              {MARKS.map((m, i) =>
                fb ? (
                  <span key={i} aria-hidden="true" className="text-heading-sm"
                    style={{ color: m === 'correct' ? fb.correct.glyph : fb.review.glyph }}>
                    {m === 'correct' ? '○' : '✕'}
                  </span>
                ) : (
                  <Maru key={i} outcome={m} className="text-heading-sm" />
                ))}
            </div>
          </div>

          {/* A candidate replaces the whole banner, not just its glyph — the
              tint and the edge are most of what a verdict colour IS, and
              judging one by the ○ alone is what made the first pass at this
              state unreadable. `undefined` falls through to the shipped roles. */}
          <div className="flex flex-col gap-2">
            <div
              className="rounded-lg border border-success-border bg-success-bg p-3 text-center text-body font-semibold text-success-fg"
              style={fb ? { backgroundColor: fb.correct.bg, borderColor: fb.correct.border, color: fb.correct.fg } : undefined}
            >
              <span aria-hidden="true" className="mr-2"
                style={fb ? { color: fb.correct.glyph } : undefined}>○</span>
              Correct
            </div>
            <div
              className="rounded-lg border border-error-border bg-error-bg p-3 text-center text-body font-semibold text-error-fg"
              style={fb ? { backgroundColor: fb.review.bg, borderColor: fb.review.border, color: fb.review.fg } : undefined}
            >
              <span aria-hidden="true" className="mr-2"
                style={fb ? { color: fb.review.glyph } : undefined}>✕</span>
              Worth another look
            </div>
          </div>
          <Button variant="ghost" fullWidth>Skip for now</Button>
        </div>
      </Screen>
    </>
  )
}

/** A lesson page, so the five identities can be compared on ordinary content. */
function LessonPage({ book, deep = false }: { book: Book; deep?: boolean }) {
  return (
    <>
      <BookBand book={book} title={book.title} subtitle="Chapter 3 · 4 of 12" progress={0.33} deep={deep} />
      <Screen>
        <div className={`emboss-bg ${book.crest} ${book.tile} -mx-4 -mt-5 flex flex-1 flex-col gap-4 px-4 py-5`}>
          <div className="glass flex flex-col gap-3">
            <span className={`inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-caption font-bold uppercase tracking-wider ${book.tag}`}>
              Greetings &amp; basics
            </span>
            <p lang="ja" className="font-jp text-jp-display text-fg-heading">{PHRASE.jp}</p>
            <p lang="ja" className="font-jp text-jp text-action-2-fg">{PHRASE.reading}</p>
            <p className="text-body text-fg">{PHRASE.en}</p>
          </div>
          <Button fullWidth>Show answer</Button>
          <p className="text-center text-caption text-fg-muted">
            {book.hueName} · {book.character}
          </p>
        </div>
      </Screen>
    </>
  )
}

const STATES = [
  { id: 'identities', label: 'Five identities', note: 'a lesson page in each book' },
  { id: 'collision', label: '⚠ The collision', note: 'book hue ON a judging surface' },
  { id: 'resolved', label: 'Resolution (a)', note: 'book hue suppressed when judging' },
  { id: 'deep', label: 'Deep band (900)', note: 'the hue at a step that can carry text' },
  { id: 'feedback', label: '✅ Verdict at 800', note: 'every verdict tried, on all five books' },
] as const

type StateId = (typeof STATES)[number]['id']

/**
 * One phone, scaled down so a row of them fits on a laptop at once.
 *
 * The comparison is the whole point of this surface, and it does not survive
 * horizontal scrolling — you cannot judge identities against each other two at
 * a time. `zoom` rather than `transform: scale` so the row still takes its
 * reduced width in layout instead of overlapping.
 *
 * The row wraps rather than fixing a count. Five fit across at this zoom; there
 * is no limit on books, so the sixth goes to a second line instead of off the
 * edge of the page.
 */
function Slot({ children, label, sub }: { children: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span className="text-caption font-semibold uppercase tracking-wider text-fg-heading">{label}</span>
      <span className="text-caption text-fg-muted">{sub}</span>
      <div style={{ zoom: 0.62 }}>{children}</div>
    </div>
  )
}

/** Role tokens, so a rejected row reads as rejected without a new colour. */
const STATUS_TAG: Record<Verdict['status'], string> = {
  chosen: 'bg-success-bg text-success-fg',
  superseded: 'bg-surface-2 text-fg-muted',
  rejected: 'bg-surface-2 text-fg-muted',
}

function Rail({ current, onSelect }: { current: StateId; onSelect: (id: StateId) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          aria-pressed={current === s.id}
          className={[
            'min-h-[44px] rounded-lg border px-4 text-body-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
            current === s.id
              ? 'border-transparent bg-action text-action-fg'
              : 'border-border bg-surface text-fg-muted active:bg-surface-2',
          ].join(' ')}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}

/**
 * The lab hosts its own page rather than going through `FlowPage`, which caps
 * at `max-w-5xl` — wide enough for one phone beside a legend, and not for five
 * side by side.
 */
export function BookLab() {
  const [state, setState] = useState<StateId>(
    fromUrl('state', STATES.map((s) => s.id), 'identities'),
  )

  const note = {
    identities: 'A lesson page in each book. Same content, same components, same layout — the only thing that changes is the chrome hue, the crest and its density. Five grounds, three motifs: books four and five carry the solid cut of book two’s leaf and book one’s clover.',
    collision: 'Rokushō means “correct” and Akane means “wrong”. On a checkpoint they are the chrome AND the verdict. Watch the ○ against Book One’s band, and the ✕ against Book Three’s.',
    resolved: 'The book hue steps back when the page starts judging. Sumi band, warm stone, and the book is carried by its crest and type instead — so correctness colour is the only colour with a job on the screen. Note what this costs: all five look the same.',
    feedback: 'The five identities stay exactly as they are. The verdict moves DOWN THE RAMP instead — Rokushō 800 and Akane 800, the same two colours two steps darker. Every verdict this lab has rendered is kept below, on all five books: what ships, what it replaced, and the three off-palette candidates that were rejected. Rejected rows stay so they can be pointed at later, not re-derived.',
    deep: 'The 500 steps are accent values for light grounds and cannot carry white text — six of ten band labels failed WCAG, Book Four’s subtitle at 1.02:1. At the 900 step every hue clears it, and the band stays One Dark Slab as DESIGN.md requires: a dark slab with a hue, rather than a coloured one.',
  }[state]

  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg font-semibold text-fg-heading">
          Book identity — the two open decisions
        </h1>
        <p className="max-w-prose text-body text-fg-subtle">
          Rendered rather than described. Each book now carries its own crest and its own
          tile density — though only three motifs are drawn, so books four and five wear the
          solid cut of the leaf and the clover until two more exist.
        </p>
      </header>

      <Rail current={state} onSelect={setState} />
      <p className="max-w-prose text-body text-fg">{note}</p>

      {state === 'feedback' ? (
        <div className="flex flex-col gap-8">
          {VERDICTS.map((v) => (
            <section key={v.id} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-sm font-semibold text-fg-heading">{v.name}</h2>
                  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-caption font-bold uppercase tracking-wider ${STATUS_TAG[v.status]}`}>
                    {v.status}
                  </span>
                </div>
                <p className="max-w-prose text-body-sm text-fg-muted">{v.note}</p>
              </div>
              {/* All five, not just the two the verdict collided with. Books
                  One and Three are where the 500 verdict was literally the
                  chrome, so they are the sharpest test — but a verdict colour
                  has to survive every band it will ever sit under, and two of
                  five cannot show that. */}
              <div className="flex flex-wrap items-start gap-5">
                {BOOKS.map((b) => (
                  <Slot key={b.id} label={`${b.title} · ${b.hueName}`} sub="book chrome kept">
                    <Phone><Checkpoint book={b} chrome="book" v={v} /></Phone>
                  </Slot>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-5">
          {BOOKS.map((b) => (
            <Slot
              key={b.id}
              label={`${b.title} · ${b.level}`}
              sub={state === 'resolved' ? 'neutral chrome' : state === 'deep' ? `${b.hueName} 900` : b.hueName}
            >
              <Phone>
                {state === 'identities' && <LessonPage book={b} />}
                {state === 'deep' && <LessonPage book={b} deep />}
                {(state === 'collision' || state === 'resolved') && (
                  <Checkpoint book={b} chrome={state === 'collision' ? 'book' : 'neutral'} />
                )}
              </Phone>
            </Slot>
          ))}
        </div>
      )}
    </div>
  )
}
