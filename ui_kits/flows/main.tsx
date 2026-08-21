import { createRoot } from 'react-dom/client'
import { FLOWS, flowById, renderFlow } from './registry'
import { RunFlow, fromUrl } from './shell'
import { BookLab } from './book-lab'

const IDS = FLOWS.map((f) => f.id)
/** The lab is not a flow — it renders five phones at once, so it is its own page. */
const LAB = 'books'
const raw = fromUrl('flow', [...IDS, LAB], IDS[0])
const current = flowById(raw)

/**
 * Flow switcher. A link rather than state, so every flow keeps a shareable URL
 * and `pnpm shots` can address one directly.
 */
function FlowNav() {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-1 px-6 py-3">
        <span className="mr-2 text-caption font-semibold uppercase tracking-wider text-fg-faint">
          Flows
        </span>
        {[...FLOWS, { id: LAB, label: 'Book lab' }].map((flow) => (
          <a
            key={flow.id}
            href={`?flow=${flow.id}`}
            aria-current={flow.id === raw ? 'page' : undefined}
            className={[
              'inline-flex min-h-[44px] items-center rounded-lg px-3 text-body-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              flow.id === raw
                ? 'bg-action text-action-fg'
                : 'text-link active:bg-surface-2',
            ].join(' ')}
          >
            {flow.label}
          </a>
        ))}
        <a
          href="../mobile/"
          className="ml-auto inline-flex min-h-[44px] items-center rounded-lg px-3 text-body-sm font-medium text-link active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Mobile kit →
        </a>
      </div>
    </nav>
  )
}

const host = document.getElementById('root')
if (host === null) throw new Error('ui_kits/flows: no #root in the host page')

createRoot(host).render(
  <>
    <FlowNav />
    {raw === LAB ? <BookLab /> : renderFlow(current, (flow) => <RunFlow flow={flow} />)}
  </>,
)
