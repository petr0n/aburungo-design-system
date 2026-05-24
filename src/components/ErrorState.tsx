import type { ReactNode } from 'react'

type Props = {
  message: string
  description?: string
  action?: ReactNode
}

export function ErrorState({ message, description, action }: Props) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-heading-sm font-semibold text-fg">{message}</p>
      {description != null && (
        <p className="text-body text-fg-subtle">{description}</p>
      )}
      {action != null && <div>{action}</div>}
    </div>
  )
}
