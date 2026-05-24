import type { ReactNode } from 'react'

type Props = {
  message: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ message, description, action }: Props) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-body font-medium text-fg">{message}</p>
      {description != null && (
        <p className="text-body-sm text-fg-subtle">{description}</p>
      )}
      {action != null && <div className="mt-1">{action}</div>}
    </div>
  )
}
