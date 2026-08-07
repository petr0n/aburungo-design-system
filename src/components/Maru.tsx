/**
 * Maru — the correctness mark.  ○ recalled, ✕ worth another look.
 *
 * In Japanese schooling ○ (maru) means correct and ✕ (batsu) means incorrect —
 * not a checkmark and a cross.  This is the only place either glyph is defined;
 * anything marking an answer imports it from here rather than typing a literal.
 *
 * The mark carries the judgement so the surrounding copy does not have to.  See
 * the assessment rules: per-answer marks are permitted, verdict prose is not.
 */
import type { HTMLAttributes } from 'react'

export type AnswerOutcome = 'recalled' | 'review'

type MaruProps = Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'> & {
  outcome: AnswerOutcome
  /** Visually-hidden label.  Defaults to the approved wording for the outcome. */
  label?: string
  className?: string
}

const GLYPH: Record<AnswerOutcome, string> = {
  recalled: '○',
  review:   '✕',
}

const OUTCOME_CLASSES: Record<AnswerOutcome, string> = {
  recalled: 'text-success-500',
  review:   'text-error-500',
}

/** Approved wording — the only words that may describe an outcome. */
const DEFAULT_LABEL: Record<AnswerOutcome, string> = {
  recalled: 'recalled',
  review:   'worth another look',
}

export function Maru(props: MaruProps) {
  const { outcome, label, className, ...rest } = props

  const classes = [
    'inline-flex shrink-0 items-center justify-center leading-none',
    OUTCOME_CLASSES[outcome],
    className ?? '',
  ].filter((c) => c !== '').join(' ')

  return (
    <span className={classes} {...rest}>
      <span aria-hidden="true">{GLYPH[outcome]}</span>
      <span className="sr-only">{label ?? DEFAULT_LABEL[outcome]}</span>
    </span>
  )
}
