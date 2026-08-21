/**
 * Book One — the four surfaces the plan's §5 asks for that were not built yet.
 *
 * The fifth, the chapter checkpoint, already ships as `checkpoint.tsx` for
 * every book. This adds the chapter opener, two lesson pages and the final
 * checkpoint, for Book One only. Book One first because it is the one with
 * real content — the author's call, and it means none of the copy here is
 * invented.
 *
 * **Everything on this page is from `../aburungo/src/content/`.** The chapter
 * titles are `chapters/n5.yaml`; the lesson titles and can-do lines are the
 * `title` and `canDo` fields of the units with `chapterId: n5.chapter-1` and
 * `n5.chapter-11`. Chapter One really does run thirteen lessons across two
 * situations and close on an integration lesson. Mock copy would have hidden
 * that a chapter opener has to hold a list that long.
 *
 * **The Two-Plane Rule is what these pages exist to prove.** The chrome — band,
 * crest, rule — is the BOOK. The accent inside a card is the SITUATION, and it
 * changes within a single chapter: Chapter One is Rokushō chrome throughout
 * while its cards run Ai-iro for greetings and Ōgon for food and drink. If a
 * lesson page ever tints its card to match its band, the two planes have
 * collapsed and the situation accent has stopped meaning anything.
 */
import { useState } from 'react'
import { Badge, Button, Maru, PhraseCard, ProgressBar, TextInput } from '../../src/components'
import type { PhraseAccent } from '../../src/components'
import { BOOKS, BookBand } from './book-lab'
import { Screen } from './shell'
import type { FlowDef, FlowState } from './shell'

const BOOK = BOOKS[0]

// ─── Content — ../aburungo/src/content/chapters/n5.yaml + lessons/*.yaml ────

type Lesson = { n: number; title: string; canDo: string; situation: string; done: boolean }

/** Chapter One, all thirteen units, in order. */
const CHAPTER_ONE: Lesson[] = [
  { n: 1, title: 'Yes, no, and this/that', canDo: 'Greet someone', situation: 'Greetings & basics', done: true },
  { n: 2, title: 'Hello & goodbye', canDo: 'Greet someone', situation: 'Greetings & basics', done: true },
  { n: 3, title: 'Nice to meet you', canDo: 'Introduce yourself', situation: 'Greetings & basics', done: true },
  { n: 4, title: 'Where are you from?', canDo: 'Introduce yourself', situation: 'Greetings & basics', done: true },
  { n: 5, title: "Thank you & you're welcome", canDo: 'Thank someone', situation: 'Greetings & basics', done: false },
  { n: 6, title: "I don't understand", canDo: "Say you don't understand", situation: 'Greetings & basics', done: false },
  { n: 7, title: 'Numbers 1-10', canDo: 'Count and state simple quantities', situation: 'Greetings & basics', done: false },
  { n: 8, title: 'At the café', canDo: 'Order a drink', situation: 'Food & drink', done: false },
  { n: 9, title: 'At the restaurant', canDo: 'Order a meal', situation: 'Food & drink', done: false },
  { n: 10, title: 'What is this?', canDo: 'Ask what something is on a menu', situation: 'Food & drink', done: false },
  { n: 11, title: 'How much & paying', canDo: 'Ask for the bill', situation: 'Food & drink', done: false },
  { n: 12, title: 'Bigger numbers', canDo: 'Say prices in yen', situation: 'Food & drink', done: false },
  { n: 13, title: 'Getting by', canDo: 'Recognise the vocabulary from greetings and eating out', situation: 'Integration & checkpoint', done: false },
]

/**
 * The situation accent, not the book accent.
 *
 * Two situations inside one chapter, two accents, one Rokushō band over the
 * top. This map is the Two-Plane Rule in the only form that can be checked:
 * nothing here returns the book's own hue.
 */
const SITUATION_ACCENT: Record<string, PhraseAccent> = {
  'Greetings & basics': 'ai',
  'Food & drink': 'ogon',
  'Integration & checkpoint': 'ai',
  'Meals and the kitchen': 'ogon',
}

type Phrase = {
  japanese: string
  reading: string
  romaji: string
  english: string
  notes?: string
}

/** n5.unit-3 — "Nice to meet you", the early lesson. */
const EARLY: Phrase[] = [
  {
    japanese: 'はじめまして',
    reading: 'はじめまして',
    romaji: 'hajimemashite',
    english: 'Nice to meet you.',
    notes: 'Said once, at the very start of a first meeting — never again to the same person.',
  },
  {
    japanese: 'よろしくお願いします',
    reading: 'よろしくおねがいします',
    romaji: 'yoroshiku onegai shimasu',
    english: 'Please treat me well.',
  },
]

/** n5.unit-91 — "In the kitchen", chapter eleven. Same rules, later material. */
const LATE: Phrase[] = [
  {
    japanese: 'お箸をください',
    reading: 'おはしをください',
    romaji: 'ohashi o kudasai',
    english: 'Chopsticks, please.',
    notes: 'The same ～をください you learned in chapter one, with a word you did not have then.',
  },
  {
    japanese: 'コップはどこですか',
    reading: 'コップはどこですか',
    romaji: 'koppu wa doko desu ka',
    english: 'Where are the glasses?',
  },
]

// ─── Chapter opener ────────────────────────────────────────────────────────

/**
 * The book's thesis, and the one surface that runs the crest full-bleed.
 *
 * `--emboss-opacity: .5` rather than the .35 default: this page carries no
 * body copy, only headings and a list of link-sized rows, so the legibility
 * rule that caps the pattern is not binding here. It is the only place in the
 * product where the ground is meant to be the loudest thing on screen —
 * everywhere else the crest sits under working text and has to stay quiet.
 *
 * `.kata-vert` and `.wm` earn their keep here, per §5. They are brand
 * furniture: right on a title page, wrong on a page where someone is trying to
 * answer a question.
 */
function ChapterOpener({ onStart }: { onStart: () => void }) {
  const done = CHAPTER_ONE.filter((l) => l.done).length
  const situations = [...new Set(CHAPTER_ONE.map((l) => l.situation))]

  return (
    <>
      <BookBand book={BOOK} title="Book One" subtitle="Chapter 1 of 11" />
      <Screen>
        <div
          className={`emboss-bg ${BOOK.crest} ${BOOK.tile} -mx-4 -mt-5 flex flex-1 flex-col gap-5 px-4 py-6`}
          style={{ '--emboss-opacity': '.5' } as React.CSSProperties}
        >
          <div className="flex items-start gap-4">
            {/* Vertical katakana down the side — the C lockup's sidebar, and
                the only surface in the product tall enough to carry it. */}
            <span className="kata-vert brand text-heading-sm" aria-hidden="true">
              アブルンゴ
            </span>

            <div className="glass rule-rokusho flex flex-1 flex-col gap-3">
              <span className="text-caption font-bold uppercase tracking-wider text-fg-muted">
                Chapter One
              </span>
              <h2 className="text-heading-lg font-semibold text-fg-heading">
                Greetings &amp; ordering
              </h2>
              <p className="text-body text-fg">
                Enough to walk in, be greeted, and order something — the two things
                that happen before anything else does.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {situations.map((s) => (
                  <Badge key={s} emphasis>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="glass flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-caption font-bold uppercase tracking-wider text-fg-muted">
                {done} of {CHAPTER_ONE.length} lessons
              </span>
              <span className="text-caption text-fg-subtle">ends in a checkpoint</span>
            </div>
            <ProgressBar value={done / CHAPTER_ONE.length} />
          </div>

          <Button fullWidth onClick={onStart}>
            Continue chapter 1
          </Button>

          {/* The wordmark closes the page rather than opening it — the chapter
              is the subject here, the product is the footer. */}
          <div className="flex justify-center pt-2">
            <span className="wm xs" aria-hidden="true">
              aburungo<span className="maru" />
            </span>
          </div>
        </div>
      </Screen>
    </>
  )
}

// ─── Lesson page ───────────────────────────────────────────────────────────

/**
 * The everyday page, rendered twice — chapter one and chapter eleven.
 *
 * Everything that changes between the two is a prop: the phrases, the can-do
 * line, the progress, and the crest density. The band, the layout and the
 * component set are identical, which is the "similar but not identical" test
 * §5 asks for. Nothing here is a second copy of the early page with edits.
 */
function LessonPage({
  chapter,
  unit,
  lesson,
  phrases,
  progress,
  tile,
}: {
  chapter: number
  unit: number
  lesson: Lesson
  phrases: Phrase[]
  progress: number
  tile: string
}) {
  const [revealed, setRevealed] = useState(false)
  const accent = SITUATION_ACCENT[lesson.situation] ?? 'ai'

  return (
    <>
      <BookBand
        book={BOOK}
        title={lesson.title}
        subtitle={`Chapter ${chapter} · lesson ${unit}`}
        progress={progress}
      />
      <Screen>
        <div className={`emboss-bg ${BOOK.crest} ${tile} -mx-4 -mt-5 flex flex-1 flex-col gap-4 px-4 py-5`}>
          {/* The can-do line, which is the lesson's actual promise —
              `canDo` in the content, and DR-022's source for the can-do list. */}
          <div className="glass flex flex-col gap-1">
            <span className="text-caption font-bold uppercase tracking-wider text-fg-muted">
              By the end
            </span>
            <p className="text-body font-semibold text-fg-heading">{lesson.canDo}</p>
          </div>

          {phrases.map((p, i) => (
            <PhraseCard
              key={p.japanese}
              japanese={p.japanese}
              reading={p.reading}
              english={revealed ? p.english : undefined}
              notes={revealed ? p.notes : undefined}
              scenario={lesson.situation}
              accent={accent}
              footer={
                i === 0 && !revealed ? (
                  <Button fullWidth onClick={() => setRevealed(true)}>
                    Show answer
                  </Button>
                ) : undefined
              }
            />
          ))}

          {revealed && (
            <Button variant="secondary" fullWidth onClick={() => setRevealed(false)}>
              Hide again
            </Button>
          )}
        </div>
      </Screen>
    </>
  )
}

// ─── Final checkpoint ──────────────────────────────────────────────────────

const FINAL_ITEMS = [
  { english: 'Nice to meet you.', answer: 'はじめまして', romaji: 'hajimemashite' },
  { english: 'The check, please.', answer: 'お会計お願いします', romaji: 'okaikei onegai shimasu' },
  { english: 'Chopsticks, please.', answer: 'お箸をください', romaji: 'ohashi o kudasai' },
]

/**
 * The gate that closes the BOOK, not a chapter.
 *
 * Two things make it a different kind rather than a harder recognition round,
 * per §5:
 *
 *   1. **It is production.** English in, Japanese out, typed. There is no
 *      line-up to pick from, which is a different skill and the reason this is
 *      its own checkpoint kind (`"production"` in the app's four kinds).
 *   2. **It reviews the whole book,** so its items come from chapters one and
 *      eleven at once — the two lesson pages above, meeting again.
 *
 * It has to read heavier than a chapter checkpoint while staying obviously the
 * same book. The weight comes from the **deep band** — Rokushō 900 rather than
 * the 500 — and from the crest running at `tile-lg`. Neither is a new colour
 * and neither is a new component: it is the same identity, turned up. A
 * chapter checkpoint arrives eleven times in this book and this arrives once.
 *
 * Still a gate, not a grade: the only number is how many are left, per DR-020.
 */
function FinalCheckpoint() {
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)

  const item = FINAL_ITEMS[index]
  const correct = checked && value.trim() === item.answer
  const left = FINAL_ITEMS.length - index

  return (
    <>
      <BookBand book={BOOK} title="Book One" subtitle="final checkpoint" deep />
      <Screen>
        <div className={`emboss-bg ${BOOK.crest} tile-lg -mx-4 -mt-5 flex flex-1 flex-col gap-4 px-4 py-5`}>
          <div className="glass flex flex-col gap-1">
            <span className="text-caption font-bold uppercase tracking-wider text-fg-muted">
              {left} left
            </span>
            <p className="text-body-sm text-fg-muted">
              Everything in the book, written out rather than picked. Misses come back later.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-caption font-bold uppercase tracking-wider text-fg-muted">
              Write this in Japanese
            </p>
            <p className="mt-2 text-heading-sm font-semibold text-fg-heading">{item.english}</p>

            <div className="mt-4">
              <TextInput
                label="Your answer"
                lang="ja"
                value={value}
                hint={checked ? undefined : 'Kana or kanji — both count.'}
                error={checked && !correct ? `Not quite. ${item.answer} — ${item.romaji}` : undefined}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            {checked && correct && (
              <p className="mt-3 flex items-center gap-2 text-body font-semibold text-success-fg">
                <Maru outcome="correct" /> {item.answer}
              </p>
            )}

            <div className="mt-4">
              {!checked ? (
                <Button fullWidth disabled={value.trim() === ''} onClick={() => setChecked(true)}>
                  Check
                </Button>
              ) : (
                <Button
                  fullWidth
                  onClick={() => {
                    setChecked(false)
                    setValue('')
                    setIndex((i) => (i + 1) % FINAL_ITEMS.length)
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </Screen>
    </>
  )
}

// ─── The flow ──────────────────────────────────────────────────────────────

type StateId = 'opener' | 'lesson-early' | 'lesson-late' | 'final'

const STATES: readonly FlowState<StateId>[] = [
  { id: 'opener', label: 'Chapter opener', note: 'the book thesis; crest full-bleed, kata-vert, wordmark' },
  { id: 'lesson-early', label: 'Lesson · ch 1', note: 'unit 3, greetings — Ai-iro card on a Rokushō band' },
  { id: 'lesson-late', label: 'Lesson · ch 11', note: 'unit 91, the kitchen — same rules, Ōgon card, denser crest' },
  { id: 'final', label: 'Final checkpoint', note: 'production gate; deep band, tile-lg, closes the book' },
]

export const bookOneFlow: FlowDef<StateId> = {
  id: 'book-one',
  label: 'Book One',
  title: 'Book One — the surfaces',
  blurb:
    'Four of the five surfaces §5 asks for, in the book that has real content. Every chapter title, lesson title and can-do line is from ../aburungo/src/content. The fifth, the chapter checkpoint, is its own flow and covers all books. Watch the two planes: the chrome is Rokushō on every screen, and the card accent changes with the situation, twice inside one chapter.',
  states: STATES,
  initial: 'opener',
  Screens({ state, go }) {
    return (
      <>
        {state === 'opener' && <ChapterOpener onStart={() => go('lesson-early')} />}
        {state === 'lesson-early' && (
          <LessonPage
            chapter={1}
            unit={3}
            lesson={CHAPTER_ONE[2]}
            phrases={EARLY}
            progress={3 / 13}
            tile="tile-sm"
          />
        )}
        {state === 'lesson-late' && (
          <LessonPage
            chapter={11}
            unit={91}
            lesson={{
              n: 91,
              title: 'In the kitchen',
              canDo: 'Name what is on the table and ask for a glass or chopsticks',
              situation: 'Meals and the kitchen',
              done: false,
            }}
            phrases={LATE}
            progress={0.94}
            tile="tile-md"
          />
        )}
        {state === 'final' && <FinalCheckpoint />}
      </>
    )
  },
}
