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
import {
  AnswerResult,
  AppHeader,
  AudioButton,
  Button,
  EmptyState,
  ErrorState,
  FlipCard,
  GradePair,
  LoadingPlaceholder,
  Maru,
  PhraseCard,
  ScoreCard,
} from '../../src/components'
import type { AnswerOutcome, PhraseAccent } from '../../src/components'
import { EmptyStage, FlowPage, Phone, Screen, fromUrl } from './shell'
import type { FlowState } from './shell'

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

// ─── The round ─────────────────────────────────────────────────────────────

type Step = 'prompt' | 'reveal' | 'summary'

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
        <AppHeader title="Round complete" subtitle={`${PHRASES.length} phrases`} progress={1} />
        <Screen>
          <ScoreCard
            correct={recalled}
            total={PHRASES.length}
            tone="rokusho"
          >
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
        progress={done / PHRASES.length}
      />
      <Screen>
        <FlipCard front={front} back={back} flipped={step === 'reveal'} />
        {step === 'reveal' && <GradePair onGrade={grade} />}
      </Screen>
    </>
  )
}

// ─── The other four states ─────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <>
      <AppHeader title="Flashcards" subtitle="Loading" progress={0} />
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
        <EmptyStage>
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
        </EmptyStage>
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
      <AppHeader title="Fill in the blank" subtitle="transit · 1 of 4" progress={0.25} />
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

const STATES: readonly FlowState<StateId>[] = [
  { id: 'round', label: 'In progress', note: 'prompt \u2192 reveal \u2192 self-grade \u2192 summary' },
  { id: 'loading', label: 'Loading', note: 'round is being assembled' },
  { id: 'empty', label: 'Empty', note: 'nothing due' },
  { id: 'error', label: 'Error', note: 'load failed, progress intact' },
  { id: 'checked', label: 'App-checked', note: 'AnswerResult, for comparison' },
]

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
    <FlowPage
      title="Flashcard round"
      blurb="The five states of one flow, built from the shipped components — not a mirror of them. Click through the round: show the answer, grade yourself, reach the summary."
      states={STATES}
      current={state}
      onSelect={reset}
    >
      <Phone key={nonce}>
        {state === 'round' && <Round from={step} onExhausted={() => reset('empty')} />}
        {state === 'loading' && <LoadingScreen />}
        {state === 'empty' && <EmptyScreen onRestart={() => reset('round')} />}
        {state === 'error' && <ErrorScreen onRetry={() => reset('round')} />}
        {state === 'checked' && <CheckedScreen />}
      </Phone>
    </FlowPage>
  )
}
