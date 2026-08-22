/**
 * GlobalHeader — the product bar that sits above everything, on wide screens.
 *
 * `AppHeader` is the *page's* band: it names the screen you are on and carries
 * its progress, and it belongs to the content column. This is the *product's*
 * bar: it says AburunGo, it does not change as you move between screens, and it
 * spans the window.
 *
 * **Why it exists.** On a phone there is one bar and it does both jobs. At 1280
 * the page band stretched edge to edge, which put the ア and the progress rule
 * a long way from the text they belong to, and left the product itself unnamed
 * anywhere on screen. Splitting the two jobs fixes both: the brand goes full
 * width here, and `AppHeader` goes back to the content column.
 *
 * **Paper, not Sumi, and that is load-bearing.** `DESIGN.md` allows one dark
 * slab per screen and `AppHeader` already is it. A dark global bar would make
 * two — and on Book Five, whose chrome is Sumi, two *identical* ones. The
 * Ōgon hairline underneath is the same rule the dark band wears, which is what
 * ties them together without a second slab.
 *
 * Not rendered on a phone. The mobile frame has no room for a bar that repeats
 * on every screen, and the app band already carries the mark there.
 */
import type { ReactNode } from 'react'

type Props = {
  /**
   * Right-hand slot — account, settings, a review count. Optional, because the
   * bar is worth having with nothing in it: naming the product is the job.
   */
  right?: ReactNode
}

/*
 * The hairline is `border-accent-ogon`, not `border-rule`: there is no
 * `--color-rule` token, only `--color-rule-on-inverse`, which belongs to the
 * dark band. The first draft of this file said `border-rule` and would have
 * rendered no border at all — the silent-inert failure this repo keeps
 * finding. Ogon 500 on paper is decoration rather than text, so the 2.4:1 that
 * bars it from being a focus ring does not apply here.
 */
export function GlobalHeader({ right }: Props) {
  return (
    <header className="border-b-2 border-accent-ogon bg-surface">
      <div className="mx-auto flex min-h-[52px] w-full max-w-7xl items-center gap-3 px-6 py-2">
        {/* Wordmark only — no ア disc. The page band carries the hanko, because
            on a phone it is the only bar there is. Put one here as well and
            desktop shows the same mark twice, sixty pixels apart, which reads
            as a mistake rather than as branding. The wordmark is the brand
            asset for this job and it already ends in the maru.

            `.wm` from brand.css: the maru is drawn by the span, so it takes no
            children and no text. */}
        <span className="wm sm">
          aburungo<span className="maru" />
        </span>

        {right !== undefined && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </div>
    </header>
  )
}
