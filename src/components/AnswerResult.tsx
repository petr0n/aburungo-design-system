/**
 * AnswerResult — what a learner sees after the app checks an answer.
 *
 * A quiet reveal: neutral ground, the correct answer, and a Maru carrying the
 * outcome.  Deliberately not an error banner — the coloured wash reads as a
 * verdict, and the app does not tell a learner they failed.
 *
 * The outcome is a named state rather than a boolean so that `correct ? … : …`
 * never appears at a call site.  That ternary is how two consumers ended up
 * disagreeing about the wording; there is now nowhere to put the words.
 *
 * Content is `children` because callers render Japanese, readings, and polite
 * forms in shapes this component has no reason to know about.  It owns the
 * frame; the card owns the card.
 */
import type { ReactNode } from 'react'
import { Maru } from './Maru'
import type { AnswerOutcome } from './Maru'

type AnswerResultProps = {
  outcome: AnswerOutcome
  /** What the learner typed.  Rendered muted beneath the answer when passed. */
  userAnswer?: string
  /** The correct answer — the consumer's own markup. */
  children: ReactNode
}

export function AnswerResult({ outcome, userAnswer, children }: AnswerResultProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 p-4 text-center">
      <div className="flex items-center gap-2">
        <Maru outcome={outcome} className="text-heading-sm" />
        <div className="flex flex-col items-center gap-1">{children}</div>
      </div>

      {userAnswer !== undefined && userAnswer !== '' && (
        <p className="mt-1 text-body-sm text-fg-subtle">
          you typed: <span className="font-jp">{userAnswer}</span>
        </p>
      )}
    </div>
  )
}
