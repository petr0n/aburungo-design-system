import { createRoot } from 'react-dom/client'
import { FlashcardRound } from './flashcard-round'
import { FillBlank } from './fill-blank'
import { KanaPractice } from './kana-practice'
import { fromUrl } from './shell'

const FLOWS = {
  flashcard: { label: 'Flashcard round', render: () => <FlashcardRound /> },
  kana: { label: 'Kana practice', render: () => <KanaPractice /> },
  fill: { label: 'Fill in the blank', render: () => <FillBlank /> },
} as const

type FlowId = keyof typeof FLOWS

const IDS = Object.keys(FLOWS) as FlowId[]
const current = fromUrl<FlowId>('flow', IDS, 'flashcard')

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
        {IDS.map((id) => (
          <a
            key={id}
            href={`?flow=${id}`}
            aria-current={id === current ? 'page' : undefined}
            className={[
              'inline-flex min-h-[44px] items-center rounded-lg px-3 text-body-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              id === current
                ? 'bg-action text-action-fg'
                : 'text-link active:bg-surface-2',
            ].join(' ')}
          >
            {FLOWS[id].label}
          </a>
        ))}
      </div>
    </nav>
  )
}

const host = document.getElementById('root')
if (host === null) throw new Error('ui_kits/flows: no #root in the host page')

createRoot(host).render(
  <>
    <FlowNav />
    {FLOWS[current].render()}
  </>,
)
