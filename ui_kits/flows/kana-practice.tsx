/**
 * Kana practice — Phase 4 flow mockup.
 *
 * Mirrors `../aburungo/src/pages/KanaPage.tsx` and `KanaPracticePage.tsx`:
 * the reference chart, the multiple-choice drill, kana keyboard entry, and the
 * result — plus loading / empty / error.
 *
 * This is the flow that puts the Rokushō keyboard slab on a screen for the
 * first time. `KanaKeyboard` was painted `bg-keyboard-bg` (Rokushō 700) so a
 * screen would not carry two near-black fields — the Sumi-iro header band being
 * the other. Until now the two had never been rendered together.
 *
 * It is also where the maru earns its §3.0 boundary: ○ / ✕ ride the choice
 * tiles, per-answer and transient, and never accumulate onto a profile.
 */
import { useState } from 'react'
import {
  AppHeader,
  AudioButton,
  Button,
  EmptyState,
  ErrorState,
  KanaGrid,
  KanaKeyboard,
  LoadingPlaceholder,
  Maru,
  ScoreCard,
} from '../../src/components'
import type { AnswerOutcome, KanaCell, KanaScript, KanaSection } from '../../src/components'
import { HIRAGANA_BASIC, KATAKANA_BASIC, KANA_PRACTICE_CARDS } from '../../src/lib'
import { FlowPage, Phone, Screen, SessionProgress, fromUrl } from './shell'
import type { FlowState } from './shell'

// ─── Content ───────────────────────────────────────────────────────────────

/** kana → romaji, from the shipped practice deck. The chart needs both. */
const ROMAJI = new Map(KANA_PRACTICE_CARDS.map((c) => [c.kana, c.romaji]))

function toCells(rows: readonly (readonly (string | null)[])[]): (KanaCell | null)[][] {
  return rows.map((row) =>
    row.map((kana) =>
      kana === null ? null : { kana, romaji: ROMAJI.get(kana) ?? '' },
    ),
  )
}

const CHART = { hiragana: toCells(HIRAGANA_BASIC), katakana: toCells(KATAKANA_BASIC) }

/** Stand-in for real review history — enough kana to show the ring in a row. */
const LEARNED = new Set([
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す',
  'た', 'ち',
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク',
])

/** The drill queue. Four cards keeps a full round short enough to click through. */
const DECK = [
  { kana: 'ね', romaji: 'ne', choices: ['ne', 'nu', 'wa', 're'] },
  { kana: 'ぬ', romaji: 'nu', choices: ['me', 'nu', 'ru', 'no'] },
  { kana: 'さ', romaji: 'sa', choices: ['chi', 'ki', 'sa', 'so'] },
  { kana: 'ゆ', romaji: 'yu', choices: ['yo', 'ya', 'wa', 'yu'] },
]

// ─── The reference chart (KanaPage) ────────────────────────────────────────

function ChartScreen({ onPractise }: { onPractise: () => void }) {
  const [script, setScript] = useState<KanaScript>('hiragana')
  const [audio, setAudio] = useState<'idle' | 'loading' | 'playing'>('idle')
  const [heard, setHeard] = useState<string | null>(null)

  const rows = CHART[script]
  const learnedInScript = [...LEARNED].filter((k) =>
    rows.some((row) => row.some((c) => c?.kana === k)),
  ).length
  const total = rows.flat().filter((c) => c !== null).length

  function play(kana: string) {
    setHeard(kana)
    setAudio('playing')
    window.setTimeout(() => setAudio('idle'), 900)
  }

  return (
    <>
      <AppHeader title="Kana" subtitle={`${learnedInScript} of ${total} settled`} />
      <SessionProgress value={learnedInScript / total} />
      <Screen>
        <div className="flex items-center justify-between gap-3">
          {/* Script toggle. Kept on the page ground rather than in the header —
              the band is chrome, and this changes what the page is about. */}
          <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
            {(['hiragana', 'katakana'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScript(s)}
                aria-pressed={script === s}
                className={[
                  'min-h-[44px] rounded-lg px-4 text-body-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                  script === s
                    ? 'bg-action text-action-fg'
                    : 'text-fg-subtle active:bg-surface-2',
                ].join(' ')}
              >
                {s === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </button>
            ))}
          </div>
          <AudioButton
            state={audio}
            onPress={() => play(heard ?? rows[0][0]?.kana ?? 'あ')}
            label="Replay the last kana"
          />
        </div>

        <div className="flex items-center gap-2 text-body-sm text-fg-subtle">
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded ring-2 ring-inset ring-progress-fill"
          />
          Settled — tap any character to hear it
        </div>

        <KanaGrid
          rows={rows}
          learned={LEARNED}
          onSelect={play}
          renderKey={(cell) => (
            <>
              <span className="leading-none">{cell.kana}</span>
              <span className="font-sans text-caption leading-none text-fg-faint">
                {cell.romaji}
              </span>
            </>
          )}
        />

        <Button fullWidth onClick={onPractise}>
          Practise these
        </Button>
      </Screen>
    </>
  )
}

// ─── The drill (KanaPracticePage, multiple choice) ─────────────────────────

/**
 * A choice tile. §3.0 puts the maru here rather than in `AnswerResult`: this is
 * the learner reading a judgment on their own tap, one tile at a time, and the
 * glyph carries it without a sentence of verdict prose.
 *
 * Three channels, per the mark gate — glyph, colour, and the romaji itself
 * staying legible. `Maru` supplies the screen-reader label.
 */
function ChoiceTile({
  choice,
  outcome,
  onPick,
}: {
  choice: string
  outcome: AnswerOutcome | null
  onPick: () => void
}) {
  const state =
    outcome === 'recalled'
      ? 'border-success-border bg-success-bg text-success-fg'
      : outcome === 'review'
        ? 'border-error-border bg-error-bg text-error-fg'
        : 'border-border bg-surface text-fg active:bg-surface-2'

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={outcome !== null}
      className={[
        'flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 px-3',
        'text-body-lg font-medium transition-colors disabled:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        state,
      ].join(' ')}
    >
      {outcome !== null && <Maru outcome={outcome} className="text-heading-sm" />}
      {choice}
    </button>
  )
}

function DrillScreen({
  onFinish,
  answeredFirst,
}: {
  onFinish: (marks: AnswerOutcome[]) => void
  answeredFirst: boolean
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(answeredFirst ? 'nu' : null)
  const [marks, setMarks] = useState<AnswerOutcome[]>([])
  const [audio, setAudio] = useState<'idle' | 'loading' | 'playing'>('idle')

  const card = DECK[index]

  function pick(choice: string) {
    if (picked !== null) return
    setPicked(choice)
    setMarks([...marks, choice === card.romaji ? 'recalled' : 'review'])
  }

  function next() {
    if (index + 1 < DECK.length) {
      setIndex(index + 1)
      setPicked(null)
    } else {
      onFinish(marks)
    }
  }

  /** null until answered; then ○ on the right one and ✕ on the wrong pick. */
  function outcomeFor(choice: string): AnswerOutcome | null {
    if (picked === null) return null
    if (choice === card.romaji) return 'recalled'
    if (choice === picked) return 'review'
    return null
  }

  function play() {
    setAudio('playing')
    window.setTimeout(() => setAudio('idle'), 900)
  }

  return (
    <>
      <AppHeader title="Kana practice" subtitle={`${index + 1} of ${DECK.length}`} />
      <SessionProgress value={index / DECK.length} />
      <Screen>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <p className="text-body-sm text-fg-subtle">Which sound is this?</p>
          <p lang="ja" className="font-jp text-jp-display-lg text-fg-heading">
            {card.kana}
          </p>
          <AudioButton state={audio} onPress={play} label="Hear this kana" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {card.choices.map((choice) => (
            <ChoiceTile
              key={choice}
              choice={choice}
              outcome={outcomeFor(choice)}
              onPick={() => pick(choice)}
            />
          ))}
        </div>

        {picked !== null && (
          <Button fullWidth onClick={next}>
            {index + 1 < DECK.length ? 'Next' : 'See the round'}
          </Button>
        )}
      </Screen>
    </>
  )
}

// ─── Keyboard entry (KanaPracticePage, type-the-kana) ──────────────────────

function KeyboardScreen({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState('')
  const [script, setScript] = useState<KanaScript>('hiragana')
  const [section, setSection] = useState<KanaSection>('basic')

  return (
    <>
      <AppHeader title="Kana practice" subtitle="write it · 2 of 4" />
      <SessionProgress value={0.25} />

      {/* Not <Screen>. The keyboard docks to the bottom like a real IME and the
          prompt collapses to a single line above it, because the gojūon grid
          takes 596px of a 780px phone — ten rows at the 44px touch floor, plus
          toggles and the utility row. There is no layout where it coexists with
          a card. See the flow findings: this belongs in the component. */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col gap-2 px-3 pt-3">
          <p className="text-center text-body-sm text-fg-subtle">
            Write the kana for <span className="font-semibold text-fg">nu</span>
          </p>
          <div className="flex items-stretch gap-2">
            {/* Ai-iro type on warm paper, so what the learner has written reads
                as content rather than as chrome. */}
            <div
              lang="ja"
              className="flex min-h-[48px] flex-1 items-center rounded-xl border-2 border-border-strong bg-surface px-4 font-jp text-jp-lg text-fg-heading"
            >
              {value !== '' ? (
                value
              ) : (
                <span className="font-sans text-body text-fg-faint">Tap the keys below</span>
              )}
            </div>
            <Button size="sm" disabled={value === ''} onClick={onDone}>
              Check
            </Button>
          </div>
        </div>

        <div className="mt-auto p-2">
          <KanaKeyboard
            script={script}
            section={section}
            onScriptChange={setScript}
            onSectionChange={setSection}
            onKey={(k) => setValue(value + k)}
            onBackspace={() => setValue([...value].slice(0, -1).join(''))}
          />
        </div>
      </div>
    </>
  )
}

// ─── Result ────────────────────────────────────────────────────────────────

function ResultScreen({ marks, onAgain }: { marks: AnswerOutcome[]; onAgain: () => void }) {
  const recalled = marks.filter((m) => m === 'recalled').length

  return (
    <>
      <AppHeader title="Round complete" subtitle={`${DECK.length} kana`} />
      <SessionProgress value={1} />
      <Screen>
        <ScoreCard correct={recalled} total={DECK.length}>
          <ul className="flex flex-col gap-2">
            {marks.map((outcome, i) => (
              <li
                key={DECK[i].kana}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <Maru outcome={outcome} className="w-5 shrink-0 text-heading-sm" />
                <span lang="ja" className="font-jp text-jp-lg text-fg-heading">
                  {DECK[i].kana}
                </span>
                <span className="ml-auto text-body-sm text-fg-subtle">{DECK[i].romaji}</span>
              </li>
            ))}
          </ul>
        </ScoreCard>
        <Button fullWidth onClick={onAgain}>
          Back to the chart
        </Button>
      </Screen>
    </>
  )
}

// ─── Host ──────────────────────────────────────────────────────────────────

type StateId = 'chart' | 'drill' | 'answered' | 'keyboard' | 'result' | 'loading' | 'empty' | 'error'

const STATES: readonly FlowState<StateId>[] = [
  { id: 'chart', label: 'Chart', note: 'reference grid, settled kana ringed' },
  { id: 'drill', label: 'Drill', note: 'multiple choice, unanswered' },
  { id: 'answered', label: 'Answered', note: '○ / ✕ on the tiles' },
  { id: 'keyboard', label: 'Keyboard', note: 'the Rokushō slab, under the Sumi-iro band' },
  { id: 'result', label: 'Result', note: 'round summary with the mark row' },
  { id: 'loading', label: 'Loading', note: 'deck being built' },
  { id: 'empty', label: 'Empty', note: 'every kana settled' },
  { id: 'error', label: 'Error', note: 'load failed' },
]

const SAMPLE_MARKS: AnswerOutcome[] = ['recalled', 'review', 'recalled', 'recalled']

export function KanaPractice() {
  const [state, setState] = useState<StateId>(
    fromUrl('state', STATES.map((s) => s.id), 'chart'),
  )
  const [marks, setMarks] = useState<AnswerOutcome[]>(SAMPLE_MARKS)
  const [nonce, setNonce] = useState(0)

  function go(next: StateId) {
    setState(next)
    setNonce(nonce + 1)
  }

  function finish(result: AnswerOutcome[]) {
    setMarks(result.length > 0 ? result : SAMPLE_MARKS)
    go('result')
  }

  return (
    <FlowPage
      title="Kana practice"
      blurb="The reference chart, the drill, keyboard entry, and the result. This is the first screen where the Rokushō keyboard and the Sumi-iro header band appear together — the reason the keyboard is not a second dark slab."
      states={STATES}
      current={state}
      onSelect={go}
    >
      <Phone key={nonce}>
        {state === 'chart' && <ChartScreen onPractise={() => go('drill')} />}
        {(state === 'drill' || state === 'answered') && (
          <DrillScreen answeredFirst={state === 'answered'} onFinish={finish} />
        )}
        {state === 'keyboard' && <KeyboardScreen onDone={() => go('result')} />}
        {state === 'result' && <ResultScreen marks={marks} onAgain={() => go('chart')} />}
        {state === 'loading' && (
          <>
            <AppHeader title="Kana practice" subtitle="Loading" />
            <Screen>
              <LoadingPlaceholder label="Building your deck…" />
            </Screen>
          </>
        )}
        {state === 'empty' && (
          <>
            <AppHeader title="Kana practice" />
            <Screen>
              <div className="flex flex-col items-center gap-6 pt-10">
                <span className="hanko text-display-lg" aria-hidden="true" />
                <EmptyState
                  message="Every kana is settled"
                  description="Nothing is due for review. The chart is always there if you want to run through it."
                  action={
                    <Button variant="secondary" onClick={() => go('chart')}>
                      Open the chart
                    </Button>
                  }
                />
              </div>
            </Screen>
          </>
        )}
        {state === 'error' && (
          <>
            <AppHeader title="Kana practice" />
            <Screen>
              <ErrorState
                message="Couldn't load the deck"
                description="Nothing was lost. This is usually the connection."
                action={<Button onClick={() => go('drill')}>Try again</Button>}
              />
            </Screen>
          </>
        )}
      </Phone>
    </FlowPage>
  )
}
