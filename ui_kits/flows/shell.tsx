/**
 * The page chrome every flow mockup sits in — phone shell, state rail, legend.
 *
 * Not part of the design system: this is the harness around the product, the
 * equivalent of a storybook frame. Nothing in here ships. Product surfaces go
 * inside `<Phone>`.
 */
import type { ReactNode } from 'react'

/**
 * A phone-shaped viewport. 390px is the iPhone 15/16 logical width.
 *
 * `data-phone` is the handle screenshot tooling clips to — capturing the
 * screen alone rather than the harness page around it.
 */
export function Phone({ children }: { children: ReactNode }) {
  // `?phone=375` narrows the shell. The gate asks for renders at 375, and a
  // shell pinned to 390 cannot answer that question -- it just overflowed the
  // viewport by a constant 39px on every surface, which is a fact about the
  // harness and not about the product inside it.
  const width = Number(new URLSearchParams(location.search).get('phone'))
  const w = Number.isFinite(width) && width >= 280 && width <= 600 ? width : 390

  return (
    <div
      data-phone
      style={{ width: `${w}px` }}
      className="shrink-0 overflow-hidden rounded-[2.25rem] border-8 border-inverse bg-bg shadow-card"
    >
      <div className="flex h-[780px] flex-col">{children}</div>
    </div>
  )
}

/** Everything below the header band: the page ground, scrolling. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-8 pt-5">{children}</div>
  )
}

/**
 * The empty-state treatment — option D, chosen 2026-08-13 from four rendered
 * variants in `preview/_sandbox/empty-1-pattern.html`.
 *
 * The crest pattern goes on the **page ground** and the content sits on a
 * `.glass` panel above it — updated 2026-08-13 from an opaque card, which was
 * chosen before the glass existed. Glass keeps the crest reading *through* the
 * panel instead of covering it, and still carries the fine print.
 *
 * That is not a stylistic preference, it is what keeps the screen legible:
 * `EmptyState`'s description is `text-fg-subtle`, which is 3.47:1 straight on
 * the pattern against a 4.5 bar, and 4.76:1 on the glass.
 *
 * Rejected alternatives, so they are not retried: pattern behind everything
 * **fails**; promoting the description to `fg` passes but flattens the
 * hierarchy — message and description become one block — and would change
 * `EmptyState` for every use, patterned or not.
 *
 * Negative margins cancel `Screen`'s padding so the texture bleeds edge to
 * edge; the card puts it back. See The Patterned Ground Rule in `DESIGN.md`.
 */
/**
 * The crest ground for a scrolling list, rather than one centred panel.
 *
 * `EmptyStage` centres a single glass panel in the remaining height, which is
 * right for an empty state and wrong for a list — the items would be pinned to
 * the middle. Same negative margins, same bleed, no centring.
 *
 * `tile-sm` (72px), chosen 2026-08-16 from four sizes measured on this exact
 * treatment in `preview/_sandbox/scenario-5-tile-size.html`. At 56px the crest
 * reads as noise; at 140px as a few large medallions rather than a textile.
 */
export function PatternedStage({ children }: { children: ReactNode }) {
  return (
    <div className="emboss-bg crest-1 tile-sm -mx-4 -mt-5 flex flex-1 flex-col gap-3 px-4 py-4">
      {children}
    </div>
  )
}

export function EmptyStage({ children }: { children: ReactNode }) {
  return (
    <div className="emboss-bg crest-1 -mx-4 -mt-5 flex flex-1 items-center justify-center px-4 py-10">
      <div className="glass w-full">
        <div className="flex flex-col items-center gap-5">{children}</div>
      </div>
    </div>
  )
}



/**
 * `?flow=kana`, `?state=empty`, `?step=summary` — deep links, so a state can be
 * shared and so `pnpm shots` can capture each one without driving clicks.
 */
export function fromUrl<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const raw = new URLSearchParams(window.location.search).get(key)
  return allowed.find((v) => v === raw) ?? fallback
}

export type FlowState<T extends string> = {
  id: T
  label: string
  note: string
}

type FlowPageProps<T extends string> = {
  title: string
  blurb: string
  states: readonly FlowState<T>[]
  current: T
  onSelect: (id: T) => void
  children: ReactNode
}

export function FlowPage<T extends string>({
  title,
  blurb,
  states,
  current,
  onSelect,
  children,
}: FlowPageProps<T>) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg font-semibold text-fg-heading">{title}</h1>
        <p className="max-w-prose text-body text-fg-subtle">{blurb}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {states.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-pressed={current === s.id}
            className={[
              'min-h-[44px] rounded-lg border px-4 text-body-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              current === s.id
                ? 'border-transparent bg-action text-action-fg'
                : 'border-border bg-surface text-fg-muted active:bg-surface-2',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
        {children}

        <dl className="flex flex-col gap-4 pt-2 text-body-sm">
          {states.map((s) => (
            <div key={s.id} className="flex flex-col">
              <dt
                className={
                  current === s.id
                    ? 'font-semibold text-fg-heading'
                    : 'font-medium text-fg-muted'
                }
              >
                {s.label}
              </dt>
              <dd className="text-fg-subtle">{s.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
