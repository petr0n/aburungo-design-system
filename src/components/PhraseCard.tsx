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
import { Badge } from './ui/Badge'

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
}

export function PhraseCard(props: PhraseCardProps) {
  const { japanese, reading, english, scenario, audioSlot, footer, notes } = props

  return (
    <Card>
      <div className="flex flex-col gap-6">
        <CardHeader>
          {scenario !== undefined ? (
            <Badge emphasis>{scenario}</Badge>
          ) : (
            <span aria-hidden="true" />
          )}
          {audioSlot ?? null}
        </CardHeader>

        <CardBody className="items-center text-center">
          <p
            lang="ja"
            className="font-jp text-jp-display text-fg sm:text-jp-display-lg"
          >
            {japanese}
          </p>
          <p lang="ja" className="font-jp text-jp text-fg-muted">
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
