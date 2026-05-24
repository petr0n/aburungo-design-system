/**
 * Button — the workhorse interactive primitive.
 *
 * Variants follow the codebase conventions:
 *  - primary  → solid fg (zinc-900-ish), inverse text. The everyday CTA.
 *  - secondary→ hairline-bordered, neutral text. Pairs next to primary.
 *  - ghost    → text-only, no chrome. Use sparingly — destructive or tertiary.
 *
 * Touch-first: every variant + size hits min-h-[44px]. Press states only,
 * never hover-only. Loading suppresses presses and shows the text "Please wait…".
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
  /** Optional escape hatch.  Discouraged.  Prefer composing via variant/size. */
  className?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-fg text-fg-inverse active:bg-fg-muted disabled:opacity-40',
  secondary:
    'border border-border-strong bg-bg text-fg-muted active:bg-surface-2 disabled:opacity-50',
  ghost:
    'bg-transparent text-fg-muted active:bg-surface-2 disabled:opacity-50',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-[44px] h-12 px-5 text-body',
  sm: 'min-h-[44px] h-11 px-4 text-body-sm',
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className,
    type,
    ...rest
  } = props

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ].filter((c) => c !== '').join(' ')

  return (
    <button
      type={type ?? 'button'}
      disabled={disabled === true || loading}
      className={classes}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
