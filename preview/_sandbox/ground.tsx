/**
 * ground — the crest question, on the real screens.
 *
 * This lab was a hand-written static mirror until the review on PR #51 caught
 * it twice: the romaji sublabel was off the type ramp, and the chart stopped
 * at `や` so the grid was four rows short and the crest-to-content ratio was
 * materially understated. Both variants were then being used to argue a
 * decision about composition.
 *
 * A mirror that is wrong about the thing being judged makes the comparison
 * worthless, so this imports `src/components` and `src/lib` like
 * `preview/ds/`, `storybook/` and the two `ui_kits/` harnesses do. It renders
 * the WHOLE screen each time — every sibling around the component, not the
 * component alone — because the review's other finding was that the siblings
 * are where the real question lives.
 */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AppHeader,
  AudioButton,
  Button,
  KanaGrid,
  KanaKeyboard,
} from '../../src/components'
import type { KanaScript } from '../../src/components'
import { HIRAGANA_BASIC, KANA_PRACTICE_CARDS } from '../../src/lib'

/** kana → romaji, exactly as `ui_kits/flows/kana-practice.tsx` builds it. */
const ROMAJI = new Map(KANA_PRACTICE_CARDS.map((c) => [c.kana, c.romaji]))

/** All ten rows, from the shipped data. The hand mirror had seven. */
const CHART_ROWS = HIRAGANA_BASIC.map((row) =>
  row.map((kana) => (kana === null ? null : { kana, romaji: ROMAJI.get(kana) ?? '' })),
)

const LEARNED = new Set([
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'た', 'ち',
])

/** `PatternedStage`'s ground, verbatim from ui_kits/flows/shell.tsx. */
const CREST = 'emboss-bg crest-1 tile-sm'

type Ground = 'bare' | 'crest'

/**
 * The phone shell. Deliberately not a mirror of a component — `ui_kits`'
 * device chrome is harness furniture, and the band here is only present so
 * the Ōgon hairline and the Sumi-iro slab are in the frame where they affect
 * the judgement.
 */
function Phone(props: { title: string; subtitle: string; progress: number; ground: Ground; children: React.ReactNode }) {
  const { title, subtitle, progress, ground, children } = props
  return (
    <div className="flex h-[720px] w-[390px] shrink-0 flex-col overflow-hidden rounded-xl border border-stone-300 bg-bg">
      <AppHeader title={title} subtitle={subtitle} progress={progress} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div
          className={`flex flex-1 flex-col gap-5 px-4 pb-8 pt-5 ${ground === 'crest' ? CREST : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * The complete chart screen — the script toggle, the audio button, the
 * legend, the grid and the CTA.
 *
 * `legend` is the whole reason this lab was rebuilt. The shipped legend is
 * `text-fg-subtle` sitting directly on the page ground. `fg-subtle` over the
 * crest measures **3.47:1**, which `scripts/check-contrast.mjs` records as
 * barred by the legibility rule rather than tracked as a failure — no opacity
 * that leaves the pattern visible can carry it. So the crest cannot simply be
 * switched on under this screen; the legend has to move first.
 */
function ChartScreen(props: { ground: Ground; legend: 'subtle' | 'muted' }) {
  const { ground, legend } = props
  const [script, setScript] = useState<'hiragana' | 'katakana'>('hiragana')

  return (
    <Phone title="Kana" subtitle="15 of 46 settled" progress={15 / 46} ground={ground}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScript(s)}
              aria-pressed={script === s}
              className={[
                'min-h-[44px] rounded-lg px-4 text-body-sm font-medium transition-colors',
                script === s ? 'bg-action text-action-fg' : 'text-fg-subtle active:bg-surface-2',
              ].join(' ')}
            >
              {s === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </button>
          ))}
        </div>
        <AudioButton state="idle" onPress={() => undefined} label="Replay the last kana" />
      </div>

      {/* THE CONTESTED LINE. Bare on the ground in both variants. */}
      <div
        className={`flex items-center gap-2 text-body-sm ${legend === 'subtle' ? 'text-fg-subtle' : 'text-fg-muted'}`}
      >
        <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded ring-2 ring-inset ring-progress-fill" />
        Settled — tap any character to hear it
      </div>

      <KanaGrid
        rows={CHART_ROWS}
        learned={LEARNED}
        onSelect={() => undefined}
        renderKey={(cell) => (
          <>
            <span className="leading-none">{cell.kana}</span>
            <span className="font-sans text-caption leading-none text-fg-faint">{cell.romaji}</span>
          </>
        )}
      />

      <div className="sticky bottom-0 -mx-4 -mb-8 bg-bg px-4 pb-8 pt-3">
        <Button fullWidth onClick={() => undefined}>
          Practise these
        </Button>
      </div>
    </Phone>
  )
}

/**
 * The complete keyboard screen — the prompt card, the answer field, the pad
 * and the submit button.
 *
 * Every one of those is an opaque container: `bg-accent-ai-bg`, `bg-surface`,
 * `bg-keyboard-bg`, and the button. Nothing on this screen puts text on the
 * ground, which is what makes it a different question from the chart.
 */
function KeyboardScreen(props: { ground: Ground }) {
  const { ground } = props
  const [value, setValue] = useState('')
  const [script, setScript] = useState<KanaScript>('hiragana')

  return (
    <Phone title="Kana practice" subtitle="write it · 2 of 4" progress={0.25} ground={ground}>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-accent-ai-bg p-6 shadow-card">
        <p className="text-body-sm text-fg-subtle">Write the kana for</p>
        <p className="text-heading font-semibold text-fg">nu</p>
      </div>

      <div
        lang="ja"
        className="flex min-h-14 items-center rounded-xl border-2 border-border-strong bg-surface px-4 py-3 font-jp text-jp-lg text-fg-heading"
      >
        {value !== '' ? value : <span className="font-sans text-body text-fg-faint">Tap the keys below</span>}
      </div>

      <KanaKeyboard
        script={script}
        value={value}
        onScriptChange={setScript}
        onReplaceLast={(k) => setValue([...value].slice(0, -1).join('') + k)}
        onKey={(k) => setValue(value + k)}
        onBackspace={() => setValue([...value].slice(0, -1).join(''))}
      />

      <Button fullWidth disabled={value === ''} onClick={() => undefined}>
        Check
      </Button>
    </Phone>
  )
}

function Tag(props: { kind: 'ships' | 'prop' | 'blocked'; children: React.ReactNode }) {
  const { kind, children } = props
  const tone =
    kind === 'ships'
      ? 'bg-stone-100 text-fg-muted'
      : kind === 'prop'
        ? 'bg-rokusho-100 text-rokusho-800'
        : 'bg-akane-100 text-akane-800'
  return (
    <span className={`inline-block self-start rounded-sm px-2 py-0.5 text-caption font-semibold uppercase tracking-wider ${tone}`}>
      {children}
    </span>
  )
}

function Col(props: { tag: 'ships' | 'prop' | 'blocked'; tagText: string; head: string; sub: string; children: React.ReactNode }) {
  const { tag, tagText, head, sub, children } = props
  return (
    <div className="flex w-[390px] shrink-0 flex-col gap-2">
      <Tag kind={tag}>{tagText}</Tag>
      <p className="text-body-sm font-semibold">{head}</p>
      <p className="min-h-[9em] text-caption leading-relaxed text-fg-muted">{sub}</p>
      {children}
    </div>
  )
}

function Lab() {
  return (
    <>
      <h2 className="mb-2 mt-8 text-body font-semibold">Kana chart — the whole screen</h2>
      <div className="flex flex-wrap gap-6">
        <Col
          tag="ships"
          tagText="Ships today"
          head="A · Bare"
          sub="The rule as written. Note what sits on the ground beside the grid: the script toggle and audio button (both opaque) and the settled legend, which is not."
        >
          <ChartScreen ground="bare" legend="subtle" />
        </Col>
        <Col
          tag="blocked"
          tagText="Blocked"
          head="B · Crest, legend unchanged"
          sub="The naive version, and the one the first draft recommended. Two things break. The legend is text-fg-subtle on the pattern — 3.47:1, a combination brand.css bars outright. And the CTA has stopped being pinned: .emboss-bg sets overflow:hidden and forces position:relative on every direct child, so the sticky footer shipped in #52 silently reverts and the button falls below the fold again. Kept as the record of why B is not a one-line change."
        >
          <ChartScreen ground="crest" legend="subtle" />
        </Col>
        <Col
          tag="prop"
          tagText="Proposed"
          head="B′ · Crest, legend at fg-muted"
          sub="The legend fixed, the CTA still broken. fg-muted over a pattern is already gated at 4.57:1, so that half costs one class — no glass, no token change, no new API, and nothing flattens because the legend is a standalone line rather than a description under a message. The unpinned CTA is not fixable in CSS: overflow:hidden defeats sticky whatever the position rule says, so pinned chrome has to stop being a child of the patterned stage."
        >
          <ChartScreen ground="crest" legend="muted" />
        </Col>
      </div>

      <h2 className="mb-2 mt-10 text-body font-semibold">Kana keyboard — the whole screen</h2>
      <div className="flex flex-wrap gap-6">
        <Col
          tag="ships"
          tagText="Ships today"
          head="C · Bare"
          sub="Prompt card, answer field, pad, submit. Four elements, every one of them an opaque container."
        >
          <KeyboardScreen ground="bare" />
        </Col>
        <Col
          tag="prop"
          tagText="Proposed"
          head="D · Crest"
          sub="Nothing on this screen puts text on the ground, so no contrast question arises and none of B's problem applies here. What is left is purely compositional: how much crest is still visible once the prompt card and the answer field are in the frame."
        >
          <KeyboardScreen ground="crest" />
        </Col>
      </div>
    </>
  )
}

const el = document.getElementById('root')
if (el !== null) {
  createRoot(el).render(
    <StrictMode>
      <Lab />
    </StrictMode>,
  )
}
