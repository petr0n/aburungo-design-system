/**
 * The loading state — a skeleton of the card that is arriving.
 *
 * It used to be one line of `text-fg-faint`, which meant a learner who had lost
 * signal saw exactly what a learner two seconds from a round saw. Nothing moved,
 * so nothing separated "loading" from "stalled" — and it was the only state in
 * the product that gave no feedback at all, while the empty state next to it
 * carries the hanko.
 *
 * **Skeleton over spinner, chosen 2026-08-17** from the two rendered side by
 * side at `?flow=flashcard&state=loading`. The card is the whole screen here,
 * so holding its shape means nothing jumps when content lands; and a 32px
 * spinner on the crest ground read as almost nothing. `SpinnerIcon` stays in
 * `icons.tsx` — `AudioButton` and `VoiceInput` use it for in-control loading,
 * which is a different job from a whole screen waiting.
 *
 * `motion-safe:` gates the pulse. Under `prefers-reduced-motion` the blocks stop
 * animating but still hold the card's shape, so the state never becomes
 * invisible — the constraint `docs/todo.md` set for this work.
 */
type Props = {
  label?: string
}

export function LoadingPlaceholder({ label = 'Loading…' }: Props) {
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
