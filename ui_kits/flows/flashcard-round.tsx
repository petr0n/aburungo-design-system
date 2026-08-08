/**
 * Flashcard round — Phase 4 flow mockup.
 *
 * Mirrors `../aburungo/src/pages/FlashcardPage.tsx`: prompt → reveal →
 * self-grade → round summary, plus the loading / empty / error states.
 *
 * This file imports the REAL components from `src/components/`. It is not a
 * mirror and cannot drift from them — that was the whole problem with
 * `ui_kits/mobile/screens.jsx`, which still renders a bare-<h1> AppHeader and
 * the v2 palette. Add a component, rebuild, and it shows up here.
 *
 * No routing, no state management, no data layer — `CLAUDE.md`'s boundary.
 * `useState` in one file is the mockup, not an app.
 */
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AnswerResult,
  AppHeader,
  AudioButton,
  Button,
  EmptyState,
  ErrorState,
  FlipCard,
  LoadingPlaceholder,
  Maru,
  PhraseCard,
  ProgressBar,
  ScoreCard,
} from '../../src/components'
import type { AnswerOutcome, PhraseAccent } from '../../src/components'

// ─── Content — real phrases, from src/content/phrases/*.yaml ────────────────

type Phrase = {
  japanese: string
  reading: string
  romaji: string
  english: string
  scenario: string
  accent: PhraseAccent
  notes?: string
}

const PHRASES: Phrase[] = [
  {
    japanese: '駅はどこですか',
    reading: 'えきはどこですか',
    romaji: 'eki wa doko desu ka',
    english: 'Where is the station?',
    scenario: 'transit',
    accent: 'ai',
    notes: 'Works at info desks, on the street, at hotel front desks.',
  },
  {
    japanese: 'これをください',
    reading: 'これをください',
    romaji: 'kore o kudasai',
    english: "I'll have this.",
    scenario: 'restaurant',
    accent: 'ogon',
    notes: "The most useful phrase in any Japanese restaurant — it works even when you can't read the menu.",
  },
  {
    japanese: '次の電車は何時ですか',
    reading: 'つぎのでんしゃはなんじですか',
    romaji: 'tsugi no densha wa nanji desu ka',
    english: 'What time is the next train?',
    scenario: 'transit',
    accent: 'ai',
  },
  {
    japanese: 'お会計お願いします',
    reading: 'おかいけいおねがいします',
    romaji: 'okaikei onegai shimasu',
    english: 'The check, please.',
    scenario: 'restaurant',
    accent: 'ogon',
  },
]

// ─── Phone shell ───────────────────────────────────────────────────────────

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="w-[390px] shrink-0 overflow-hidden rounded-[2.25rem] border-8 border-inverse bg-bg shadow-card">
      <div className="flex h-[780px] flex-col">{children}</div>
    </div>
  )
}

/**
 * ProgressBar flush under the header put a Rokushō fill directly against the
 * band's Ōgon hairline — the two read as one two-tone rule rather than a rule
 * and a progress bar. The gap is the fix; noted as an AppHeader adjacency
 * finding rather than a component change made from one screen.
 */
function SessionProgress({ value }: { value: number }) {
  return (
    <div className="px-4 pt-4">
      <ProgressBar value={value} />
    </div>
  )
}

/** Everything below the header band: the page ground, scrolling. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-8 pt-5">{children}</div>
  )
}

// ─── The round ─────────────────────────────────────────────────────────────

type Step = 'prompt' | 'reveal' | 'summary'

/**
 * The two self-grade buttons. `Maru` supplies the glyph and the screen-reader
 * label, the button text supplies the third channel — glyph + colour + words,
 * never the glyph alone.
 */
function GradeRow({ onGrade }: { onGrade: (outcome: AnswerOutcome) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" fullWidth onClick={() => onGrade('recalled')}>
        <Maru outcome="recalled" className="text-heading-sm" />
        Recalled
      </Button>
      {/* `secondary` is Rokushō-tinted — the correctness colour. A ✕ on that
          field says two things at once, so the review button is repainted to
          the error role here. Logged: the pair needs an outcome-aware Button
          variant, not a call-site override. */}
      <Button
        variant="secondary"
        fullWidth
        onClick={() => onGrade('review')}
        className="border-error-border bg-error-bg text-error-fg active:bg-akane-200"
      >
        <Maru outcome="review" className="text-heading-sm" />
        Worth another look
      </Button>
    </div>
  )
}

function Round({ onExhausted, from }: { onExhausted: () => void; from: Step }) {
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState<Step>(from)
  const [marks, setMarks] = useState<AnswerOutcome[]>(
    // A summary linked to directly needs a round behind it.
    from === 'summary' ? ['recalled', 'review', 'recalled', 'recalled'] : [],
  )
  const [audio, setAudio] = useState<'idle' | 'loading' | 'playing'>('idle')

  const phrase = PHRASES[index]
  const done = marks.length
  const recalled = marks.filter((m) => m === 'recalled').length

  function grade(outcome: AnswerOutcome) {
    const next = [...marks, outcome]
    setMarks(next)
    if (index + 1 < PHRASES.length) {
      setIndex(index + 1)
      setStep('prompt')
    } else {
      setStep('summary')
    }
  }

  function playAudio() {
    setAudio('loading')
    window.setTimeout(() => setAudio('playing'), 250)
    window.setTimeout(() => setAudio('idle'), 1400)
  }

  if (step === 'summary') {
    return (
      <>
        <AppHeader title="Round complete" subtitle={`${PHRASES.length} phrases`} />
        <SessionProgress value={1} />
        <Screen>
          <ScoreCard correct={recalled} total={PHRASES.length}>
            {/* The per-answer mark row §3.0 calls for, composed at the call
                site to check the existing `children` slot carries it before
                ScoreCard grows an API for it. */}
            <ul className="flex flex-col gap-2">
              {marks.map((outcome, i) => (
                <li
                  key={PHRASES[i].japanese}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <Maru outcome={outcome} className="w-5 shrink-0 pt-1 text-heading-sm" />
                  <div className="flex min-w-0 flex-col">
                    <span lang="ja" className="font-jp text-jp text-fg-heading">
                      {PHRASES[i].japanese}
                    </span>
                    <span className="text-body-sm text-fg-subtle">
                      {PHRASES[i].english}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </ScoreCard>
          <div className="flex flex-col gap-3">
            <Button fullWidth onClick={onExhausted}>
              Finish
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setMarks([])
                setIndex(0)
                setStep('prompt')
              }}
            >
              Run it again
            </Button>
          </div>
        </Screen>
      </>
    )
  }

  const front = (
    <PhraseCard
      japanese={phrase.japanese}
      reading={phrase.reading}
      scenario={phrase.scenario}
      accent={phrase.accent}
      audioSlot={<AudioButton state={audio} onPress={playAudio} />}
      footer={
        <Button fullWidth onClick={() => setStep('reveal')}>
          Show answer
        </Button>
      }
    />
  )

  const back = (
    <PhraseCard
      japanese={phrase.japanese}
      reading={phrase.reading}
      english={phrase.english}
      notes={phrase.notes}
      scenario={phrase.scenario}
      accent={phrase.accent}
      audioSlot={<AudioButton state={audio} onPress={playAudio} />}
    />
  )

  return (
    <>
      <AppHeader
        title="Flashcards"
        subtitle={`${phrase.scenario} · ${index + 1} of ${PHRASES.length}`}
      />
      <SessionProgress value={done / PHRASES.length} />
      <Screen>
        {/* FlipCard positions the back face absolutely, so it inherits the
            front's height. The back is taller (English + note), so the faces
            are pinned to a common floor here. Logged as a FlipCard finding —
            equal-height faces belong in the component, not every call site. */}
        <div className="[&_article]:min-h-[340px]">
          <FlipCard front={front} back={back} flipped={step === 'reveal'} />
        </div>
        {step === 'reveal' && <GradeRow onGrade={grade} />}
      </Screen>
    </>
  )
}

// ─── The other four states ─────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <>
      <AppHeader title="Flashcards" subtitle="Loading" />
      <SessionProgress value={0} />
      <Screen>
        <LoadingPlaceholder label="Building your round…" />
      </Screen>
    </>
  )
}

function EmptyScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <>
      {/* No ProgressBar — there is no round to be part-way through, and a full
          bar here reads as "you finished" rather than "nothing was due". */}
      <AppHeader title="Flashcards" />
      <Screen>
        <div className="flex flex-col items-center gap-6 pt-10">
          {/* .hanko draws the ア itself, from a mask. It takes no children. */}
          <span className="hanko text-display-lg" aria-hidden="true" />
          <EmptyState
            message="Nothing due right now"
            description="Everything in transit and restaurant is resting. New phrases unlock as these settle."
            action={
              <Button variant="secondary" onClick={onRestart}>
                Practise anyway
              </Button>
            }
          />
        </div>
      </Screen>
    </>
  )
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <AppHeader title="Flashcards" />
      <Screen>
        <ErrorState
          message="Couldn't load this round"
          description="Your progress is saved. This is usually the connection."
          action={<Button onClick={onRetry}>Try again</Button>}
        />
      </Screen>
    </>
  )
}

/**
 * Not part of the flashcard round — the app never grades a flashcard, the
 * learner does. Shown alongside it so the two judgment treatments can be
 * compared on one page: self-grade above, app-checks here.
 */
function CheckedScreen() {
  const [outcome, setOutcome] = useState<AnswerOutcome>('review')
  const phrase = PHRASES[0]

  return (
    <>
      <AppHeader title="Fill in the blank" subtitle="transit · 1 of 4" />
      <SessionProgress value={0.25} />
      <Screen>
        <AnswerResult outcome={outcome} userAnswer="eki wa doku desu ka">
          <p lang="ja" className="font-jp text-jp-lg text-fg-heading">
            {phrase.japanese}
          </p>
          <p lang="ja" className="font-jp text-jp text-action-2-fg">
            {phrase.reading}
          </p>
          <p className="text-body-sm text-fg-subtle">{phrase.romaji}</p>
        </AnswerResult>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setOutcome(outcome === 'review' ? 'recalled' : 'review')}
        >
          Toggle outcome
        </Button>
      </Screen>
    </>
  )
}

// ─── Host ──────────────────────────────────────────────────────────────────

type StateId = 'round' | 'loading' | 'empty' | 'error' | 'checked'

const STATES: { id: StateId; label: string; note: string }[] = [
  { id: 'round', label: 'In progress', note: 'prompt → reveal → self-grade → summary' },
  { id: 'loading', label: 'Loading', note: 'round is being assembled' },
  { id: 'empty', label: 'Empty', note: 'nothing due' },
  { id: 'error', label: 'Error', note: 'load failed, progress intact' },
  { id: 'checked', label: 'App-checked', note: 'AnswerResult, for comparison' },
]

/**
 * `?state=empty`, `?step=summary` — deep links, so a state can be shared and so
 * `pnpm shots` can capture each one without driving clicks.
 */
function fromUrl<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const raw = new URLSearchParams(window.location.search).get(key)
  return allowed.find((v) => v === raw) ?? fallback
}

const STEPS = ['prompt', 'reveal', 'summary'] as const

export function FlashcardRound() {
  const [state, setState] = useState<StateId>(
    fromUrl('state', STATES.map((s) => s.id), 'round'),
  )
  const [nonce, setNonce] = useState(0)
  const step = fromUrl('step', STEPS, 'prompt')

  function reset(next: StateId) {
    setState(next)
    setNonce(nonce + 1)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg font-semibold text-fg-heading">
          Flashcard round
        </h1>
        <p className="max-w-prose text-body text-fg-subtle">
          The five states of one flow, built from the shipped components — not a
          mirror of them. Click through the round: show the answer, grade
          yourself, reach the summary.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {STATES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => reset(s.id)}
            aria-pressed={state === s.id}
            className={[
              'min-h-[44px] rounded-lg border px-4 text-body-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              state === s.id
                ? 'border-transparent bg-action text-action-fg'
                : 'border-border bg-surface text-fg-muted active:bg-surface-2',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
        <Phone key={nonce}>
          {state === 'round' && <Round from={step} onExhausted={() => reset('empty')} />}
          {state === 'loading' && <LoadingScreen />}
          {state === 'empty' && <EmptyScreen onRestart={() => reset('round')} />}
          {state === 'error' && <ErrorScreen onRetry={() => reset('round')} />}
          {state === 'checked' && <CheckedScreen />}
        </Phone>

        <dl className="flex flex-col gap-4 pt-2 text-body-sm">
          {STATES.map((s) => (
            <div key={s.id} className="flex flex-col">
              <dt
                className={
                  state === s.id ? 'font-semibold text-fg-heading' : 'font-medium text-fg-muted'
                }
              >
                {s.label}
              </dt>
              <dd className="text-fg-subtle">{s.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
