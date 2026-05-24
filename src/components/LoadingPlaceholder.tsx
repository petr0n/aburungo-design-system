type Props = {
  label?: string
}

export function LoadingPlaceholder({ label = 'Loading…' }: Props) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <p className="text-body-sm text-fg-faint">{label}</p>
    </div>
  )
}
