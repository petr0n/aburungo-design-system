/**
 * AnswerResult — what a learner sees after the app checks an answer.
 *
 * A tinted banner carrying the outcome, above a neutral block revealing the
 * correct answer.  Both halves used to be hand-rolled in FillBlankCard and
 * GrammarClozeCard, which is how the two ended up with different wording for
 * the same state — one said "Not quite", the other "Worth another look".
 *
 * The wording now lives here and cannot be passed in.  That is the whole point
 * of the component: there is nowhere for a call site to put its own words, so
 * the approved vocabulary cannot drift again.
 *
 * The outcome is a named state rather than a boolean for the same reason — a
 * boolean invites `correct ? … : …` at the call site, which is where the two
 * vocabularies came from.
 *
 * Content is `children` because callers render Japanese, readings, and polite
 * forms in shapes this component has no reason to know about.  It owns the
 * frame; the card owns the card.
 */
import type { ReactNode } from 'react'
import type { AnswerOutcome } from './Maru'

type AnswerResultProps = {
  outcome: AnswerOutcome
  /** What the learner typed.  Shown in the banner when passed. */
  userAnswer?: string
  /** The correct answer — the consumer's own markup. */
  children: ReactNode
}

const BANNER_CLASSES: Record<AnswerOutcome, string> = {
  recalled: 'bg-success-bg border border-success-border',
  review:   'bg-error-bg border border-error-border',
}

const TEXT_CLASSES: Record<AnswerOutcome, string> = {
  recalled: 'text-success-fg',
  review:   'text-error-fg',
}

/**
 * Approved wording.  Not overridable — see the note above.
 *
 * "Not quite" over "Worth another look" is deliberate: the softer phrase reads
 * as ambiguous at the moment an answer is judged, and a learner should not have
 * to work out whether they got it right.  The gentle framing lives in what
 * happens next — the word resurfaces sooner — not in hedged wording here.
 */
const HEADLINE: Record<AnswerOutcome, string> = {
  recalled: 'Recalled!',
  review:   'Not quite',
}

export function AnswerResult({ outcome, userAnswer, children }: AnswerResultProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-xl p-4 text-center ${BANNER_CLASSES[outcome]}`}>
        <p className={`text-heading-sm font-semibold ${TEXT_CLASSES[outcome]}`}>
          {HEADLINE[outcome]}
        </p>
        {userAnswer !== undefined && userAnswer !== '' && (
          <p className={`mt-1 font-jp text-body-sm ${TEXT_CLASSES[outcome]}`}>
            You answered: {userAnswer}
          </p>
        )}
      </div>

      {/* The reveal takes the Ai ground the phrase card uses. It holds the
          Japanese, and Ai-iro is the Japanese-content colour — on `surface-2`
          it was the last flat grey field left on a screen of coloured ones. */}
      <div className="flex flex-col items-center gap-1 rounded-xl bg-accent-ai-bg p-4 text-center">
        {children}
      </div>
    </div>
  )
}
