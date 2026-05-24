/**
 * IconButton — square touch target wrapping a single SVG slot.
 *
 * Mandatory: `aria-label` (children are decorative SVG).
 * Sizes: md (default 44px) and sm (44px — same minimum, tighter visual).
 *
 * Variants match Button: default (neutral hairline), filled (solid fg),
 * danger (error fill — destructive/recording state).
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonVariant = 'default' | 'filled' | 'danger'
type IconButtonSize = 'md' | 'sm'
type IconButtonShape = 'round' | 'square'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  /** Required.  IconButton holds only an SVG; the label is for assistive tech. */
  'aria-label': string
  variant?: IconButtonVariant
  size?: IconButtonSize
  shape?: IconButtonShape
  children: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  default: 'border border-border bg-bg text-fg-muted active:bg-surface-2',
  filled:  'bg-fg text-fg-inverse active:bg-fg-muted',
  danger:  'bg-error-500 text-fg-inverse active:bg-error-fg',
}

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  md: 'h-11 w-11 min-h-[44px] min-w-[44px]',
  sm: 'h-11 w-11 min-h-[44px] min-w-[44px]',
}

const SHAPE_CLASSES: Record<IconButtonShape, string> = {
  round: 'rounded-full',
  square: 'rounded-lg',
}

export function IconButton(props: IconButtonProps) {
  const {
    variant = 'default',
    size = 'md',
    shape = 'round',
    children,
    className,
    type,
    disabled,
    ...rest
  } = props

  const classes = [
    'inline-flex items-center justify-center select-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
    'disabled:opacity-50',
    SHAPE_CLASSES[shape],
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className ?? '',
  ].filter((c) => c !== '').join(' ')

  return (
    <button type={type ?? 'button'} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  )
}
