import type { ReactNode } from 'react'

type Props = {
  title: string
  left?: ReactNode
  right?: ReactNode
}

export function AppHeader({ title, left, right }: Props) {
  return (
    <header className="grid min-h-[56px] grid-cols-[1fr_auto_1fr] items-center py-2">
      <div className="flex items-center">{left}</div>
      <h1 className="text-heading-sm font-semibold text-fg">{title}</h1>
      <div className="flex items-center justify-end">{right}</div>
    </header>
  )
}
