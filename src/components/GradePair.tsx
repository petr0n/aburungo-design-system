/**
 * GradePair — the two buttons a learner grades themselves with.
 *
 * Self-grading is the other half of the correctness vocabulary. `AnswerResult`
 * owns the case where the app judges; this owns the case where the learner
 * does, and for the same reason: **the wording is not passable.** There is
 * nowhere for a call site to put its own words, so "Recalled" and "Worth
 * another look" cannot drift the way `FillBlankCard` and `GrammarClozeCard`
 * drifted before `AnswerResult` existed.
 *
 * It also fixes the colour. Composed by hand, the pair reached for `Button`
 * `secondary` twice — and `secondary` is Rokushō, the correctness colour, so
 * the ✕ button rendered a red glyph on a success-green field and said two
 * things at once. Getting that right required an override at every call site.
 * Here it is right by construction.
 *
 * Meaning rides three channels, per the mark gate: the glyph from `Maru`, the
 * colour from the button's tone, and the words themselves. A screen reader
 * never receives a bare "circle" — `Maru` carries the label.
 *
 * Stacked rather than side by side: "Worth another look" wraps to two lines in
 * half a phone's width, which left the pair visually unbalanced and the taller
 * label cramped against a 44px floor.
 */
import { Button } from './ui/Button'
import { Maru } from './Maru'
import type { AnswerOutcome } from './Maru'

type GradePairProps = {
  onGrade: (outcome: AnswerOutcome) => void
  disabled?: boolean
}

/** Approved wording. Not overridable — that mechanism is the point. */
const LABEL: Record<AnswerOutcome, string> = {
  recalled: 'Recalled',
  review: 'Worth another look',
}

export function GradePair({ onGrade, disabled = false }: GradePairProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        tone="success"
        fullWidth
        disabled={disabled}
        onClick={() => onGrade('recalled')}
      >
        <Maru outcome="recalled" className="text-heading-sm" />
        {LABEL.recalled}
      </Button>
      <Button
        variant="secondary"
        tone="error"
        fullWidth
        disabled={disabled}
        onClick={() => onGrade('review')}
      >
        <Maru outcome="review" className="text-heading-sm" />
        {LABEL.review}
      </Button>
    </div>
  )
}
