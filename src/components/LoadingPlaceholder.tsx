import { SpinnerIcon } from './icons'

/**
 * The loading state.
 *
 * It used to be one line of `text-fg-faint`, which meant a learner who had lost
 * signal saw exactly what a learner two seconds from a round saw. Nothing moved,
 * so nothing separated "loading" from "stalled" — and it was the only state in
 * the product that gave no feedback at all, while the empty state next to it
 * carries the hanko.
 *
 * Both variants are motion-gated with `motion-safe:`. Under
 * `prefers-reduced-motion` the spinner still reads as an icon and the skeleton
 * still holds the card's shape, so neither becomes invisible — which is the
 * constraint `docs/todo.md` set for this work.
 */
type Props = {
  label?: string
  /**
   * `skeleton` holds the layout of the card that is arriving; `spinner` is the
   * cheaper signal and reuses the vocabulary `AudioButton` and `VoiceInput`
   * already speak. Rendered side by side before choosing — see
   * `?flow=flashcard&state=loading&loading=spinner`.
   */
  variant?: 'skeleton' | 'spinner'
}

export function LoadingPlaceholder({ label = 'Loading…', variant = 'skeleton' }: Props) {
  if (variant === 'spinner') {
    return (
      <div
        className="flex min-h-[30vh] flex-col items-center justify-center gap-3"
        role="status"
      >
        <SpinnerIcon
          className="h-8 w-8 text-action motion-safe:animate-spin"
          aria-hidden="true"
        />
        <p className="text-body-sm text-fg-muted">{label}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" role="status" aria-label={label}>
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4">
          {/* the scenario tag */}
          <Bar className="h-5 w-28 rounded-sm" />
          {/* the Japanese line, at jp-display — the tallest thing on the card */}
          <Bar className="h-9 w-11/12 rounded-sm [animation-delay:120ms]" />
          {/* reading, then the English gloss */}
          <Bar className="h-4 w-2/3 rounded-sm [animation-delay:240ms]" />
          <Bar className="h-4 w-5/6 rounded-sm [animation-delay:360ms]" />
        </div>
      </div>
      <p className="text-center text-body-sm text-fg-muted">{label}</p>
    </div>
  )
}

/**
 * One skeleton block. `surface-2` rather than a grey: it is the same step the
 * pressed states use, so the placeholder sits in the palette instead of next to
 * it. The stagger is what makes the group read as one object filling in rather
 * than four things blinking together.
 */
function Bar({ className }: { className: string }) {
  return <div className={`bg-surface-2 motion-safe:animate-pulse ${className}`} />
}
