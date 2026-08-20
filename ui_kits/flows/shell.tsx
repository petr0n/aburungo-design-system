/**
 * The page chrome every flow mockup sits in — phone shell, state rail, legend.
 *
 * Not part of the design system: this is the harness around the product, the
 * equivalent of a storybook frame. Nothing in here ships. Product surfaces go
 * inside `<Phone>`.
 */
import { useState } from 'react'
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
 * The crest ground, shared by every stage below.
 *
 * Negative margins cancel `Screen`'s padding so the texture bleeds edge to
 * edge. `tile-sm` (72px) everywhere — it was chosen 2026-08-16 from four sizes
 * measured on the lesson list, and `EmptyStage` was the one surface still on
 * the default tile. Two tile sizes across three states that are meant to read
 * as one family is the inconsistency this pass exists to remove.
 */
const CREST = 'emboss-bg crest-1 tile-sm -mx-4 -mt-5 flex flex-1 px-4'

/**
 * The crest ground for a scrolling list, rather than one centred panel.
 * Same bleed as the others, no centring — a list pinned to the middle is wrong.
 */
export function PatternedStage({ children }: { children: ReactNode }) {
  return <div className={`${CREST} flex-col gap-3 py-4`}>{children}</div>
}

/**
 * The empty-state treatment — option D, chosen 2026-08-13 from four rendered
 * variants in `preview/_sandbox/empty-1-pattern.html`, with the opaque card
 * swapped for `.glass` the same day so the crest reads *through* the panel.
 *
 * The glass is doing legibility work, not decoration: `EmptyState`'s
 * description is `text-fg-subtle`, which is 3.47:1 straight on the pattern
 * against a 4.5 bar and 4.76:1 on the glass.
 *
 * Rejected, so they are not retried: pattern behind everything **fails**;
 * promoting the description to `fg` passes but flattens message and description
 * into one block, and would change `EmptyState` everywhere. Do not re-open this
 * by reaching for the simpler markup. Full note in `DESIGN.md`.
 */
export function EmptyStage({ children }: { children: ReactNode }) {
  return (
    <div className={`${CREST} items-center justify-center py-10`}>
      <div className="glass w-full">
        <div className="flex flex-col items-center gap-5">{children}</div>
      </div>
    </div>
  )
}

/**
 * Loading and error, on the same ground as empty.
 *
 * No `.glass` here, unlike `EmptyStage`: both states bring their own surface —
 * the skeleton is a card, and `ErrorState` is an Akane panel — so a glass pane
 * under them would be a second sheet of paper for nothing. See "Which surfaces
 * carry the ground" in `DESIGN.md`.
 */
export function StateStage({ children }: { children: ReactNode }) {
  return (
    <div className={`${CREST} items-center justify-center py-10`}>
      <div className="w-full">{children}</div>
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

/**
 * What a flow exports, so more than one harness can render it.
 *
 * `ui_kits/flows/` shows a flow in a plain shell next to a state rail;
 * `ui_kits/mobile/` shows the same flow inside an iOS device frame. Before this
 * type existed the mobile kit hand-copied its screens in browser JSX and went
 * a palette behind — the drift `CLAUDE.md` warns about, which is also how a
 * `variant="accent"` that no Button has ever implemented shipped there,
 * rendering the landing screen's primary CTA as bare text.
 *
 * `Screens` renders only what goes *inside* a phone: `AppHeader` and `Screen`.
 * The frame is the harness's business, and that is the whole point.
 */
export type FlowDef<T extends string> = {
  id: string
  label: string
  title: string
  blurb: string
  states: readonly FlowState<T>[]
  initial: T
  /**
   * `nonce` changes on every state switch. Apply it as a `key` to whichever
   * screen holds progress that should not survive leaving and coming back — a
   * half-finished round, a typed answer. It is deliberately NOT applied to the
   * whole flow: `kana-practice` carries the drill's marks across into the
   * result screen, and keying the lot would throw them away between the two.
   */
  Screens: (props: { state: T; go: (next: T) => void; nonce: number }) => ReactNode
}

/**
 * Run a flow in this harness: state rail, phone shell, legend.
 *
 * `nonce` bumps on every state switch and is handed to the flow rather than
 * applied here, so each flow decides what a switch resets. See `FlowDef`.
 */
export function RunFlow<T extends string>({ flow }: { flow: FlowDef<T> }) {
  const [state, setState] = useState<T>(
    fromUrl(
      'state',
      flow.states.map((s) => s.id),
      flow.initial,
    ),
  )
  const [nonce, setNonce] = useState(0)

  function go(next: T) {
    setState(next)
    setNonce((n) => n + 1)
  }

  return (
    <FlowPage
      title={flow.title}
      blurb={flow.blurb}
      states={flow.states}
      current={state}
      onSelect={go}
    >
      <Phone>
        <flow.Screens state={state} go={go} nonce={nonce} />
      </Phone>
    </FlowPage>
  )
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
