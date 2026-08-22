/**
 * ProgressBar — purely visual session progress (0–1).
 *
 * No numbers, no labels, no segmentation.  Just a hairline track and a
 * solid fill in Rokusho (bg-progress-fill).  Used to show how far through the
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
  /**
   * What the bar is sitting on.
   *
   * `inverse` for the Sumi header band, where the light track would glare.
   *
   * `on-accent` for a band that carries a HUE — a book's chrome. Measured
   * 2026-08-21 across the five books: the fill is `progress-fill`, Rokushō
   * 500, whatever the tone, and against its own book's band that is
   * **1.00:1 on Book One** — the identical colour, an invisible bar reading as
   * a plain white line. Book Three came to 1.50 and Book Four 1.33. Three of
   * five books had no visible progress at all, and the tone switch could not
   * fix it because it only ever swapped the track.
   *
   * `on-accent` draws in `currentColor` instead, so the bar takes the ink the
   * band already chose for its labels and inherits its contrast — the band ink
   * is picked to be legible on that hue, and a bar is easier to see than text.
   * Nothing else changes: `default` and `inverse` still fill in Rokushō, so
   * `AppHeader` on the Sumi band is untouched.
   */
  tone?: ProgressTone
}

type ProgressTone = 'default' | 'inverse' | 'on-accent'

/** Swapped, never stacked — two `bg-*` utilities have equal specificity. */
const TRACK: Record<ProgressTone, string> = {
  default: 'bg-progress-track',
  inverse: 'bg-progress-track-on-inverse',
  'on-accent': 'bg-current/20',
}

const FILL: Record<ProgressTone, string> = {
  default: 'bg-progress-fill',
  inverse: 'bg-progress-fill',
  'on-accent': 'bg-current',
}

/**
 * `Number.isFinite` rather than an `isNaN` check: it also rejects `undefined`,
 * `null` and non-numbers, which the type says cannot arrive but the untyped
 * JSX mirror could pass — and did, rendering `width: NaN%`.
 */
function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

export function ProgressBar(props: ProgressBarProps) {
  const { value, label = 'Session progress', tone = 'default' } = props
  const clamped = clamp01(value)
  const pct = `${(clamped * 100).toFixed(2)}%`

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clamped}
      className={`relative h-1 w-full overflow-hidden rounded-full ${TRACK[tone]}`}
    >
      <div
        className={`h-full ${FILL[tone]} transition-[width] duration-200 ease-out`}
        style={{ width: pct }}
      />
    </div>
  )
}
