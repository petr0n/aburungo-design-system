/**
 * The DS Components page — every public export, rendered from the real thing.
 *
 * This file imports `src/components`. It does not restate a component, a prop
 * union, or a class list anywhere. That is the whole contract: `tsconfig.json`
 * includes `preview/ds`, so `pnpm typecheck` reads this file, and a prop that
 * does not exist fails the build rather than rendering as bare text.
 *
 * Two rules carried over from `storybook/stories.tsx`, for the same reasons:
 *
 * 1. **Never define a component here.** The only locals allowed are page
 *    chrome (`Spec`, `PropsTable`, `Group`) and story fixtures — content to
 *    put *inside* a real component. Fixtures carry a `_` prefix.
 * 2. **Never restate a union.** `PhraseAccent`, `KanaScript`, `KanaSection`,
 *    `AnswerOutcome`, `InputMode` and `VoiceInputStatus` are imported. A
 *    hand-copied union is a mirror of a type, and that is how the storybook
 *    ended up documenting a kana section called 'combo' that has never
 *    existed.
 *
 * Grouping is by KIND, not alphabetical: primitives, domain, the correctness
 * vocabulary, layout and state, icons — and then the things this system does
 * NOT have, drawn rather than described. A gap you can see is a finding; a gap
 * in a paragraph is a note nobody reads.
 */
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import {
  AnswerResult,
  AppHeader,
  AudioButton,
  BackspaceIcon,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EmptyState,
  ErrorState,
  FillInput,
  FlipCard,
  GradePair,
  IconButton,
  KanaGrid,
  KanaKeyboard,
  LoadingPlaceholder,
  Maru,
  MicIcon,
  PhraseCard,
  ProgressBar,
  ScoreCard,
  SpeakerIcon,
  SpinnerIcon,
  TextInput,
  VoiceInput,
} from '../../src/components'
import type {
  AnswerOutcome,
  IconBaseProps,
  InputMode,
  KanaCell,
  KanaScript,
  KanaSection,
  PhraseAccent,
  VoiceInputStatus,
} from '../../src/components'
import { convertRomaji, finalizeRomaji } from '../../src/lib/romajiToKana'

/* ══════════════════════════════════════════════════════════════════════════
   Page chrome. Not components — the frame the components are shown in.
   ══════════════════════════════════════════════════════════════════════════ */

type PropRow = {
  name: string
  type: string
  fallback?: string
  note: string
}

type Cols = 'c1' | 'c2' | 'c3' | 'c4'

type Entry = {
  name: string
  /** Everything else exported alongside it, shown next to the name. */
  also?: readonly string[]
  blurb: string
  cols: Cols
  specimens: ReactNode
  props: readonly PropRow[]
}

type GroupDef = {
  n: number
  title: string
  note: string
  /**
   * Public exports this group covers — NOT `entries.length`.
   *
   * The two differ wherever one entry carries several exports: Card ships with
   * its three slots, and the four icons share a single entry. Counting entries
   * printed "1 exports shown" over four icons.
   */
  exports: number
  entries: readonly Entry[]
}

function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ds-spec">
      <div className="ds-cap">{label}</div>
      <div className="ds-demo">{children}</div>
    </div>
  )
}

/** A specimen on the warm page ground rather than card white. */
function SpecOnPage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ds-spec ds-on-page">
      <div className="ds-cap">{label}</div>
      <div className="ds-demo">{children}</div>
    </div>
  )
}

function PropsTable({ rows }: { rows: readonly PropRow[] }) {
  return (
    <div className="ds-scroll">
      <table className="ds-props">
        <thead>
          <tr>
            <th>prop</th>
            <th>type</th>
            <th>default</th>
            <th>what it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code>{r.name}</code>
              </td>
              <td>
                <code className="ds-type">{r.type}</code>
              </td>
              <td>
                {r.fallback === undefined ? (
                  <span className="ds-req">required</span>
                ) : (
                  <code>{r.fallback}</code>
                )}
              </td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <section className="ds-entry" id={`c-${entry.name}`}>
      <h3 className="ds-h3">
        {entry.name}
        {entry.also !== undefined &&
          entry.also.map((a) => (
            <span key={a} className="ds-also">
              {a}
            </span>
          ))}
      </h3>
      <p className="ds-note">{entry.blurb}</p>
      <div className={`ds-grid ${entry.cols}`}>{entry.specimens}</div>
      <PropsTable rows={entry.props} />
    </section>
  )
}

function GroupBlock({ group }: { group: GroupDef }) {
  return (
    <section className="ds-section" id={`g-${group.n}`}>
      <h2 className="ds-h2">
        <span className="ds-n">{group.n}</span>
        {group.title}
        <span className="ds-st ok">{group.exports} exports</span>
      </h2>
      <p className="ds-note">{group.note}</p>
      {group.entries.map((e) => (
        <EntryBlock key={e.name} entry={e} />
      ))}
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Fixtures — content to put inside real components. Never a component.
   ══════════════════════════════════════════════════════════════════════════ */

const ICON_SIZE: IconBaseProps = { className: 'h-5 w-5' }

const _KANA_ROWS: readonly (readonly (KanaCell | null)[])[] = [
  [
    { kana: 'あ', romaji: 'a' },
    { kana: 'い', romaji: 'i' },
    { kana: 'う', romaji: 'u' },
    { kana: 'え', romaji: 'e' },
    { kana: 'お', romaji: 'o' },
  ],
  [
    { kana: 'か', romaji: 'ka' },
    { kana: 'き', romaji: 'ki' },
    { kana: 'く', romaji: 'ku' },
    { kana: 'け', romaji: 'ke' },
    { kana: 'こ', romaji: 'ko' },
  ],
  [
    { kana: 'さ', romaji: 'sa' },
    { kana: 'し', romaji: 'shi' },
    { kana: 'す', romaji: 'su' },
    { kana: 'せ', romaji: 'se' },
    { kana: 'そ', romaji: 'so' },
  ],
  [
    { kana: 'た', romaji: 'ta' },
    { kana: 'ち', romaji: 'chi' },
    { kana: 'つ', romaji: 'tsu' },
    null,
    { kana: 'と', romaji: 'to' },
  ],
]

const _LEARNED: ReadonlySet<string> = new Set(['あ', 'い', 'か', 'こ', 'し'])

/** A flashcard face. Content the consuming app supplies — FlipCard takes nodes. */
function _FlipFace({ jp, reading, en }: { jp: string; reading: string; en?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-6 shadow-card">
      <p lang="ja" className="font-jp text-jp-display text-fg-heading">
        {jp}
      </p>
      <p lang="ja" className="font-jp text-jp text-fg-muted">
        {reading}
      </p>
      {en !== undefined && (
        <>
          <hr className="w-full border-border" />
          <p className="text-body-lg text-fg">{en}</p>
        </>
      )}
    </div>
  )
}

function _KanaOut({ value, hint }: { value: string; hint: string }) {
  return (
    <div
      lang="ja"
      className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg"
    >
      {value === '' ? <span className="text-body text-fg-faint">{hint}</span> : value}
    </div>
  )
}

function _AudioDemo() {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle')
  function press() {
    if (state !== 'idle') return
    setState('loading')
    window.setTimeout(() => setState('playing'), 320)
    window.setTimeout(() => setState('idle'), 1600)
  }
  return <AudioButton state={state} onPress={press} />
}

function _KanaGridDemo() {
  const [out, setOut] = useState('')
  return (
    <div className="flex flex-col gap-3">
      <_KanaOut value={out} hint="Tap kana below…" />
      <KanaGrid rows={_KANA_ROWS} onSelect={(k) => setOut((s) => s + k)} learned={_LEARNED} />
      <Button
        variant="secondary"
        size="sm"
        disabled={out === ''}
        onClick={() => setOut((s) => [...s].slice(0, -1).join(''))}
      >
        Backspace — the screen&rsquo;s, not the grid&rsquo;s
      </Button>
    </div>
  )
}

function _KanaKeyboardDemo({
  initialScript = 'hiragana',
  initialSection = 'basic',
}: {
  initialScript?: KanaScript
  initialSection?: KanaSection
}) {
  const [script, setScript] = useState<KanaScript>(initialScript)
  const [section, setSection] = useState<KanaSection>(initialSection)
  const [out, setOut] = useState('')
  return (
    <div className="flex flex-col gap-3">
      <_KanaOut value={out} hint="Tap a consonant, then a vowel…" />
      <KanaKeyboard
        script={script}
        section={section}
        onScriptChange={setScript}
        onSectionChange={setSection}
        onKey={(k) => setOut((s) => s + k)}
        onBackspace={() => setOut((s) => [...s].slice(0, -1).join(''))}
      />
    </div>
  )
}

function _FlipDemo() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <FlipCard
        flipped={flipped}
        front={<_FlipFace jp="電車" reading="でんしゃ" />}
        back={<_FlipFace jp="電車" reading="でんしゃ" en="train" />}
      />
      <Button
        variant={flipped ? 'secondary' : 'primary'}
        fullWidth
        onClick={() => setFlipped((f) => !f)}
      >
        {flipped ? 'Flip back' : 'Reveal'}
      </Button>
    </div>
  )
}

function _FlipPhaseDemo() {
  const [key, setKey] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <FlipCard
        key={key}
        flipped={false}
        phase="entering"
        front={<_FlipFace jp="駅" reading="えき" />}
        back={<_FlipFace jp="駅" reading="えき" en="station" />}
      />
      <Button variant="secondary" fullWidth onClick={() => setKey((k) => k + 1)}>
        Replay phase=&quot;entering&quot;
      </Button>
    </div>
  )
}

function _VoiceDemo() {
  const [status, setStatus] = useState<VoiceInputStatus>('idle')
  function press() {
    if (status === 'idle') {
      setStatus('listening')
    } else if (status === 'listening') {
      setStatus('processing')
      window.setTimeout(() => setStatus('idle'), 900)
    }
  }
  return <VoiceInput status={status} onPress={press} />
}

/** Stateful driver for the stateless FillInput. The app owns this state for real. */
function _FillInputDemo({ initialMode }: { initialMode: InputMode }) {
  const [mode, setMode] = useState<InputMode>(initialMode)
  const [romaji, setRomaji] = useState('')
  const [kana, setKana] = useState('')
  const [hint, setHint] = useState(initialMode === 'system')
  const [script, setScript] = useState<KanaScript>('hiragana')
  const [section, setSection] = useState<KanaSection>('basic')
  const [submitted, setSubmitted] = useState<string | null>(null)

  useEffect(() => {
    setRomaji('')
    setKana('')
  }, [mode])

  const { converted, pending } = convertRomaji(romaji)
  const canSubmit = mode === 'romaji' ? romaji.trim() !== '' : kana.trim() !== ''

  function submit() {
    const value = mode === 'romaji' ? finalizeRomaji(romaji) : kana
    if (value.trim() === '') return
    setSubmitted(value.trim())
    setRomaji('')
    setKana('')
  }

  return (
    <div className="flex flex-col gap-3">
      <FillInput
        mode={mode}
        romajiValue={romaji}
        kanaValue={kana}
        converted={converted}
        pending={pending}
        kanaScript={script}
        kanaSection={section}
        canSubmit={canSubmit}
        placeholder="Answer in hiragana…"
        showSystemHint={hint}
        onModeChange={setMode}
        onRomajiChange={setRomaji}
        onKanaKey={(c) => setKana((p) => p + c)}
        onKanaBackspace={() => setKana((p) => [...p].slice(0, -1).join(''))}
        onKanaScriptChange={setScript}
        onKanaSectionChange={setSection}
        onSystemChange={setKana}
        onSubmit={submit}
        onToggleSystemHint={() => setHint((h) => !h)}
      />
      {submitted !== null && (
        <p className="text-center text-body-sm text-fg-muted">
          Submitted: <span lang="ja" className="font-jp text-fg">{submitted}</span>
        </p>
      )}
    </div>
  )
}

function _GradePairDemo() {
  const [last, setLast] = useState<AnswerOutcome | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <GradePair onGrade={setLast} />
      <p className="text-center text-body-sm text-fg-muted">
        {last === null ? 'No grade yet' : `onGrade("${last}")`}
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   1 · Primitives
   ══════════════════════════════════════════════════════════════════════════ */

const PRIMITIVES: readonly Entry[] = [
  {
    name: 'Button',
    blurb:
      'Three variants and a semantic tone that applies to secondary only — primary is Ai-iro by definition and ghost has no chrome to tint. Every variant/size pair clears 44px. Press states only, never hover-only.',
    cols: 'c3',
    props: [
      { name: 'children', type: 'ReactNode', note: 'The label. Replaced by "Please wait…" while loading.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost'", fallback: "'primary'", note: 'Rank. Primary is Ai-iro solid; secondary is an Ōgon-bordered tint; ghost is text-only.' },
      { name: 'tone', type: "'neutral' | 'success' | 'error'", fallback: "'neutral'", note: 'Outcome tint. Replaces secondary’s chrome wholesale — never stacks. Ignored on primary and ghost.' },
      { name: 'size', type: "'md' | 'sm'", fallback: "'md'", note: 'h-12 / h-11. Both hold min-h-[44px].' },
      { name: 'loading', type: 'boolean', fallback: 'false', note: 'Disables presses and swaps the label for "Please wait…".' },
      { name: 'fullWidth', type: 'boolean', fallback: 'false', note: 'w-full.' },
      { name: 'disabled', type: 'boolean', fallback: 'undefined', note: 'Native. Also implied by loading.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Escape hatch. Discouraged — compose with variant/size instead.' },
      { name: '…rest', type: 'ButtonHTMLAttributes', fallback: '—', note: 'type defaults to "button", never "submit" by accident.' },
    ],
    specimens: (
      <>
        <Spec label='variant="primary" · "secondary" · "ghost"'>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Check answer</Button>
            <Button variant="secondary">Show answer</Button>
            <Button variant="ghost">Sign out</Button>
          </div>
        </Spec>
        <Spec label='tone="success" · "error" (secondary only)'>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" tone="neutral">
              Neutral
            </Button>
            <Button variant="secondary" tone="success">
              Correct
            </Button>
            <Button variant="secondary" tone="error">
              Worth another look
            </Button>
          </div>
        </Spec>
        <Spec label='size="md" · "sm"'>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="md">Medium</Button>
            <Button size="sm">Small</Button>
            <Button variant="secondary" size="sm">
              Small
            </Button>
          </div>
        </Spec>
        <Spec label="disabled · loading">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button loading>Check answer</Button>
          </div>
        </Spec>
        <Spec label="fullWidth">
          <div className="flex flex-col gap-2">
            <Button fullWidth>Continue</Button>
            <Button variant="secondary" fullWidth>
              Not yet
            </Button>
          </div>
        </Spec>
      </>
    ),
  },
  {
    name: 'TextInput',
    blurb:
      'Label is mandatory — no placeholder-as-label anywhere in this product. Hint and error are mutually exclusive: an error suppresses the hint, sets aria-invalid and wires aria-describedby. Focus is Ōgon; Akane is the mark and errors, never focus.',
    cols: 'c3',
    props: [
      { name: 'label', type: 'string', note: 'Visible label. Not optional, on purpose.' },
      { name: 'hint', type: 'string', fallback: 'undefined', note: 'Help text below. Suppressed when error is set.' },
      { name: 'error', type: 'string', fallback: 'undefined', note: 'Error text with role="alert". Also reddens the border and sets aria-invalid.' },
      { name: 'id', type: 'string', fallback: 'useId()', note: 'Overrides the generated id that ties label to control.' },
      { name: 'disabled', type: 'boolean', fallback: 'undefined', note: 'Native. Drops the control to 50% opacity.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Appended to the input, not the wrapper.' },
      { name: '…rest', type: 'InputHTMLAttributes', fallback: '—', note: 'type, placeholder, value, onChange, defaultValue…' },
    ],
    specimens: (
      <>
        <Spec label="default">
          <TextInput label="Email" placeholder="you@example.com" />
        </Spec>
        <Spec label="hint">
          <TextInput label="Email" hint="We never share this." placeholder="you@example.com" />
        </Spec>
        <Spec label="error">
          <TextInput
            label="Password"
            type="password"
            defaultValue="hi"
            error="Must be at least 8 characters."
          />
        </Spec>
        <Spec label="disabled">
          <TextInput label="Account" defaultValue="petron@gmail.com" disabled />
        </Spec>
      </>
    ),
  },
  {
    name: 'Card',
    also: ['CardHeader', 'CardBody', 'CardFooter'],
    blurb:
      'The entire elevation system: hairline border, one drop-shadow, warm-paper ground that is lighter than the page. The three slots are layout only — flex rows and columns with the right gaps — and are public exports that had no story at all until 2026-08-26.',
    cols: 'c3',
    props: [
      { name: 'children', type: 'ReactNode', note: 'Anything. The slots below are optional structure.' },
      { name: 'compact', type: 'boolean', fallback: 'false', note: 'p-4 instead of p-6. For inline list rows.' },
      { name: 'tone', type: "'surface' | 'bare'", fallback: "'surface'", note: 'bare drops the background so the caller supplies its own — two bg-* utilities on one element is a coin toss. PhraseCard uses it.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Appended. Where an accent ground goes when tone="bare".' },
      { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', fallback: '—', note: 'Renders as <article>.' },
      { name: 'CardHeader / CardBody / CardFooter', type: '{ children, className? }', fallback: '—', note: 'header flex-row space-between · body flex-col gap-3 · footer flex-row gap-3.' },
    ],
    specimens: (
      <>
        <Spec label="default">
          <Card>
            <p className="text-body text-fg">
              A surface with a hairline border and a single drop-shadow. Lighter than the page, so
              it lifts without needing more.
            </p>
          </Card>
        </Spec>
        <Spec label="compact">
          <Card compact>
            <p className="text-body-sm text-fg-muted">Compact padding — for inline list rows.</p>
          </Card>
        </Spec>
        <Spec label='tone="bare" + own ground'>
          <Card tone="bare" className="bg-accent-rokusho-bg border-t-[3px] border-t-accent-rokusho">
            <p className="text-body text-fg">
              No background of its own. This one is Rokushō — the same mechanism PhraseCard uses.
            </p>
          </Card>
        </Spec>
        <Spec label="CardHeader · CardBody · CardFooter">
          <Card>
            <CardHeader>
              <h4 className="text-body-lg font-semibold text-fg-heading">Chapter 3</h4>
              <Badge emphasis>4 left</Badge>
            </CardHeader>
            <CardBody>
              <p className="text-body text-fg-muted">
                Four lessons left. Misses come back later in the chapter.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="primary" size="sm" fullWidth>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </Spec>
      </>
    ),
  },
  {
    name: 'Badge',
    blurb:
      'Strictly informational — never interactive. If it needs to be tappable it is a Button size="sm". Neutral is the scenario tag and takes the dedicated Ōgon tag role, not a generic grey.',
    cols: 'c3',
    props: [
      { name: 'children', type: 'ReactNode', note: 'The label.' },
      { name: 'variant', type: "'neutral' | 'success' | 'error'", fallback: "'neutral'", note: 'neutral = the Ōgon scenario tag. success/error share the correctness roles.' },
      { name: 'emphasis', type: 'boolean', fallback: 'false', note: 'Uppercase, wide tracking, caption size. The scenario-tag style.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Appended.' },
      { name: '…rest', type: 'HTMLAttributes<HTMLSpanElement>', fallback: '—', note: 'Renders as <span>.' },
    ],
    specimens: (
      <>
        <Spec label="variant — all three">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Polite form</Badge>
            <Badge variant="success">Got it</Badge>
            <Badge variant="error">Not quite</Badge>
          </div>
        </Spec>
        <Spec label="emphasis (the scenario tag)">
          <div className="flex flex-wrap items-center gap-2">
            <Badge emphasis>restaurant</Badge>
            <Badge emphasis>transit</Badge>
            <Badge variant="success" emphasis>
              learned
            </Badge>
            <Badge variant="error" emphasis>
              review
            </Badge>
          </div>
        </Spec>
      </>
    ),
  },
  {
    name: 'IconButton',
    blurb:
      'A square touch target around one SVG slot. aria-label is required by the type, because the children are decorative. Both sizes are 44px — sm is tighter visually and identical in hit area.',
    cols: 'c3',
    props: [
      { name: 'aria-label', type: 'string', note: 'Required. The children are aria-hidden SVG.' },
      { name: 'children', type: 'ReactNode', note: 'One icon. Size it at the call site (h-5 w-5).' },
      { name: 'variant', type: "'default' | 'filled' | 'danger'", fallback: "'default'", note: 'Hairline neutral · Ai-iro solid · Akane solid.' },
      { name: 'size', type: "'md' | 'sm'", fallback: "'md'", note: 'Both resolve to 44px — the floor is the floor.' },
      { name: 'shape', type: "'round' | 'square'", fallback: "'round'", note: 'rounded-full or rounded-lg.' },
      { name: 'disabled', type: 'boolean', fallback: 'undefined', note: 'Native. 50% opacity.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Appended.' },
      { name: '…rest', type: 'ButtonHTMLAttributes', fallback: '—', note: 'onClick, aria-pressed…' },
    ],
    specimens: (
      <>
        <Spec label="variant — all three">
          <div className="flex flex-wrap items-center gap-3">
            <IconButton aria-label="Play audio">
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Now playing" variant="filled">
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Listening" variant="danger">
              <MicIcon {...ICON_SIZE} />
            </IconButton>
          </div>
        </Spec>
        <Spec label='shape="round" · "square"'>
          <div className="flex flex-wrap items-center gap-3">
            <IconButton aria-label="Backspace">
              <BackspaceIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Backspace" shape="square">
              <BackspaceIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Backspace" shape="square" variant="filled">
              <BackspaceIcon {...ICON_SIZE} />
            </IconButton>
          </div>
        </Spec>
        <Spec label="size · disabled">
          <div className="flex flex-wrap items-center gap-3">
            <IconButton aria-label="Play" size="md">
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Play" size="sm">
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Play" disabled>
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
            <IconButton aria-label="Play" variant="filled" disabled>
              <SpeakerIcon {...ICON_SIZE} />
            </IconButton>
          </div>
        </Spec>
      </>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   2 · Domain
   ══════════════════════════════════════════════════════════════════════════ */

const ACCENTS: readonly PhraseAccent[] = ['ogon', 'ai', 'rokusho', 'akane', 'none']

const DOMAIN: readonly Entry[] = [
  {
    name: 'PhraseCard',
    also: ['type PhraseAccent'],
    blurb:
      'The central content unit. The accent is an input, not a locked colour, so it can carry meaning — which scenario, which unit, which state. It tints the whole card ground plus the top rule and the tag; the page ground deliberately stays warm stone, which is the option this beat in the 2026-08-08 review.',
    cols: 'c3',
    props: [
      { name: 'japanese', type: 'string', note: 'Native form, may contain kanji. Rendered at jp-display.' },
      { name: 'reading', type: 'string', note: 'Hiragana-only reading, a separate line below — not furigana. There is no kana tokeniser yet.' },
      { name: 'english', type: 'string', fallback: 'undefined', note: 'Omit while the learner is recalling. Adds the rule and the gloss block.' },
      { name: 'scenario', type: 'string', fallback: 'undefined', note: 'Renders as the uppercase tag in the accent colour.' },
      { name: 'accent', type: "'ogon' | 'ai' | 'rokusho' | 'akane' | 'none'", fallback: "'ogon'", note: 'Ground, top rule and tag. akane is available but also means error elsewhere.' },
      { name: 'audioSlot', type: 'ReactNode', fallback: 'undefined', note: 'Top-right of the header. Where AudioButton goes.' },
      { name: 'footer', type: 'ReactNode', fallback: 'undefined', note: 'Bottom row — grading buttons, "Show answer".' },
      { name: 'notes', type: 'string', fallback: 'undefined', note: 'Authoring note under the English line. Needs english to be visible.' },
    ],
    specimens: (
      <>
        {ACCENTS.map((accent) => (
          <Spec key={accent} label={`accent="${accent}"`}>
            <PhraseCard
              accent={accent}
              scenario="restaurant"
              japanese="お会計お願いします"
              reading="おかいけいおねがいします"
              english="The check, please."
              audioSlot={<AudioButton onPress={() => {}} />}
            />
          </Spec>
        ))}
        <Spec label="english omitted — the recall state">
          <PhraseCard
            accent="ai"
            scenario="transit"
            japanese="駅はどこですか"
            reading="えきはどこですか"
            audioSlot={<AudioButton onPress={() => {}} />}
          />
        </Spec>
        <Spec label="notes + footer">
          <PhraseCard
            scenario="shopping"
            japanese="これをください"
            reading="これをください"
            english="I'll have this."
            notes="The most useful single phrase in any Japanese shop — works even when you can't read the label."
            audioSlot={<AudioButton onPress={() => {}} />}
            footer={
              <Button variant="secondary" fullWidth>
                Next
              </Button>
            }
          />
        </Spec>
        <Spec label="no scenario, no audioSlot">
          <PhraseCard
            accent="none"
            japanese="ありがとうございます"
            reading="ありがとうございます"
            english="Thank you."
          />
        </Spec>
      </>
    ),
  },
  {
    name: 'FlipCard',
    also: ['type FlipCardPhase'],
    blurb:
      'A 3D flip plus the round’s enter/exit slide. Both faces sit in the same grid cell so the container measures the taller one — the back is always taller, since it carries the answer the front is hiding. phase drives the slide and fires onEntered / onExited when it lands. Under prefers-reduced-motion the slide tokens resolve to none and the callbacks still fire.',
    cols: 'c3',
    props: [
      { name: 'front', type: 'ReactNode', note: 'The face shown when flipped is false.' },
      { name: 'back', type: 'ReactNode', note: 'Pre-rotated 180°. Always in flow, so it sizes the card.' },
      { name: 'flipped', type: 'boolean', note: 'Controlled. Drives the 0.45s rotateY.' },
      { name: 'phase', type: "'entering' | 'idle' | 'exiting'", fallback: "'idle'", note: 'The vertical card-enter / card-exit animation. idle means no slide.' },
      { name: 'onEntered', type: '() => void', fallback: 'undefined', note: 'Fires on animationend while phase="entering".' },
      { name: 'onExited', type: '() => void', fallback: 'undefined', note: 'Fires on animationend while phase="exiting".' },
    ],
    specimens: (
      <>
        <Spec label="flipped={false} — the front">
          <FlipCard
            flipped={false}
            front={<_FlipFace jp="電車" reading="でんしゃ" />}
            back={<_FlipFace jp="電車" reading="でんしゃ" en="train" />}
          />
        </Spec>
        <Spec label="flipped={true} — the back">
          <FlipCard
            flipped={true}
            front={<_FlipFace jp="電車" reading="でんしゃ" />}
            back={<_FlipFace jp="電車" reading="でんしゃ" en="train" />}
          />
        </Spec>
        <Spec label="interactive">
          <_FlipDemo />
        </Spec>
        <Spec label='phase="entering"'>
          <_FlipPhaseDemo />
        </Spec>
      </>
    ),
  },
  {
    name: 'KanaGrid',
    also: ['type KanaCell'],
    blurb:
      'The flat gojūon grid — one key per kana, five columns, nulls render as gaps. Purely presentational: the owner composes the rows and holds the buffer. It has no onBackspace and never has; the storybook claimed one until tsc could see the file.',
    cols: 'c3',
    props: [
      { name: 'rows', type: 'readonly (readonly (KanaCell | null)[])[]', note: 'KanaCell is { kana, romaji }. null renders an empty cell.' },
      { name: 'onSelect', type: '(kana: string) => void', note: 'Tap or Enter/Space on a key.' },
      { name: 'renderKey', type: '(cell: KanaCell) => ReactNode', fallback: 'cell.kana', note: 'Override the glyph — e.g. kana over romaji.' },
      { name: 'learned', type: 'ReadonlySet<string>', fallback: 'undefined', note: 'Rokushō inset ring, never a fill — a wash sits on top of the character being read.' },
    ],
    specimens: (
      <>
        <Spec label="rows + learned (あいかこし ringed)">
          <KanaGrid rows={_KANA_ROWS} onSelect={() => {}} learned={_LEARNED} />
        </Spec>
        <Spec label="renderKey — kana over romaji">
          <KanaGrid
            rows={_KANA_ROWS}
            onSelect={() => {}}
            renderKey={(cell) => (
              <>
                <span>{cell.kana}</span>
                <span className="font-sans text-caption text-fg-subtle">{cell.romaji}</span>
              </>
            )}
          />
        </Spec>
        <Spec label="interactive">
          <_KanaGridDemo />
        </Spec>
      </>
    ),
  },
  {
    name: 'KanaKeyboard',
    also: ['type KanaKeyboardProps', 'type KanaScript', 'type KanaSection'],
    blurb:
      'The 12-key consonant pad that replaced the gojūon grid: tap a consonant, the row’s vowels open above it. 256px closed against the grid’s 596px, which is what gave the answer area back on a phone. Rokushō ground on purpose — the header band is already the screen’s one dark slab.',
    cols: 'c2',
    props: [
      { name: 'script', type: "'hiragana' | 'katakana'", note: 'KanaScript. Controlled.' },
      { name: 'section', type: "'basic' | 'voiced' | 'small'", note: "KanaSection. Not 'combo' — that union never existed outside a hand-copy." },
      { name: 'onScriptChange', type: '(script: KanaScript) => void', note: 'The ひら / カタ toggle. Also closes any open group.' },
      { name: 'onSectionChange', type: '(section: KanaSection) => void', note: 'The あ〜ん / ゛゜ / 小 toggle.' },
      { name: 'onKey', type: '(kana: string) => void', note: 'A vowel key from the open group.' },
      { name: 'onBackspace', type: '() => void', note: 'The utility key. Required — unlike KanaGrid, this one owns it.' },
    ],
    specimens: (
      <>
        <Spec label='script="hiragana" section="basic"'>
          <_KanaKeyboardDemo />
        </Spec>
        <Spec label='script="katakana" section="voiced"'>
          <_KanaKeyboardDemo initialScript="katakana" initialSection="voiced" />
        </Spec>
        <Spec label='section="small"'>
          <_KanaKeyboardDemo initialSection="small" />
        </Spec>
      </>
    ),
  },
  {
    name: 'FillInput',
    also: ['type FillInputProps', 'type InputMode'],
    blurb:
      'Three ways to answer in Japanese, behind one mode picker: romaji with a live kana preview, the kana keyboard, and the phone’s own IME with a setup hint. Fully controlled — converted and pending come from convertRomaji(), which is why the component itself holds no state.',
    cols: 'c2',
    props: [
      { name: 'mode', type: "'romaji' | 'kana' | 'system'", note: 'InputMode. Which of the three is active.' },
      { name: 'romajiValue', type: 'string', note: 'Raw typed romaji.' },
      { name: 'kanaValue', type: 'string', note: 'Accumulated kana — keyboard and IME modes.' },
      { name: 'converted', type: 'string', note: 'From convertRomaji(romajiValue).converted. The settled kana in the preview.' },
      { name: 'pending', type: 'string', note: 'From convertRomaji(romajiValue).pending. Shown faint — the half-typed tail.' },
      { name: 'kanaScript', type: 'KanaScript', note: 'Forwarded to the embedded KanaKeyboard.' },
      { name: 'kanaSection', type: 'KanaSection', note: 'Forwarded to the embedded KanaKeyboard.' },
      { name: 'canSubmit', type: 'boolean', note: 'Enables the submit button.' },
      { name: 'disabled', type: 'boolean', fallback: 'undefined', note: 'Locks the active input.' },
      { name: 'placeholder', type: 'string', fallback: "'Kana preview'", note: 'Shown in the preview block while empty.' },
      { name: 'showSystemHint', type: 'boolean', fallback: 'undefined', note: 'Expands the iOS/Android keyboard-setup instructions.' },
      { name: 'inputRef', type: 'RefObject<HTMLInputElement | null>', fallback: 'undefined', note: 'Forwarded to the active text input for focus management.' },
      { name: 'onModeChange', type: '(mode: InputMode) => void', note: 'The three-way picker.' },
      { name: 'onRomajiChange / onSystemChange', type: '(value: string) => void', note: 'Text entry in romaji and IME modes.' },
      { name: 'onKanaKey / onKanaBackspace', type: '(char: string) => void  /  () => void', note: 'Forwarded from the embedded keyboard.' },
      { name: 'onKanaScriptChange / onKanaSectionChange', type: '(v) => void', note: 'Forwarded from the embedded keyboard.' },
      { name: 'onSubmit', type: '() => void', note: 'Submit button and Enter.' },
      { name: 'onToggleSystemHint', type: '() => void', note: 'Opens/closes the IME hint.' },
    ],
    specimens: (
      <>
        <Spec label='mode="romaji" — type "onegaishimasu"'>
          <_FillInputDemo initialMode="romaji" />
        </Spec>
        <Spec label='mode="kana"'>
          <_FillInputDemo initialMode="kana" />
        </Spec>
        <Spec label='mode="system" + showSystemHint'>
          <_FillInputDemo initialMode="system" />
        </Spec>
      </>
    ),
  },
  {
    name: 'VoiceInput',
    also: ['type VoiceInputProps', 'type VoiceInputStatus'],
    blurb:
      'Four states, one control, and the state is always in the caption as well as the colour. Recording is Rokushō, not Akane — Akane is the mark and errors. Presentational: it does not touch the microphone.',
    cols: 'c4',
    props: [
      { name: 'status', type: "'idle' | 'listening' | 'processing' | 'error'", note: 'VoiceInputStatus. Drives the fill, the ping ring, the spinner and the caption.' },
      { name: 'onPress', type: '() => void', note: 'The caller starts/stops the real recogniser.' },
      { name: 'disabled', type: 'boolean', fallback: 'status === "processing"', note: 'Explicit false re-enables during processing.' },
      { name: 'errorMessage', type: 'string', fallback: "'Could not hear you. Try again.'", note: 'Only shown when status="error".' },
    ],
    specimens: (
      <>
        <Spec label='status="idle"'>
          <VoiceInput status="idle" onPress={() => {}} />
        </Spec>
        <Spec label='status="listening"'>
          <VoiceInput status="listening" onPress={() => {}} />
        </Spec>
        <Spec label='status="processing"'>
          <VoiceInput status="processing" onPress={() => {}} />
        </Spec>
        <Spec label='status="error" + errorMessage'>
          <VoiceInput
            status="error"
            onPress={() => {}}
            errorMessage="No microphone permission."
          />
        </Spec>
        <Spec label="interactive">
          <_VoiceDemo />
        </Spec>
      </>
    ),
  },
  {
    name: 'AudioButton',
    blurb:
      'An IconButton wearing three states. It does not own or play audio — wrap it in your own controller. Playing is a filled Ai-iro fill, deliberately subtle: this is feedback, not a celebration.',
    cols: 'c4',
    props: [
      { name: 'state', type: "'idle' | 'loading' | 'playing'", fallback: "'idle'", note: 'loading swaps in a spinning SpinnerIcon and disables presses.' },
      { name: 'onPress', type: '() => void', note: 'Forwarded to onClick.' },
      { name: 'label', type: 'string', fallback: "'Play audio'", note: 'The aria-label. aria-pressed tracks playing.' },
      { name: 'disabled', type: 'boolean', fallback: 'false', note: 'For a phrase with no audioUrl.' },
    ],
    specimens: (
      <>
        <Spec label='state="idle"'>
          <AudioButton state="idle" onPress={() => {}} />
        </Spec>
        <Spec label='state="loading"'>
          <AudioButton state="loading" onPress={() => {}} />
        </Spec>
        <Spec label='state="playing"'>
          <AudioButton state="playing" onPress={() => {}} />
        </Spec>
        <Spec label="disabled">
          <AudioButton onPress={() => {}} disabled label="No audio for this phrase" />
        </Spec>
        <Spec label="interactive">
          <_AudioDemo />
        </Spec>
      </>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   3 · Correctness vocabulary
   ══════════════════════════════════════════════════════════════════════════ */

const CORRECTNESS: readonly Entry[] = [
  {
    name: 'Maru',
    also: ['type AnswerOutcome'],
    blurb:
      '○ recalled, ✕ worth another look — the Japanese schooling marks, not a tick and a cross. This is the only place either glyph is written; anything marking an answer imports it rather than typing a literal. The visible glyph is aria-hidden and a screen reader gets the words.',
    cols: 'c3',
    props: [
      { name: 'outcome', type: "'correct' | 'review'", note: 'AnswerOutcome. ○ in success-fg, ✕ in error-fg.' },
      { name: 'label', type: 'string', fallback: "'correct' / 'worth another look'", note: 'The sr-only text. The defaults are the approved wording.' },
      { name: 'className', type: 'string', fallback: 'undefined', note: 'Size it here — the glyph inherits font-size.' },
      { name: '…rest', type: 'HTMLAttributes<HTMLSpanElement>', fallback: '—', note: 'children and className are taken; everything else passes through.' },
    ],
    specimens: (
      <>
        <Spec label="outcome — both">
          <div className="flex items-center gap-6 text-heading">
            <Maru outcome="correct" />
            <Maru outcome="review" />
          </div>
        </Spec>
        <Spec label="sized by className">
          <div className="flex items-baseline gap-6">
            <Maru outcome="correct" className="text-body-sm" />
            <Maru outcome="correct" className="text-heading-sm" />
            <Maru outcome="correct" className="text-display" />
            <Maru outcome="review" className="text-display" />
          </div>
        </Spec>
        <Spec label="in a row of results">
          <div className="flex flex-wrap items-center gap-3">
            {(['correct', 'correct', 'review', 'correct', 'review'] as const).map((o, i) => (
              <Maru key={i} outcome={o} className="text-heading-sm" />
            ))}
          </div>
        </Spec>
      </>
    ),
  },
  {
    name: 'AnswerResult',
    blurb:
      'What the learner sees after the app judges. The wording cannot be passed in — that is the component, not a limitation: FillBlankCard and GrammarClozeCard each hand-rolled this and ended up with different words for the same state. The reveal block takes the Ai ground because it holds Japanese.',
    cols: 'c3',
    props: [
      { name: 'outcome', type: "'correct' | 'review'", note: 'AnswerOutcome. Picks the banner colour and the headline — "Correct" or "Not quite".' },
      { name: 'userAnswer', type: 'string', fallback: 'undefined', note: 'Echoed in the banner as "You answered: …". Empty string is treated as absent.' },
      { name: 'children', type: 'ReactNode', note: 'The correct answer, in the caller’s own markup. The frame is this component’s; the content is the card’s.' },
    ],
    specimens: (
      <>
        <Spec label='outcome="correct"'>
          <AnswerResult outcome="correct">
            <p lang="ja" className="font-jp text-jp-lg text-fg">
              お願いします
            </p>
            <p lang="ja" className="font-jp text-jp text-fg-muted">
              おねがいします
            </p>
          </AnswerResult>
        </Spec>
        <Spec label='outcome="review" + userAnswer'>
          <AnswerResult outcome="review" userAnswer="おねがいしします">
            <p lang="ja" className="font-jp text-jp-lg text-fg">
              お願いします
            </p>
            <p lang="ja" className="font-jp text-jp text-fg-muted">
              おねがいします
            </p>
          </AnswerResult>
        </Spec>
        <Spec label="no userAnswer">
          <AnswerResult outcome="review">
            <p lang="ja" className="font-jp text-jp-lg text-fg">
              駅はどこですか
            </p>
            <p className="text-body-sm text-fg-muted">Where is the station?</p>
          </AnswerResult>
        </Spec>
      </>
    ),
  },
  {
    name: 'GradePair',
    blurb:
      'The other half of the vocabulary — the case where the learner grades themselves. Composed by hand, this pair reached for secondary twice, and secondary is Rokushō, the correctness colour, so the ✕ button was a red glyph on a green field. Here the tones are right by construction and the words are not passable. Stacked, because "Worth another look" wraps in half a phone’s width.',
    cols: 'c3',
    props: [
      { name: 'onGrade', type: '(outcome: AnswerOutcome) => void', note: 'Fires with "correct" or "review".' },
      { name: 'disabled', type: 'boolean', fallback: 'false', note: 'Both buttons at once — a grade is one decision.' },
    ],
    specimens: (
      <>
        <Spec label="default">
          <GradePair onGrade={() => {}} />
        </Spec>
        <Spec label="disabled">
          <GradePair onGrade={() => {}} disabled />
        </Spec>
        <Spec label="interactive">
          <_GradePairDemo />
        </Spec>
      </>
    ),
  },
  {
    name: 'ScoreCard',
    blurb:
      'The end of a round. Exactly one tone is allowed to shout: ai is a solid field, because that is the one moment a screen may be emphatic. rokusho was solid too until 2026-08-16 and is now a tint with a 1px rule — it sits directly above the phrase list and a saturated block there won the screen away from the thing being read. No percentages, no grades, no pass/fail.',
    cols: 'c3',
    props: [
      { name: 'correct', type: 'number', note: 'The numerator. Rendered at display size.' },
      { name: 'total', type: 'number', note: 'The denominator, at heading-lg with reduced opacity.' },
      { name: 'label', type: 'string', fallback: "'correct'", note: '"wrong", "incorrect", "failed", "missed", percentages and grades stay banned as a verdict.' },
      { name: 'tone', type: "'plain' | 'rokusho' | 'ai'", fallback: "'plain'", note: 'Warm paper · Rokushō tint with a rule · solid Ai-iro.' },
      { name: 'children', type: 'ReactNode', fallback: 'undefined', note: 'Stacked below the block — this is where the actions go.' },
    ],
    specimens: (
      <>
        <Spec label='tone="plain"'>
          <ScoreCard correct={18} total={25} />
        </Spec>
        <Spec label='tone="rokusho"'>
          <ScoreCard correct={18} total={25} tone="rokusho" />
        </Spec>
        <Spec label='tone="ai"'>
          <ScoreCard correct={18} total={25} tone="ai" />
        </Spec>
        <Spec label="children — the actions">
          <ScoreCard correct={18} total={25} tone="rokusho">
            <Button variant="primary" fullWidth>
              Practice missed (7)
            </Button>
            <Button variant="secondary" fullWidth>
              Done
            </Button>
          </ScoreCard>
        </Spec>
        <Spec label="label · a perfect round">
          <ScoreCard correct={25} total={25} label="recalled first time" tone="ai" />
        </Spec>
      </>
    ),
  },
  {
    name: 'ProgressBar',
    blurb:
      'A hairline track and a Rokushō fill. No numbers, no segments, no colour change at 100% — this is not a gamification element. on-accent exists because the fill measured 1.00:1 against Book One’s own band: on a coloured band it draws in currentColor and inherits the ink the band already chose.',
    cols: 'c2',
    props: [
      { name: 'value', type: 'number', note: '0..1. Anything outside — including NaN and non-numbers — clamps rather than rendering width: NaN%.' },
      { name: 'label', type: 'string', fallback: "'Session progress'", note: 'The aria-label. role="progressbar" with valuemin/max/now.' },
      { name: 'tone', type: "'default' | 'inverse' | 'on-accent'", fallback: "'default'", note: 'Warm track · dark track for the Sumi band · currentColor on a hued band.' },
    ],
    specimens: (
      <>
        <SpecOnPage label="value — 0, 0.25, 0.5, 0.75, 1">
          <div className="flex flex-col gap-4">
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <div key={v} className="flex items-center gap-3">
                <span className="w-10 font-mono text-body-sm text-fg-subtle">
                  {Math.round(v * 100)}%
                </span>
                <div className="flex-1">
                  <ProgressBar value={v} />
                </div>
              </div>
            ))}
          </div>
        </SpecOnPage>
        <Spec label='tone="default" · "inverse" · "on-accent"'>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-bg p-4">
              <p className="mb-2 font-mono text-caption text-fg-subtle">default · on the page</p>
              <ProgressBar value={0.6} />
            </div>
            <div className="rounded-xl bg-inverse p-4">
              <p className="mb-2 font-mono text-caption text-fg-on-inverse-2">
                inverse · on the Sumi band
              </p>
              <ProgressBar value={0.6} tone="inverse" />
            </div>
            <div className="rounded-xl bg-accent-rokusho p-4 text-accent-rokusho-fg">
              <p className="mb-2 font-mono text-caption">on-accent · on a book band</p>
              <ProgressBar value={0.6} tone="on-accent" />
            </div>
            <div className="rounded-xl bg-accent-ai p-4 text-accent-ai-fg">
              <p className="mb-2 font-mono text-caption">on-accent · a darker band</p>
              <ProgressBar value={0.6} tone="on-accent" />
            </div>
          </div>
        </Spec>
      </>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   4 · Layout & state
   ══════════════════════════════════════════════════════════════════════════ */

const LAYOUT: readonly Entry[] = [
  {
    name: 'AppHeader',
    blurb:
      'The one dark slab a screen is allowed. Sumi-iro ground, a 6px Ōgon rule under it, the Akane ア hanko at the left. Capped at max-w-3xl on the header itself, so band and content share one edge. Changing what this renders is a pin-affecting change — ../aburungo re-exports it and pins this repo by sha.',
    cols: 'c2',
    props: [
      { name: 'title', type: 'string', note: 'Centre column, heading-sm on fg-inverse.' },
      { name: 'subtitle', type: 'string', fallback: 'undefined', note: 'Caption line under the title. Empty string is treated as absent.' },
      { name: 'left', type: 'ReactNode', fallback: 'undefined', note: 'Left slot. Supplying it suppresses the hanko.' },
      { name: 'right', type: 'ReactNode', fallback: 'undefined', note: 'Right slot, end-aligned.' },
      { name: 'mark', type: 'boolean', fallback: 'true', note: 'The ア hanko. Ignored when left is supplied.' },
      { name: 'progress', type: 'number', fallback: 'undefined', note: 'Renders a ProgressBar tone="inverse" INSIDE the band — flush below, it reads as one two-tone rule with the Ōgon hairline.' },
    ],
    specimens: (
      <>
        <SpecOnPage label="title only — the hanko shows">
          <AppHeader title="Flashcards" />
        </SpecOnPage>
        <SpecOnPage label="subtitle + progress">
          <AppHeader title="Flashcards" subtitle="Restaurant · 8 of 25" progress={0.32} />
        </SpecOnPage>
        <SpecOnPage label="left + right (left suppresses the mark)">
          <AppHeader
            title="Flashcards"
            left={
              <Button variant="ghost" size="sm">
                Back
              </Button>
            }
            right={
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            }
          />
        </SpecOnPage>
        <SpecOnPage label="icon slots · mark={false}">
          <AppHeader
            title="Practice"
            mark={false}
            right={<AudioButton state="idle" onPress={() => {}} />}
          />
        </SpecOnPage>
      </>
    ),
  },
  {
    name: 'EmptyState',
    blurb:
      'Deliberately quiet. It used to be typographically identical to ErrorState, which meant "nothing due right now" and "couldn’t load this card" looked the same. The fix was to make the error loud, not to make this one louder. Sizes itself with min-h-[30vh], so on a tall harness page it looks emptier than it does on a phone.',
    cols: 'c3',
    props: [
      { name: 'message', type: 'string', note: 'The headline. body, medium weight.' },
      { name: 'description', type: 'string', fallback: 'undefined', note: 'One line of context under it.' },
      { name: 'action', type: 'ReactNode', fallback: 'undefined', note: 'Usually a secondary Button.' },
    ],
    specimens: (
      <>
        <Spec label="message only">
          <EmptyState message="No cards due" />
        </Spec>
        <Spec label="+ description">
          <EmptyState
            message="No cards due"
            description="You're all caught up. Come back tomorrow for your next review."
          />
        </Spec>
        <Spec label="+ action">
          <EmptyState
            message="No feedback yet"
            description="Reports appear here once learners submit them."
            action={
              <Button variant="secondary" size="sm">
                Refresh
              </Button>
            }
          />
        </Spec>
      </>
    ),
  },
  {
    name: 'ErrorState',
    blurb:
      'The signal reads before the words do: a filled Akane triangle — not a circle, because ○ and ✕ already mean something here — over an Akane-toned panel wearing the same roles AnswerResult uses for a miss. The retry action sits OUTSIDE the panel and stays Ai-iro: Akane is never a CTA. The panel is also what lets this sit on a patterned ground.',
    cols: 'c3',
    props: [
      { name: 'message', type: 'string', note: 'heading-sm, semibold, error-fg, inside the panel.' },
      { name: 'description', type: 'string', fallback: 'undefined', note: 'Body text, also inside the panel.' },
      { name: 'action', type: 'ReactNode', fallback: 'undefined', note: 'Rendered below the panel, not in it.' },
    ],
    specimens: (
      <>
        <Spec label="message only">
          <ErrorState message="Something went wrong" />
        </Spec>
        <Spec label="+ description">
          <ErrorState
            message="Couldn't load cards"
            description="Network request failed. Check your connection and try again."
          />
        </Spec>
        <Spec label="+ action (Ai-iro, outside the panel)">
          <ErrorState
            message="Couldn't load cards"
            description="Network request failed."
            action={
              <Button variant="primary" size="sm">
                Try again
              </Button>
            }
          />
        </Spec>
      </>
    ),
  },
  {
    name: 'LoadingPlaceholder',
    blurb:
      'A skeleton of the card that is arriving, chosen over a spinner on 2026-08-17 from the two rendered side by side: the card is the whole screen here, so holding its shape means nothing jumps when content lands. The four bars stagger by 120ms so the group reads as one object filling in. motion-safe gates the pulse — under reduced motion the blocks stop moving but still hold the shape.',
    cols: 'c3',
    props: [
      { name: 'label', type: 'string', fallback: "'Loading…'", note: 'The aria-label on role="status", and the caption under the skeleton.' },
    ],
    specimens: (
      <>
        <Spec label="default">
          <LoadingPlaceholder />
        </Spec>
        <Spec label="label">
          <LoadingPlaceholder label="Checking your connection…" />
        </Spec>
      </>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   5 · Icons
   ══════════════════════════════════════════════════════════════════════════ */

const ICON_ROWS: readonly PropRow[] = [
  { name: 'className', type: 'string', fallback: 'undefined', note: 'Where the size goes — h-5 w-5 at IconButton scale, h-6 w-6 in VoiceInput.' },
  { name: 'viewBox', type: 'string', fallback: "'0 0 24 24'", note: 'Every icon is 24×24. Overridable but there is no reason to.' },
  { name: 'aria-hidden', type: 'boolean', fallback: 'true', note: 'The label belongs on the wrapping IconButton.' },
  { name: '…rest', type: 'SVGProps<SVGSVGElement>', fallback: '—', note: 'IconBaseProps is exactly SVGProps<SVGSVGElement>. fill is currentColor on the path.' },
]

function IconSpec({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="ds-spec">
      <div className="ds-cap">{name}</div>
      <div className="ds-demo ds-iconrow">
        <span className="text-fg">{children}</span>
      </div>
    </div>
  )
}

const ICONS: readonly Entry[] = [
  {
    name: 'SpeakerIcon, MicIcon, BackspaceIcon, SpinnerIcon',
    also: ['type IconBaseProps'],
    blurb:
      'No icon font, no icon library — four inline 24×24 filled paths on currentColor, aria-hidden, sized by the caller. Filled only: outline icons are not part of this system, and neither is emoji. AlertIcon exists in src/components/icons.tsx and is deliberately NOT a public export — ErrorState is its only consumer.',
    cols: 'c4',
    props: ICON_ROWS,
    specimens: (
      <>
        <IconSpec name="SpeakerIcon">
          <SpeakerIcon className="h-8 w-8" />
        </IconSpec>
        <IconSpec name="MicIcon">
          <MicIcon className="h-8 w-8" />
        </IconSpec>
        <IconSpec name="BackspaceIcon">
          <BackspaceIcon className="h-8 w-8" />
        </IconSpec>
        <IconSpec name="SpinnerIcon">
          <SpinnerIcon className="h-8 w-8 animate-spin" />
        </IconSpec>
        <Spec label="sized by className — 16 / 20 / 24 / 32">
          <div className="flex items-center gap-4 text-fg">
            <SpeakerIcon className="h-4 w-4" />
            <SpeakerIcon className="h-5 w-5" />
            <SpeakerIcon className="h-6 w-6" />
            <SpeakerIcon className="h-8 w-8" />
          </div>
        </Spec>
        <Spec label="currentColor — they take the ink around them">
          <div className="flex items-center gap-4">
            <MicIcon className="h-6 w-6 text-fg" />
            <MicIcon className="h-6 w-6 text-fg-heading" />
            <MicIcon className="h-6 w-6 text-error-fg" />
            <MicIcon className="h-6 w-6 text-success-fg" />
            <span className="rounded-lg bg-inverse p-2">
              <MicIcon className="h-6 w-6 text-fg-inverse" />
            </span>
          </div>
        </Spec>
      </>
    ),
  },
]

/* ══════════════════════════════════════════════════════════════════════════
   6 · Absent — drawn, not described.
   ══════════════════════════════════════════════════════════════════════════ */

type Absent = {
  name: string
  why: string
  today: string
  sketch: ReactNode
}

const ABSENT: readonly Absent[] = [
  {
    name: 'Navigation / TabBar',
    why: 'There is no way to move between sections. Every screen this system has drawn is a single column with a header on top and no way back out of it.',
    today: 'AppHeader takes left and right nodes and each screen hand-builds its own back button.',
    sketch: (
      <div className="ds-sk ds-sk-tabbar">
        <span>Books</span>
        <span>Practice</span>
        <span>Kana</span>
        <span>You</span>
      </div>
    ),
  },
  {
    name: 'List / ListItem',
    why: 'A lesson list, a chapter list and a phrase list are the three most repeated shapes in the flows, and each is composed by hand from Card + flex.',
    today: 'Card compact plus a hand-written row in each flow. The chapter row exists three times in three files.',
    sketch: (
      <div className="ds-sk ds-sk-list">
        <div>
          <b>Lesson 1</b>
          <span>›</span>
        </div>
        <div>
          <b>Lesson 2</b>
          <span>›</span>
        </div>
        <div>
          <b>Lesson 3</b>
          <span>›</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Modal / Sheet',
    why: 'Nothing in the package can interrupt. Confirming a reset, picking a book, or showing settings has no container and no focus trap.',
    today: 'Nothing. The FillInput IME hint is an inline expander because there is no sheet to put it in.',
    sketch: (
      <div className="ds-sk ds-sk-sheet">
        <div className="ds-sk-scrim" />
        <div className="ds-sk-panel">
          <span className="ds-sk-grab" />
          Sheet
        </div>
      </div>
    ),
  },
  {
    name: 'Tabs / Segmented',
    why: 'preview/18-segmented.html draws the control and nothing exports it. FillInput has a real three-way segmented picker built inline, which means the one implementation is locked inside one component.',
    today: 'FillInput’s mode picker, and KanaKeyboard’s script/section toggles. Two different treatments of one idea.',
    sketch: (
      <div className="ds-sk ds-sk-seg">
        <span className="on">Romaji</span>
        <span>Kana</span>
        <span>JP</span>
      </div>
    ),
  },
  {
    name: 'Figure / Illustration',
    why: 'DESIGN.md has an illustration voice and docs/illustration-prompt.md has a brief, and there is no component that places an image with a caption, an aspect ratio, or a loading state.',
    today: 'Raw <img> where a flow needs one. No crest, tile or figure slot in the package.',
    sketch: (
      <div className="ds-sk ds-sk-figure">
        <div className="ds-sk-frame" />
        <span>caption</span>
      </div>
    ),
  },
  {
    name: 'Toast',
    why: 'Nothing can report a background outcome — "answer saved", "offline, will sync". Every message in this system is blocking and in-flow.',
    today: 'Nothing. AnswerResult and ErrorState both occupy the layout.',
    sketch: (
      <div className="ds-sk ds-sk-toast">
        <span>Saved</span>
      </div>
    ),
  },
  {
    name: 'Tooltip',
    why: 'Deliberate, and worth keeping deliberate: CLAUDE.md bans hover-only affordances and a tooltip is the canonical one. If a hint is needed on touch it should be a hint line or a sheet.',
    today: 'TextInput hint, FillInput’s toggled IME hint. Both persistent, both tappable.',
    sketch: (
      <div className="ds-sk ds-sk-tip">
        <span className="ds-sk-bub">hover-only</span>
        <span className="ds-sk-x">✕ banned</span>
      </div>
    ),
  },
  {
    name: 'Avatar',
    why: 'There is no social surface and no profile screen, so there is nothing for an avatar to identify. Absent by design, not by omission.',
    today: 'Nothing, and nothing needs it. The ア hanko is the only identity mark and it is the product’s, not a user’s.',
    sketch: (
      <div className="ds-sk ds-sk-avatar">
        <span />
        <span />
        <span />
      </div>
    ),
  },
  {
    name: 'Divider',
    why: 'Every rule in the flows is a bare <hr className="border-border"> or a border utility. Trivial, but it is the reason three surfaces have three different rule weights.',
    today: 'PhraseCard and the flip faces each write their own <hr>.',
    sketch: (
      <div className="ds-sk ds-sk-divider">
        <span />
        <b>or</b>
        <span />
      </div>
    ),
  },
  {
    name: 'Link',
    why: 'The link role token exists — Rokushō darkened, because 500 fails AA as text — and no component wears it. Every anchor in the harnesses picks its own colour.',
    today: 'Raw <a> with a hand-picked class. The token is defined and unworn.',
    sketch: (
      <div className="ds-sk ds-sk-link">
        <span>a link</span>
        <span className="ds-sk-tok">--color-link</span>
      </div>
    ),
  },
]

function AbsentBlock() {
  return (
    <section className="ds-section" id="g-6">
      <h2 className="ds-h2">
        <span className="ds-n">6</span>
        Absent
        <span className="ds-st gap">{ABSENT.length} missing</span>
      </h2>
      <p className="ds-note">
        What a product of this shape normally ships and this one does not. Drawn rather than
        listed, because a gap you can see is a finding and a gap in a paragraph is a note nobody
        reads. Two of these — Tooltip and Avatar — are absent on purpose and should stay that way;
        the other eight are work that has not happened yet.
      </p>
      <div className="ds-grid c3">
        {ABSENT.map((a) => (
          <div key={a.name} className="ds-spec ds-absent">
            <div className="ds-cap">{a.name}</div>
            <div className="ds-demo">{a.sketch}</div>
            <p className="ds-absent-why">{a.why}</p>
            <p className="ds-absent-today">
              <b>Today:</b> {a.today}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   The page
   ══════════════════════════════════════════════════════════════════════════ */

const GROUPS: readonly GroupDef[] = [
  {
    n: 1,
    exports: 8,
    title: 'Primitives',
    note: 'The five things everything else is built out of. Every interactive one clears the 44px touch floor in every size it offers, and every one has a press state rather than a hover state.',
    entries: PRIMITIVES,
  },
  {
    n: 2,
    exports: 7,
    title: 'Domain',
    note: 'The components that know what this product is: a phrase, a flip, kana entry, a voice attempt, a sound. All presentational — none of them owns audio, a recogniser, or a scheduler.',
    entries: DOMAIN,
  },
  {
    n: 3,
    exports: 5,
    title: 'Correctness vocabulary',
    note: 'One set of marks, one set of words, one set of colours for "you got it" and "not yet". The wording is deliberately not passable in AnswerResult or GradePair: two screens hand-rolling this is exactly how the product ended up with two vocabularies for one state.',
    entries: CORRECTNESS,
  },
  {
    n: 4,
    exports: 4,
    title: 'Layout & state',
    note: 'The chrome, and the three things a screen does when it has no content: waiting, empty, broken. Empty and error are deliberately not interchangeable — that is the whole reason ErrorState exists separately.',
    entries: LAYOUT,
  },
  {
    n: 5,
    exports: 4,
    title: 'Icons',
    note: 'Four public icons. Filled, inline, 24×24, currentColor. No icon font, no outline set, no emoji anywhere in the product.',
    entries: ICONS,
  },
]

function JumpNav() {
  return (
    <nav className="ds-jump" aria-label="Sections">
      {GROUPS.map((g) => (
        <a key={g.n} href={`#g-${g.n}`}>
          <span className="ds-n">{g.n}</span>
          {g.title}
        </a>
      ))}
      <a href="#g-6" className="absent">
        <span className="ds-n">6</span>
        Absent
      </a>
    </nav>
  )
}

export function ComponentsPage() {
  return (
    <>
      <JumpNav />
      {GROUPS.map((g) => (
        <GroupBlock key={g.n} group={g} />
      ))}
      <AbsentBlock />
    </>
  )
}

/**
 * Mount. This file is the bundler entry — `scripts/build-flows.mjs` maps
 * `preview/ds/components.tsx` → `preview/ds/bundle.js`, so there is no
 * separate `main.tsx` the way the storybook has one. The page chrome (top bar,
 * title, lede) is static HTML in `components.html`; React owns `#root` and
 * everything below it.
 */
const host = document.getElementById('root')
if (host === null) throw new Error('ds/components: no #root in the host page')

createRoot(host).render(
  <StrictMode>
    <ComponentsPage />
  </StrictMode>,
)
