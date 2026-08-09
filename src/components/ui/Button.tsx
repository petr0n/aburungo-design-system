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

/**
 * Semantic tint, for controls whose meaning is an outcome rather than a rank.
 *
 * `secondary` is Rokushō — the same colour the system uses for correctness —
 * so a control meaning "I got this wrong" could only be built by overriding it
 * at the call site, and every call site had to remember. A ✕ on a
 * success-green field says two things at once.
 *
 * Applies to `secondary` only: `primary` is Ai-iro by definition, and `ghost`
 * has no chrome to tint.
 */
type ButtonTone = 'neutral' | 'success' | 'error'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
  /** Optional escape hatch.  Discouraged.  Prefer composing via variant/size. */
  className?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-action text-action-fg active:bg-action-press disabled:opacity-40',
  secondary:
    'border border-action-2-border bg-action-2-bg text-action-2-fg active:bg-surface-2 disabled:opacity-50',
  ghost:
    'bg-transparent text-fg-muted active:bg-surface-2 disabled:opacity-50',
}

/** Replaces `secondary`'s chrome wholesale — never stacked on top of it, since
 *  two `bg-*` utilities have equal specificity and stylesheet order decides. */
const TONE_CLASSES: Record<Exclude<ButtonTone, 'neutral'>, string> = {
  success:
    'border border-success-border bg-success-bg text-success-fg active:bg-success-press disabled:opacity-50',
  error:
    'border border-error-border bg-error-bg text-error-fg active:bg-error-press disabled:opacity-50',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-[44px] h-12 px-5 text-body',
  sm: 'min-h-[44px] h-11 px-4 text-body-sm',
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    tone = 'neutral',
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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    tone !== 'neutral' && variant === 'secondary'
      ? TONE_CLASSES[tone]
      : VARIANT_CLASSES[variant],
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
