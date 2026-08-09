/**
 * Fill in the blank — Phase 4 flow mockup.
 *
 * Mirrors `../aburungo/src/components/FillBlankCard.tsx`, the review-step card
 * inside `LearnPage`. This is the flow the plan's five rows do not cover, and
 * it is the one that matters most:
 *
 *  - `FillInput` is the component the app actually imports, through a wrapper,
 *    and it had never been rendered on a screen. It nests `KanaKeyboard`
 *    inside a bordered display block, which is why the 596px gojūon grid could
 *    not fit at any phone viewport. The keyboard was rewritten on that
 *    argument; **this flow is what checks the argument was right.**
 *  - `VoiceInput` had never been on a screen either.
 *  - `AnswerResult` finally appears in its real context — the app grading a
 *    typed answer — rather than parked on the flashcard flow for comparison.
 *
 * `FillBlankCard` and `GrammarClozeCard` are the pair that drifted to two
 * vocabularies for one state, which is why `AnswerResult` owns its wording.
 * Composing the card here keeps that visible.
 */
import { useState } from 'react'
import {
  AnswerResult,
  AppHeader,
  AudioButton,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FillInput,
  LoadingPlaceholder,
  VoiceInput,
} from '../../src/components'
import type {
  AnswerOutcome,
  InputMode,
  KanaScript,
  KanaSection,
  VoiceInputStatus,
} from '../../src/components'
import { convertRomaji } from '../../src/lib'
import { FlowPage, Phone, Screen, fromUrl } from './shell'
import type { FlowState } from './shell'

const CARD = {
  english: 'Where is the station?',
  japanese: '駅はどこですか',
  reading: 'えきはどこですか',
  romaji: 'eki wa doko desu ka',
  scenario: 'transit',
  notes: 'Works at info desks, on the street, at hotel front desks.',
}

/** The prompt half of the card — identical across every input mode. */
function Prompt({
  audio,
  onPlay,
  channel,
  onChannel,
}: {
  audio: 'idle' | 'loading' | 'playing'
  onPlay: () => void
  channel: 'text' | 'voice'
  onChannel: (c: 'text' | 'voice') => void
}) {
  return (
    <>
      {/* Type/Speak rides the header rather than taking a row of its own.
          Stacked above FillInput's own Romaji/Kana/JP picker it made two
          segmented controls before the learner could type, and pushed the
          card 54px past a 390x844 phone — measured, not guessed. */}
      <header className="flex items-center justify-between gap-3">
        <Badge emphasis>{CARD.scenario}</Badge>
        <div className="flex items-center gap-2">
          <ChannelToggle channel={channel} onChange={onChannel} />
          <AudioButton state={audio} onPress={onPlay} />
        </div>
      </header>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-body-sm text-fg-subtle">How do you say…</p>
        <p className="text-heading font-semibold text-fg">{CARD.english}</p>
      </div>
    </>
  )
}

/** Type / Speak. The app's own toggle, above `FillInput`'s three sub-modes. */
function ChannelToggle({
  channel,
  onChange,
}: {
  channel: 'text' | 'voice'
  onChange: (c: 'text' | 'voice') => void
}) {
  return (
    <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
      {(['text', 'voice'] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={channel === c}
          className={[
            'min-h-[44px] rounded-lg px-3 text-body-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
            channel === c ? 'bg-action text-action-fg' : 'text-fg-subtle active:bg-surface-2',
          ].join(' ')}
        >
          {c === 'text' ? 'Type' : 'Speak'}
        </button>
      ))}
    </div>
  )
}

function InputScreen({
  startMode,
  startChannel,
  startVoice = 'idle',
  onSubmit,
}: {
  startMode: InputMode
  startChannel: 'text' | 'voice'
  startVoice?: VoiceInputStatus
  onSubmit: () => void
}) {
  const [channel, setChannel] = useState<'text' | 'voice'>(startChannel)
  const [mode, setMode] = useState<InputMode>(startMode)
  const [romaji, setRomaji] = useState(startMode === 'romaji' ? 'eki wa dok' : '')
  const [kana, setKana] = useState('')
  const [script, setScript] = useState<KanaScript>('hiragana')
  const [section, setSection] = useState<KanaSection>('basic')
  const [voice, setVoice] = useState<VoiceInputStatus>(startVoice)
  const [hint, setHint] = useState(false)
  const [audio, setAudio] = useState<'idle' | 'loading' | 'playing'>('idle')

  const { converted, pending } = convertRomaji(romaji)
  const answered = mode === 'romaji' ? romaji.trim() !== '' : kana.trim() !== ''

  function play() {
    setAudio('playing')
    window.setTimeout(() => setAudio('idle'), 900)
  }

  function speak() {
    setVoice(voice === 'listening' ? 'processing' : 'listening')
    if (voice === 'listening') window.setTimeout(onSubmit, 700)
  }

  return (
    <>
      <AppHeader title="Fill in the blank" subtitle="transit · 1 of 4" progress={0} />
      <Screen>
        {/* The whole card, exactly as FillBlankCard composes it — the point is
            whether this fits a phone once FillInput unfolds inside it. */}
        <Card>
          <div className="flex flex-col gap-5">
            <Prompt audio={audio} onPlay={play} channel={channel} onChannel={setChannel} />

            {channel === 'text' ? (
              <FillInput
                mode={mode}
                romajiValue={romaji}
                kanaValue={kana}
                converted={converted}
                pending={pending}
                kanaScript={script}
                kanaSection={section}
                canSubmit={answered}
                showSystemHint={hint}
                onModeChange={setMode}
                onRomajiChange={setRomaji}
                onKanaKey={(c) => setKana(kana + c)}
                onKanaBackspace={() => setKana([...kana].slice(0, -1).join(''))}
                onKanaScriptChange={setScript}
                onKanaSectionChange={setSection}
                onSystemChange={setKana}
                onSubmit={onSubmit}
                onToggleSystemHint={() => setHint(!hint)}
              />
            ) : (
              <VoiceInput status={voice} onPress={speak} />
            )}
          </div>
        </Card>
      </Screen>
    </>
  )
}

function CheckedScreen({ outcome, onNext }: { outcome: AnswerOutcome; onNext: () => void }) {
  return (
    <>
      <AppHeader title="Fill in the blank" subtitle="transit · 1 of 4" progress={0.25} />
      <Screen>
        <AnswerResult
          outcome={outcome}
          userAnswer={outcome === 'recalled' ? undefined : 'えきはどくですか'}
        >
          <p lang="ja" className="font-jp text-jp-lg text-fg-heading">
            {CARD.japanese}
          </p>
          <p lang="ja" className="font-jp text-jp text-action-2-fg">
            {CARD.reading}
          </p>
          <p className="text-body-sm text-fg-subtle">{CARD.romaji}</p>
        </AnswerResult>
        <Button fullWidth onClick={onNext}>
          Next
        </Button>
      </Screen>
    </>
  )
}

// ─── Host ──────────────────────────────────────────────────────────────────

type StateId =
  | 'romaji' | 'kana' | 'system'
  | 'speak' | 'listening' | 'processing' | 'voice-error'
  | 'recalled' | 'review'
  | 'loading' | 'empty' | 'error'

const STATES: readonly FlowState<StateId>[] = [
  { id: 'romaji', label: 'Romaji', note: 'typed, with the live kana preview' },
  { id: 'kana', label: 'Kana keyboard', note: 'the whole card plus the keyboard — the fit test' },
  { id: 'system', label: 'JP keyboard', note: 'device IME, with the how-to hint' },
  { id: 'speak', label: 'Speak · idle', note: 'tap to start' },
  { id: 'listening', label: 'Speak · recording', note: 'was Akane — the error colour — now its own role' },
  { id: 'processing', label: 'Speak · processing', note: 'transcribing' },
  { id: 'voice-error', label: 'Speak · failed', note: 'the state recording used to be confused with' },
  { id: 'recalled', label: 'Recalled', note: 'AnswerResult in its real context' },
  { id: 'review', label: 'Not quite', note: 'with the answer the learner gave' },
  { id: 'loading', label: 'Loading', note: 'card being fetched' },
  { id: 'empty', label: 'Empty', note: 'nothing due' },
  { id: 'error', label: 'Error', note: 'load failed' },
]

const VOICE: Partial<Record<StateId, VoiceInputStatus>> = {
  speak: 'idle',
  listening: 'listening',
  processing: 'processing',
  'voice-error': 'error',
}

const AS_MODE: Partial<Record<StateId, InputMode>> = {
  romaji: 'romaji',
  kana: 'kana',
  system: 'system',
}

export function FillBlank() {
  const [state, setState] = useState<StateId>(
    fromUrl('state', STATES.map((s) => s.id), 'romaji'),
  )
  const [nonce, setNonce] = useState(0)

  function go(next: StateId) {
    setState(next)
    setNonce(nonce + 1)
  }

  const inputMode = AS_MODE[state]

  return (
    <FlowPage
      title="Fill in the blank"
      blurb="The review-step card: prompt, an input channel, then the app's judgment. This is where FillInput and VoiceInput reach a screen for the first time — and where the rewritten kana keyboard has to fit inside a card rather than on its own."
      states={STATES}
      current={state}
      onSelect={go}
    >
      <Phone key={nonce}>
        {inputMode !== undefined && (
          <InputScreen startMode={inputMode} startChannel="text" onSubmit={() => go('review')} />
        )}
        {VOICE[state] !== undefined && (
          <InputScreen
            startMode="romaji"
            startChannel="voice"
            startVoice={VOICE[state]}
            onSubmit={() => go('recalled')}
          />
        )}
        {state === 'recalled' && <CheckedScreen outcome="recalled" onNext={() => go('romaji')} />}
        {state === 'review' && <CheckedScreen outcome="review" onNext={() => go('romaji')} />}
        {state === 'loading' && (
          <>
            <AppHeader title="Fill in the blank" subtitle="Loading" progress={0} />
            <Screen>
              <LoadingPlaceholder label="Finding your next card…" />
            </Screen>
          </>
        )}
        {state === 'empty' && (
          <>
            <AppHeader title="Fill in the blank" />
            <Screen>
              <div className="flex flex-col items-center gap-6 pt-10">
                <span className="hanko text-display-lg" aria-hidden="true" />
                <EmptyState
                  message="Nothing to fill in right now"
                  description="These come back once a phrase has been seen a few times."
                  action={
                    <Button variant="secondary" onClick={() => go('romaji')}>
                      Practise anyway
                    </Button>
                  }
                />
              </div>
            </Screen>
          </>
        )}
        {state === 'error' && (
          <>
            <AppHeader title="Fill in the blank" />
            <Screen>
              <ErrorState
                message="Couldn't load this card"
                description="Your answer wasn't lost. This is usually the connection."
                action={<Button onClick={() => go('romaji')}>Try again</Button>}
              />
            </Screen>
          </>
        )}
      </Phone>
    </FlowPage>
  )
}
