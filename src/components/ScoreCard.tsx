import type { ReactNode } from 'react'

/**
 * The score block's ground.
 *
 * `plain` is warm paper like every other card. `ai` is a solid field — the end
 * of a round is the one moment a screen is allowed to be emphatic, and on paper
 * it was the most colourless screen in the app.
 *
 * `rokusho` was solid too until 2026-08-16 and is now a tint with a 1px rule:
 * it sits directly above the phrase list, and a saturated block there won the
 * screen away from the thing the learner is actually reading. Exactly one tone
 * being allowed to shout is the point of having tones.
 */
type ScoreTone = 'plain' | 'rokusho' | 'ai'

type Props = {
  correct: number
  total: number
  /**
   * Label beneath the count. Defaults to "correct" — the approved wording since 2026-08-21.
   * "correct" is verdict prose and is not used anywhere in the product.
   */
  label?: string
  tone?: ScoreTone
  children?: ReactNode
}

/**
 * `rokusho` is a tint with a 1px rule rather than a solid fill, from 2026-08-16.
 * The solid Rokusho block was the loudest thing on the summary screen and made
 * the score compete with the phrase list under it; the tint keeps the colour
 * doing its job — this is the correctness green — without shouting. Text moves
 * to rokusho-800, which is 7.61:1 on the tint.
 *
 * `ai` is left solid deliberately: it is the emphatic end-of-round treatment,
 * and having exactly one tone that can be loud is the point of having tones.
 */
const TONE: Record<ScoreTone, { box: string; num: string; sub: string }> = {
  plain:   { box: 'border-border bg-surface',                          num: 'text-fg',                sub: 'text-fg-subtle' },
  rokusho: { box: 'border-accent-rokusho bg-accent-rokusho-bg',        num: 'text-success-fg',        sub: 'text-success-fg' },
  ai:      { box: 'border-transparent bg-accent-ai',                   num: 'text-accent-ai-fg',      sub: 'text-accent-ai-fg' },
}

export function ScoreCard({ correct, total, label = "correct", tone = 'plain', children }: Props) {
  const t = TONE[tone]

  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded-2xl border p-6 text-center ${t.box}`}>
        <p className={`text-display font-bold ${t.num}`}>
          {correct}
          <span className={`text-heading-lg opacity-70 ${t.sub}`}> / {total}</span>
        </p>
        <p className={`mt-1 text-body-sm opacity-80 ${t.sub}`}>{label}</p>
      </div>
      {children}
    </div>
  )
}
