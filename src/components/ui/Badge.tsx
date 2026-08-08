/**
 * Badge — small label.
 *
 * Used for: the scenario tag on a phrase card (neutral), correctness state
 * in lightweight contexts (success / error), and metadata pills.
 *
 * Strictly informational.  Never interactive — if you need a tappable chip
 * use Button size=sm.
 */
import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'success' | 'error'

type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'className'> & {
  variant?: BadgeVariant
  children: ReactNode
  /** Uppercase + wide tracking — matches the scenario tag style in the codebase. */
  emphasis?: boolean
  className?: string
}

// `neutral` is the scenario tag, and it takes the dedicated tag role rather
// than generic neutrals. HANDOFF.md §4 item 5 states this repaint already
// shipped in the drop; it did not — the drop's Badge still reads
// `bg-surface-2 text-fg-subtle`. Trust the code, not the table.
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-tag-bg text-tag-fg',
  success: 'bg-success-bg text-success-fg',
  error:   'bg-error-bg text-error-fg',
}

export function Badge(props: BadgeProps) {
  const { variant = 'neutral', emphasis = false, children, className, ...rest } = props

  const classes = [
    'inline-flex items-center rounded-md px-2 py-0.5 font-medium',
    emphasis ? 'text-caption uppercase tracking-wider' : 'text-body-sm',
    VARIANT_CLASSES[variant],
    className ?? '',
  ].filter((c) => c !== '').join(' ')

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
