import type { ReactNode } from 'react'

type Props = {
  message: string
  action?: ReactNode
}

export function ErrorState({ message, action }: Props) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-body-sm text-error-fg">{message}</p>
      {action != null && <div>{action}</div>}
    </div>
  )
}
