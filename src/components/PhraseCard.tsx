/**
 * PhraseCard — the central content unit.  Used on flashcard and fill-in-
 * the-blank screens.  Renders Japanese + reading + English.
 *
 * Reading is rendered as a separate line below the Japanese (not furigana
 * over individual kanji), because the app does not yet have a kana
 * tokeniser — switching to inline <ruby> needs segmented authoring.
 *
 * The English line can be optional (e.g. while the learner attempts to
 * recall it).  Caller controls reveal state.
 */
import type { ReactNode } from 'react'
import { Card, CardBody, CardHeader } from './ui/Card'

/**
 * The card's accent — top rule and scenario tag.
 *
 * Deliberately an input rather than a locked colour, so it can carry meaning:
 * a scenario category, a state, a unit. `akane` is available but also signals
 * errors elsewhere, so reach for it where that overlap is worth it.
 */
export type PhraseAccent = 'ogon' | 'ai' | 'rokusho' | 'akane' | 'none'

const RULE: Record<PhraseAccent, string> = {
  ogon:    'border-t-[3px] border-t-accent-ogon',
  ai:      'border-t-[3px] border-t-accent-ai',
  rokusho: 'border-t-[3px] border-t-accent-rokusho',
  akane:   'border-t-[3px] border-t-accent-akane',
  none:    '',
}

const TAG: Record<PhraseAccent, string> = {
  ogon:    'bg-accent-ogon text-accent-ogon-fg',
  ai:      'bg-accent-ai text-accent-ai-fg',
  rokusho: 'bg-accent-rokusho text-accent-rokusho-fg',
  akane:   'bg-accent-akane text-accent-akane-fg',
  none:    'bg-tag-bg text-tag-fg',
}

type PhraseCardProps = {
  /** Native form, may contain kanji.  e.g. "駅はどこですか" */
  japanese: string
  /** Hiragana-only reading. Rendered below as a separate line. */
  reading: string
  /** Natural English translation.  Hide while learner is recalling. */
  english?: string
  /** Real-world situation — renders as a small uppercase badge. */
  scenario?: string
  /** Optional slot for AudioButton, in the card header. */
  audioSlot?: ReactNode
  /** Optional bottom-row content (rating buttons, "Show answer", etc). */
  footer?: ReactNode
  /** Optional authoring note shown below the English line. */
  notes?: string
  /** Top rule + scenario tag colour. Defaults to Ōgon. */
  accent?: PhraseAccent
}

export function PhraseCard(props: PhraseCardProps) {
  const { japanese, reading, english, scenario, audioSlot, footer, notes, accent = 'ogon' } = props

  return (
    <Card className={RULE[accent]}>
      <div className="flex flex-col gap-6">
        <CardHeader>
          {scenario !== undefined ? (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wider ${TAG[accent]}`}
            >
              {scenario}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {audioSlot ?? null}
        </CardHeader>

        <CardBody className="items-center text-center">
          <p
            lang="ja"
            className="font-jp text-jp-display text-fg-heading sm:text-jp-display-lg"
          >
            {japanese}
          </p>
          <p lang="ja" className="font-jp text-jp text-action-2-fg">
            {reading}
          </p>
        </CardBody>

        {english !== undefined ? (
          <>
            <hr className="border-border" />
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-body-lg text-fg">{english}</p>
              {notes !== undefined ? (
                <p className="text-body-sm text-fg-subtle">{notes}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {footer !== undefined ? footer : null}
      </div>
    </Card>
  )
}
