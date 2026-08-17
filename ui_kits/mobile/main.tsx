/**
 * The mobile UI kit — the product in a device frame.
 *
 * This replaces `screens.jsx` + `components.jsx` + `ios-frame.jsx`, in which
 * every component was typed out a second time in browser JSX. That mirror was
 * four palettes and a dozen components behind, and it shipped a landing screen
 * whose primary button rendered as bare text because `variant="accent"` does
 * not exist. See `docs/todo.md` item 1 and the note in `onboarding.tsx`.
 *
 * It imports `src/components` and the same flow definitions `ui_kits/flows/`
 * renders, so a component can no longer be right in TSX and wrong here. Adding
 * a screen means adding it once, in `ui_kits/flows/registry.ts`.
 *
 * `components.jsx` stays on disk: `storybook/index.html` and `ui_kits/app/`
 * still load it. Converting those is the follow-up this pass does not do.
 */
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FLOWS, flowById, renderFlow } from '../flows/registry'
import { fromUrl } from '../flows/shell'
import type { FlowDef } from '../flows/shell'
import { Device } from './device'
import { OnboardingScreen } from './onboarding'
import type { OnboardingPane } from './onboarding'

type OnboardingId = 'landing' | 'signin'

/**
 * Two entries, one screen. Landing and sign-in are the same surface now --
 * these deep-link into the two sides of its crossfade, so a review link and
 * `check-touch-targets` can still address the fields directly.
 */
const ONBOARDING: { id: OnboardingId; label: string; pane: OnboardingPane }[] = [
  { id: 'landing', label: 'Landing', pane: 'choose' },
  { id: 'signin', label: 'Sign in', pane: 'signin' },
]

const SCREEN_IDS = [...ONBOARDING.map((o) => o.id), ...FLOWS.map((f) => f.id)]

/** Renders one flow's screens inside the device, with its own state rail. */
function FlowInDevice<T extends string>({ flow }: { flow: FlowDef<T> }) {
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
    <>
      <StateRail
        items={flow.states.map((s) => ({ id: s.id, label: s.label }))}
        current={state}
        onSelect={go}
      />
      <Device dark>
        <flow.Screens state={state} go={go} nonce={nonce} />
      </Device>
      <dl className="flex w-56 shrink-0 flex-col gap-3 text-body-sm">
        {flow.states.map((s) => (
          <div key={s.id} className="flex flex-col">
            <dt className={s.id === state ? 'font-semibold text-fg-heading' : 'font-medium text-fg-muted'}>
              {s.label}
            </dt>
            <dd className="text-fg-subtle">{s.note}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function OnboardingInDevice({ start }: { start: OnboardingId }) {
  const [screen, setScreen] = useState<OnboardingId>(start)
  return (
    <>
      <StateRail
        items={ONBOARDING}
        current={screen}
        onSelect={setScreen}
      />
      {/* No header band here, so the status bar sits on warm stone and its
          glyphs have to be black. */}
      <Device dark={false}>
        <OnboardingScreen
          key={screen}
          start={ONBOARDING.find((o) => o.id === screen)?.pane ?? 'choose'}
        />
      </Device>
      <dl className="flex w-56 shrink-0 flex-col gap-3 text-body-sm">
        <div className="flex flex-col">
          <dt className="font-medium text-fg-muted">Before sign-in</dt>
          <dd className="text-fg-subtle">
            One screen, not two. The mark holds still and the block under it
            crossfades: the buttons fade out and the fields fade in in the same
            place. Google sits outside the fade — it is an alternative to both
            paths, so taking it should not mean backing out of the one you just
            chose. The only surface with no header band, and the one the old kit
            rendered with its primary button as bare text.
          </dd>
        </div>
      </dl>
    </>
  )
}

function StateRail<T extends string>({
  items,
  current,
  onSelect,
}: {
  items: readonly { id: T; label: string }[]
  current: T
  onSelect: (id: T) => void
}) {
  return (
    <div className="flex w-40 shrink-0 flex-col gap-2">
      {items.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          aria-pressed={current === s.id}
          className={[
            'min-h-[44px] rounded-lg border px-4 text-left text-body-sm font-medium transition-colors',
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
  )
}

const current = fromUrl('screen', SCREEN_IDS, 'landing')
const isOnboarding = (id: string): id is OnboardingId =>
  ONBOARDING.some((o) => o.id === id)

function Nav() {
  const link =
    'inline-flex min-h-[44px] items-center rounded-lg px-3 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1 px-6 py-3">
        <span className="mr-2 text-caption font-semibold uppercase tracking-wider text-fg-faint">
          Mobile kit
        </span>
        {[...ONBOARDING, ...FLOWS].map((s) => (
          <a
            key={s.id}
            href={`?screen=${s.id}`}
            aria-current={s.id === current ? 'page' : undefined}
            className={`${link} ${s.id === current ? 'bg-action text-action-fg' : 'text-link active:bg-surface-2'}`}
          >
            {s.label}
          </a>
        ))}
        <a href="../flows/" className={`ml-auto ${link} text-link active:bg-surface-2`}>
          Flows harness →
        </a>
      </div>
    </nav>
  )
}

const host = document.getElementById('root')
if (host === null) throw new Error('ui_kits/mobile: no #root in the host page')

createRoot(host).render(
  <>
    <Nav />
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg font-semibold text-fg-heading">AburunGo — mobile UI kit</h1>
        <p className="max-w-prose text-body text-fg-subtle">
          Every product screen in an iPhone frame, built from the shipped
          components. Not a mirror of them — this imports{' '}
          <code className="text-body-sm">src/components</code> and the same flow
          definitions the flows harness renders, so it cannot fall behind.
        </p>
      </header>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        {isOnboarding(current) ? (
          <OnboardingInDevice start={current} />
        ) : (
          renderFlow(flowById(current), (flow) => <FlowInDevice flow={flow} />)
        )}
      </div>
    </div>
  </>,
)
