/**
 * ProgressBar — purely visual session progress (0–1).
 *
 * No numbers, no labels, no segmentation.  Just a hairline track and a
 * solid fill in the brand purple.  Used to show how far through the
 * current review batch the learner is.
 *
 * Anti-goal: this is NOT a gamification element.  It does not celebrate
 * milestones, change colour at 100%, or animate beyond a quiet width
 * transition.
 */
type ProgressBarProps = {
  /** 0..1 inclusive.  Values outside the range are clamped. */
  value: number
  /** Accessible description.  Defaults to "Session progress". */
  label?: string
}

function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  if (Number.isNaN(v)) return 0
  return v
}

export function ProgressBar(props: ProgressBarProps) {
  const { value, label = 'Session progress' } = props
  const clamped = clamp01(value)
  const pct = `${(clamped * 100).toFixed(2)}%`

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clamped}
      className="relative h-1 w-full overflow-hidden rounded-full bg-surface-2"
    >
      <div
        className="h-full bg-brand-500 transition-[width] duration-200 ease-out"
        style={{ width: pct }}
      />
    </div>
  )
}
