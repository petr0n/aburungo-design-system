import type { ReactNode } from 'react'
import { AlertIcon } from './icons'

/**
 * The error state.
 *
 * `ErrorState` and `EmptyState` used to be the same component wearing different
 * type sizes — diffed, they differed on three lines, all typographic. Akane
 * appeared nowhere, which is the colour this system reserves for exactly this
 * job. "Nothing due right now" and "Couldn't load this card" are opposite
 * situations and a learner could not tell them apart at a glance.
 *
 * The signal reads before the words do: a filled Akane triangle over an
 * Akane-toned panel. The panel reuses `error-bg` / `error-border` / `error-fg`,
 * the same roles `AnswerResult` wears for a missed answer, so this is the
 * vocabulary the product already speaks rather than a second one.
 *
 * `EmptyState` keeps its quiet treatment on purpose. The point was that the two
 * stop being interchangeable, not that both get louder.
 *
 * Akane is the mark and errors — **never a CTA**. The retry action stays
 * Ai-iro, and it sits outside the panel so it does not read as part of the
 * warning.
 *
 * The panel is also what lets this state sit on a patterned ground. See The
 * Patterned Ground Rule in `DESIGN.md`: `fg-subtle` measures 3.47:1 straight on
 * the crest and fails, which is why the description line lives on a surface
 * here rather than on the pattern.
 */
type Props = {
  message: string
  description?: string
  action?: ReactNode
}

export function ErrorState({ message, description, action }: Props) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-error-fg bg-error-bg px-5 py-6">
        <AlertIcon className="h-8 w-8 text-error-fg" />
        <p className="text-heading-sm font-semibold text-error-fg">{message}</p>
        {description != null && (
          <p className="text-body text-fg-muted">{description}</p>
        )}
      </div>
      {action != null && <div>{action}</div>}
    </div>
  )
}
