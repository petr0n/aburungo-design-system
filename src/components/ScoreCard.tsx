import type { ReactNode } from 'react'

type Props = {
  correct: number
  total: number
  children?: ReactNode
}

export function ScoreCard({ correct, total, children }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="text-display font-bold text-fg">
          {correct}
          <span className="text-heading-lg text-fg-subtle"> / {total}</span>
        </p>
        <p className="mt-1 text-body-sm text-fg-subtle">correct</p>
      </div>
      {children}
    </div>
  )
}
