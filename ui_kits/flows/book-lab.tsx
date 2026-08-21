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
 * Crests: only `crest-1` and `crest-2` are wired, so books 3-5 borrow them.
 * The three new motifs are the author's to draw; the point of this surface is
 * the HUE decision, which the borrowed crests do not affect.
 */
import { useState } from 'react'
import { AppHeader, Button, Maru, ProgressBar } from '../../src/components'
import type { AnswerOutcome } from '../../src/components'
import { Phone, Screen, fromUrl } from './shell'

type Book = {
  id: string
  title: string
  level: string
  hue: string
  hueName: string
  /** Tailwind classes for the book's chrome band and its rule. */
  band: string
  /** The 900 step. The 500s cannot carry white text -- see the lab's note. */
  deep: string
  rule: string
  tag: string
  crest: string
  tile: string
  character: string
}

const BOOKS: Book[] = [
  { id: 'one',   title: 'Book One',   level: '~N5', hue: 'rokusho', hueName: 'Rokushō 緑青',
    band: 'bg-accent-rokusho', deep: 'bg-rokusho-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-rokusho-bg text-accent-rokusho-fg',
    crest: 'crest-1', tile: 'tile-sm', character: 'the foundation' },
  { id: 'two',   title: 'Book Two',   level: '~N4', hue: 'ai', hueName: 'Ai-iro 藍色',
    band: 'bg-accent-ai', deep: 'bg-ai-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-ai-bg text-fg-heading',
    crest: 'crest-2', tile: 'tile-sm', character: 'the bridge' },
  { id: 'three', title: 'Book Three', level: '~N3', hue: 'akane', hueName: 'Akane 茜色',
    band: 'bg-accent-akane', deep: 'bg-akane-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-akane-bg text-error-fg',
    crest: 'crest-1', tile: 'tile-md', character: 'the wall' },
  { id: 'four',  title: 'Book Four',  level: '~N2', hue: 'ogon', hueName: 'Ōgon 黄金',
    band: 'bg-accent-ogon', deep: 'bg-ogon-900', rule: 'border-rule-on-inverse', tag: 'bg-accent-ogon-bg text-accent-ogon-fg',
    crest: 'crest-2', tile: 'tile-md', character: 'register' },
  { id: 'five',  title: 'Book Five',  level: '~N1', hue: 'sumi', hueName: 'Sumi-iro 墨色',
    band: 'bg-accent-sumi', deep: 'bg-accent-sumi', rule: 'border-rule-on-inverse', tag: 'bg-accent-sumi-bg text-fg',
    crest: 'crest-1', tile: 'tile-lg', character: 'refinement' },
]

/** The book's chrome band. Composed here, not in AppHeader — see the file note. */
function BookBand({ book, title, subtitle, progress, deep = false }: {
  book: Book; title: string; subtitle?: string; progress?: number; deep?: boolean
}) {
  // Only the 500 version of Ogon needs a dark label; every 900 step is dark
  // enough for paper text, which is the whole point of the deep variant.
  const paper = book.hue === 'ogon' && !deep
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
          <h1 className={`text-heading-sm font-semibold ${paper ? 'text-accent-ogon-fg' : 'text-fg-inverse'}`}>
            {title}
          </h1>
          {subtitle !== undefined && (
            <p className={`text-caption ${paper ? 'text-accent-ogon-fg' : 'text-fg-on-inverse-2'}`}>{subtitle}</p>
          )}
        </div>
        <span />
      </div>
      {progress !== undefined && (
        <div className="px-4 pb-2">
          <ProgressBar value={progress} tone={paper ? "default" : "inverse"} />
        </div>
      )}
    </header>
  )
}


/**
 * Candidate feedback palettes — the decision this state exists for.
 *
 * The author kept the five book identities at their 500 step and asked for the
 * FEEDBACK colours to move instead, because Rokushō already means "correct" and
 * Akane already means "wrong" while both are also book chrome.
 *
 * Raw hex on purpose: these are candidates, not tokens. Nothing goes into
 * `src/tokens.css` until one is chosen — putting five speculative ramps in the
 * token source is exactly the sprawl `build-tokens` exists to prevent.
 *
 * Every value below was measured before it was drawn. Two rules decided the
 * shortlist:
 *
 *   - the glyph clears 4.5:1 on both card and page (Kuchiba and Kaki both
 *     failed at their natural value and were darkened until they did);
 *   - the hue sits far enough from all five book colours to be told apart.
 *     **Kaki 柿 persimmon was cut for this** — 55 from Akane in RGB distance,
 *     and Akane is Book Three's chrome. Everything kept is 77 or further.
 */
type Feedback = {
  id: string
  name: string
  note: string
  correct: { bg: string; border: string; glyph: string; fg: string }
  review: { bg: string; border: string; glyph: string; fg: string }
}

const FEEDBACKS: Feedback[] = [
  {
    id: 'fuji-kuchiba',
    name: 'Fuji 藤 + Kuchiba 朽葉',
    note: 'Wisteria and decayed-leaf. Both traditional, both well clear of the five.',
    correct: { bg: '#EDE7F4', border: '#C4B3DC', glyph: '#7B5EA7', fg: '#3F2B5B' },
    review:  { bg: '#F2EADB', border: '#D9C49A', glyph: '#7A5F2C', fg: '#4A3A1C' },
  },
  {
    id: 'kikyo-kuchiba',
    name: 'Kikyō 桔梗 + Kuchiba 朽葉',
    note: 'Bellflower is deeper and cooler than wisteria — more separation from the warm ground.',
    correct: { bg: '#E8E6F2', border: '#B3AED2', glyph: '#5F4E9B', fg: '#332A55' },
    review:  { bg: '#F2EADB', border: '#D9C49A', glyph: '#7A5F2C', fg: '#4A3A1C' },
  },
  {
    id: 'fuji-quiet',
    name: 'Fuji 藤 + quiet ink',
    note: 'One new hue, not two. “Worth another look” is the product’s own wording — gentle, not a verdict — so it goes quiet instead of taking a colour of its own.',
    correct: { bg: '#EDE7F4', border: '#C4B3DC', glyph: '#7B5EA7', fg: '#3F2B5B' },
    review:  { bg: '#EFEDE5', border: '#CFC9B9', glyph: '#6B665E', fg: '#403D38' },
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
function Checkpoint({ book, chrome, fb }: {
  book: Book; chrome: 'book' | 'neutral'; fb?: Feedback
}) {
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
                    i === 0 && fb === undefined
                      ? 'border-success-border bg-success-bg text-success-fg font-semibold'
                      : 'border-border bg-surface text-fg active:bg-surface-2',
                    i === 0 && fb !== undefined ? 'font-semibold' : '',
                  ].join(' ')}
                  style={i === 0 && fb !== undefined
                    ? { background: fb.correct.bg, borderColor: fb.correct.border, color: fb.correct.fg }
                    : undefined}
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

          {fb !== undefined && (
            <div className="flex flex-col gap-2">
              {([['correct', 'Correct'], ['review', 'Worth another look']] as const).map(([k, label]) => {
                const c = fb[k]
                return (
                  <div key={k} className="rounded-lg border p-3 text-center text-body font-semibold"
                    style={{ background: c.bg, borderColor: c.border, color: c.fg }}>
                    <span aria-hidden="true" className="mr-2" style={{ color: c.glyph }}>
                      {k === 'correct' ? '○' : '✕'}
                    </span>
                    {label}
                  </div>
                )
              })}
            </div>
          )}
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
  { id: 'feedback', label: '✅ New feedback colours', note: 'move the verdict off the brand set' },
] as const

type StateId = (typeof STATES)[number]['id']

/**
 * One phone, scaled down so five fit on a laptop at once.
 *
 * The comparison is the whole point of this surface, and it does not survive
 * horizontal scrolling — you cannot judge five identities against each other
 * two at a time. `zoom` rather than `transform: scale` so the row still takes
 * its reduced width in layout instead of overlapping.
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
    identities: 'A lesson page in each book. Same content, same components, same layout — the only thing that changes is the chrome hue, the crest and its density.',
    collision: 'Rokushō means “correct” and Akane means “wrong”. On a checkpoint they are the chrome AND the verdict. Watch the ○ against Book One’s band, and the ✕ against Book Three’s.',
    resolved: 'The book hue steps back when the page starts judging. Sumi band, warm stone, and the book is carried by its crest and type instead — so correctness colour is the only colour with a job on the screen. Note what this costs: all five look the same.',
    feedback: 'The five identities stay as they are. The VERDICT moves off the brand set instead, so ○ and ✕ mean one thing only. Each pairing is shown on Book One (whose Rokushō is today’s “correct”) and Book Three (whose Akane is today’s “wrong”) — the two books where the old collision was worst.',
    deep: 'The 500 steps are accent values for light grounds and cannot carry white text — six of ten band labels failed WCAG, Book Four’s subtitle at 1.02:1. At the 900 step every hue clears it, and the band stays One Dark Slab as DESIGN.md requires: a dark slab with a hue, rather than a coloured one.',
  }[state]

  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg font-semibold text-fg-heading">
          Book identity — the two open decisions
        </h1>
        <p className="max-w-prose text-body text-fg-subtle">
          Rendered rather than described. Crests 3–5 are not drawn yet, so books three to five
          borrow one — the question on this page is the <strong>hue</strong>.
        </p>
      </header>

      <Rail current={state} onSelect={setState} />
      <p className="max-w-prose text-body text-fg">{note}</p>

      {state === 'feedback' ? (
        <div className="flex flex-col gap-8">
          {FEEDBACKS.map((fb) => (
            <section key={fb.id} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-heading-sm font-semibold text-fg-heading">{fb.name}</h2>
                <p className="max-w-prose text-body-sm text-fg-muted">{fb.note}</p>
              </div>
              <div className="flex items-start gap-5">
                {[BOOKS[0], BOOKS[2]].map((b) => (
                  <Slot key={b.id} label={`${b.title} · ${b.hueName}`} sub="book chrome kept">
                    <Phone><Checkpoint book={b} chrome="book" fb={fb} /></Phone>
                  </Slot>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-5">
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
