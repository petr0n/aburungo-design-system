/**
 * Lesson list — Phase 3B, the scenario card.
 *
 * The plan poses 3B as a fork: build a component for the crest ground, or
 * record that the utility stays ad-hoc. This flow is how that gets answered.
 * `CLAUDE.md` treats anything new as speculative until a flow or a real
 * consumer proves it missing, and there is no consumer yet — the app renders
 * no lesson grid and uses `emboss-bg` nowhere. So the composition is built
 * here, out of shipped components plus the two brand utilities, and gets
 * promoted only if it turns out to repeat.
 *
 * Treatment C, chosen 2026-08-16 from three rendered options in
 * `preview/_sandbox/scenario-1-card.html`, with the glass from
 * `scenario-4-glass-cards.html`:
 *
 *   - the crest grounds the whole list, not each card;
 *   - each card is a `.glass` pane, so the texture reads *through* it. That is
 *     what fixed C's original flaw — with opaque cards the pattern was paid
 *     for and then hidden;
 *   - the accent rule carries which scenario it is, the rule `PhraseCard`
 *     already follows: colour says *which*, it does not decorate.
 *
 * Measured on this composition rather than inherited from the empty state:
 * title 9.73:1, canDo 6.57:1, meta 4.90:1. The meta line is the tight one, so
 * `fg-faint` would fail here — a dimmer line needs measuring, not assuming.
 *
 * Content shape is the app's, from `src/content/lessons/*.yaml` on
 * `feature/chapters-and-lessons`: situation, title, canDo.
 */
import { useState } from 'react'
import { AppHeader, Button, EmptyState, ErrorState, LoadingPlaceholder } from '../../src/components'
import { FlowPage, PatternedStage, Phone, Screen, fromUrl } from './shell'

type Accent = 'rokusho' | 'ogon' | 'ai' | 'akane'

type Lesson = {
  situation: keyof typeof SITUATION_ACCENT
  title: string
  canDo: string
  phrases: number
  settled: number
}

/**
 * The accent is derived from the situation, not stored per lesson — the whole
 * point is that colour says *which scenario*, so two lessons in one situation
 * must land on the same colour. A map keeps that true by construction.
 */
const SITUATION_ACCENT = {
  'Greetings & basics': 'rokusho',
  'Food & drink': 'ogon',
  'Getting around': 'ai',
  Emergency: 'akane',
} as const satisfies Record<string, Accent>

const LESSONS: Lesson[] = [
  { situation: 'Greetings & basics', title: 'Where are you from?', canDo: 'Introduce yourself', phrases: 8, settled: 3 },
  { situation: 'Food & drink', title: 'At the café', canDo: 'Order a drink', phrases: 11, settled: 0 },
  { situation: 'Getting around', title: 'At the station', canDo: 'Buy a train ticket', phrases: 9, settled: 0 },
  { situation: 'Emergency', title: 'Help, please', canDo: 'Ask for help', phrases: 6, settled: 0 },
  // Second lesson in an existing situation -- proves the accent follows the
  // situation rather than the row, which is the whole point of the mapping.
  { situation: 'Food & drink', title: 'Paying the bill', canDo: 'Ask for the check', phrases: 7, settled: 0 },
]

/**
 * `bg-accent-<hue>` with `text-accent-<hue>-fg` — the pair the accent set is
 * designed as. Rokusho's `-fg` was warm paper at 3.19:1 until 2026-08-16 and
 * is `stone-900` now; all four pairs are gated in `check-contrast.mjs`.
 */
const TAG: Record<Accent, string> = {
  rokusho: 'bg-accent-rokusho text-accent-rokusho-fg',
  ogon: 'bg-accent-ogon text-accent-ogon-fg',
  ai: 'bg-accent-ai text-accent-ai-fg',
  akane: 'bg-accent-akane text-accent-akane-fg',
}

/**
 * `.glass.rule-<hue>` from brand.css, not a Tailwind border utility. `.glass`
 * sets a full 2px rim, and a top-edge utility loses to that shorthand -- it
 * renders nothing, silently. See the note beside these classes in brand.css.
 */
const RULE: Record<Accent, string> = {
  rokusho: 'rule-rokusho',
  ogon: 'rule-ogon',
  ai: 'rule-ai',
  akane: 'rule-akane',
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const { situation, title, canDo, phrases, settled } = lesson
  const accent = SITUATION_ACCENT[situation]
  return (
    <button
      type="button"
      // `.glass` brings its own radius, border and shadow; `rule-<hue>` swaps
      // only the top edge, so the pane keeps its lit rim on the other three.
      className={[
        'glass block w-full text-left',
        RULE[accent],
        'px-3.5 py-3',
        'active:brightness-[.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      ].join(' ')}
    >
      <span
        className={`inline-flex items-center rounded-sm px-2 py-0.5 text-caption font-bold uppercase tracking-wider ${TAG[accent]}`}
      >
        {situation}
      </span>
      <span className="mt-2 block text-body-lg font-semibold text-fg-heading">{title}</span>
      <span className="block text-body-sm text-fg-muted">{canDo}</span>
      <span className="mt-1.5 block text-caption text-fg-subtle">
        {phrases} phrases &middot; {settled > 0 ? `${settled} settled` : 'not started'}
      </span>
    </button>
  )
}

const STATES = [
  { id: 'list', label: 'List', note: 'the scenario cards on the crest ground' },
  { id: 'loading', label: 'Loading', note: 'lessons being fetched' },
  { id: 'empty', label: 'Empty', note: 'no chapter picked yet' },
  { id: 'error', label: 'Error', note: 'load failed, progress intact' },
] as const

type StateId = (typeof STATES)[number]['id']

export function LessonList() {
  const [state, setState] = useState<StateId>(
    fromUrl(
      'state',
      STATES.map((s) => s.id),
      'list',
    ),
  )

  return (
    <FlowPage
      title="Lesson list"
      blurb="Phase 3B's scenario card, treatment C: the crest grounds the whole list and every lesson is a glass pane over it, so the texture reads through rather than being covered. The accent says which situation — the rule PhraseCard already follows."
      states={STATES}
      current={state}
      onSelect={setState}
    >
      <Phone>
        <AppHeader title="Lessons" />
        <Screen>
          {state === 'list' && (
            <PatternedStage>
              {LESSONS.map((lesson) => (
                <LessonCard key={lesson.title} lesson={lesson} />
              ))}
            </PatternedStage>
          )}
          {state === 'loading' && <LoadingPlaceholder label="Loading lessons…" />}
          {state === 'empty' && (
            <PatternedStage>
              <div className="glass">
                <EmptyState
                  message="No lessons yet"
                  description="Pick a chapter to get started. Your progress is saved as you go."
                />
              </div>
            </PatternedStage>
          )}
          {state === 'error' && (
            <ErrorState
              message="Couldn't load your lessons"
              description="Your progress is saved. This is usually the connection."
              action={
                <Button variant="primary" onClick={() => setState('list')}>
                  Try again
                </Button>
              }
            />
          )}
        </Screen>
      </Phone>
    </FlowPage>
  )
}
