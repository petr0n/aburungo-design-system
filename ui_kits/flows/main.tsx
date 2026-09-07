import { createRoot } from 'react-dom/client'
import { FLOWS, flowById, renderFlow } from './registry'
import { RunFlow, fromUrl } from './shell'
import { BookLab } from './book-lab'

const IDS = FLOWS.map((f) => f.id)
/** The lab is not a flow — it renders five phones at once, so it is its own page. */
const LAB = 'books'
const BOOK_FLOWS = FLOWS.filter((f) => f.group === 'book')
const raw = fromUrl('flow', [...IDS, LAB], IDS[0])
const current = flowById(raw)

/**
 * Did the URL ask for a surface this bundle does not have?
 *
 * `fromUrl` falls back to the first flow, silently, which is right for a typo
 * and wrong for a stale bundle. On 2026-08-21 a checkout moved the tree to a
 * commit predating the book lab; `?flow=books` quietly rendered a flashcard
 * round instead, and the page was reviewed as though it were the lab. Same
 * shape as every other silent-inert bug here — the markup asked for something
 * that did not exist and nothing said so.
 */
const asked = new URLSearchParams(window.location.search).get('flow')
const missing = asked !== null && asked !== '' && asked !== raw ? asked : null

function MissingFlow({ id }: { id: string }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-6">
      {/* `role="alert"` because the whole point of this notice is that the page
          is NOT showing what was asked for. Reading the surface without being
          told that is the silent failure, and it is silent for a screen reader
          whether or not the notice is on screen.

          Assertive rather than `role="status"`, which `LoadingPlaceholder`
          uses: that one reports progress on the thing you asked for, this one
          says you are looking at something else. */}
      <div
        role="alert"
        className="flex flex-col gap-2 rounded-lg border border-error-fg bg-error-bg px-5 py-4"
      >
        <p className="text-body font-semibold text-error-fg">
          No surface called “{id}” in this bundle
        </p>
        <p className="text-body-sm text-fg-muted">
          Showing <strong>{current.label}</strong> instead. If you expected something
          else, this build is behind: check out the branch that has it, run{' '}
          <code className="text-body-sm">pnpm build:flows</code>, and hard-reload —
          the preview server caches <code className="text-body-sm">bundle.js</code>.
        </p>
      </div>
    </div>
  )
}

/**
 * Flow switcher. A link rather than state, so every flow keeps a shareable URL
 * and `pnpm shots` can address one directly.
 */
function FlowNav() {
  return (
    <nav className="border-b border-border bg-surface">
      {/* max-w-6xl, not the page's 5xl: the nav carries one entry per flow plus
          one per book, and books are not capped. */}
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1 px-6 py-3">
        <span className="mr-2 text-caption font-semibold uppercase tracking-wider text-fg-faint">
          Flows
        </span>
        {[...FLOWS.filter((f) => f.group !== 'book'), { id: LAB, label: 'Book lab' }].map((flow) => (
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
        {/* The books collapse to one label and a row of numbers. Five full
            links wrapped the nav to four lines, and books are not capped — see
            the note over BOOKS. */}
        {/* One flex box, so the label and the numbers cannot be split across
            two lines. Wrapping between "2" and "3" reads as a broken nav
            rather than as a group. */}
        <span className="ml-2 flex shrink-0 items-center gap-1">
          <span className="mr-1 text-caption font-semibold uppercase tracking-wider text-fg-faint">
            Books
          </span>
          {BOOK_FLOWS.map((flow, i) => (
            <a
              key={flow.id}
              href={`?flow=${flow.id}`}
              aria-label={flow.label}
              aria-current={flow.id === raw ? 'page' : undefined}
              className={[
                'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 text-body-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                flow.id === raw ? 'bg-action text-action-fg' : 'text-link active:bg-surface-2',
              ].join(' ')}
            >
              {i + 1}
            </a>
          ))}
        </span>

        <a
          href="../mobile/"
          className="ml-4 inline-flex min-h-[44px] items-center rounded-lg px-3 text-body-sm font-medium text-link active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
    {missing !== null && <MissingFlow id={missing} />}
    {raw === LAB ? <BookLab /> : renderFlow(current, (flow) => <RunFlow flow={flow} />)}
  </>,
)
