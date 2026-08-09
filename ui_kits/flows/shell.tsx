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
  return (
    <div
      data-phone
      className="w-[390px] shrink-0 overflow-hidden rounded-[2.25rem] border-8 border-inverse bg-bg shadow-card"
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
