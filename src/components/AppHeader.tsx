/**
 * AppHeader — the inverse chrome band.
 *
 * Sumi-iro 墨色 ground, Ōgon 黄金 hairline underneath, the Akane hanko at the
 * left. This is the treatment v3 specified and shipped no component for: the
 * `bg-inverse`, `rule-on-inverse` and `fg-on-inverse-2` roles existed with
 * nothing wearing them, and the header was a bare <h1> on the page ground.
 *
 * The dark band is what gives a screen its structure — it is the one place the
 * product is allowed to be emphatic, and everything below it stays calm.
 */
import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

type Props = {
  title: string
  /** Optional second line under the title — unit, scenario, progress. */
  subtitle?: string
  left?: ReactNode
  right?: ReactNode
  /** Show the ア hanko at the left. Off when `left` is supplied. */
  mark?: boolean
  /**
   * Session progress, 0..1. Rendered inside the band.
   *
   * It lives here rather than under the header because a bar dropped flush
   * below the band sits directly against the Ōgon hairline, and the two read
   * as one two-tone rule. Inside, the band's own padding separates them and no
   * call site has to remember a spacer.
   */
  progress?: number
}

export function AppHeader({ title, subtitle, left, right, mark = true, progress }: Props) {
  const showMark = mark && left === undefined

  return (
    <header className="mx-auto w-full max-w-3xl border-b-[6px] border-rule-on-inverse bg-inverse">
      {/* Back to the content column, 2026-08-22, and this reverses the change
          made a day earlier.
          
          Full width was the wrong fix for the right problem. At 1280 the band
          did stretch away from its text — but the answer is not to send the
          mark to the window edge.

          The cap is on the `header` itself, not on the row inside it, so the
          SLAB is the column and not just its contents. Band and crest ground
          then share one edge and the page reads as a sheet of paper centred in
          the window, rather than a full-width bar over a narrow column. Inert
          at phone widths either way — 390 is inside 768.

          What sits ABOVE this at desktop width is undecided. A paper product
          bar was built here on 2026-08-22 and removed the same day: it
          repeated the band's Ōgon hairline forty pixels higher, and more to
          the point it was invented rather than drawn from the real site, whose
          chrome is `../aburungo/src/components/PageShell.tsx` — a large
          `.ctype` lockup over a `border-b-2` tab nav, `max-w-5xl`, no coloured
          bar at all. That frame has never been modelled in this package. Page
          templates are being designed; do not guess at this again before they
          land. */}
      <div className="grid min-h-[56px] w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2">
        <div className="flex items-center">
          {showMark ? (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-jp text-body font-bold text-accent-fg"
              aria-hidden="true"
            >
              ア
            </span>
          ) : (
            left
          )}
        </div>

        <div className="text-center">
          <h1 className="text-heading-sm font-semibold text-fg-inverse">{title}</h1>
          {subtitle !== undefined && subtitle !== '' && (
            <p className="text-caption text-fg-on-inverse-2">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center justify-end">{right}</div>
      </div>

      {progress !== undefined && (
        <div className="w-full px-4 pb-2">
          <ProgressBar value={progress} tone="inverse" />
        </div>
      )}
    </header>
  )
}
