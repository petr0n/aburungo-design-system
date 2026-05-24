// AburunGo UI kit — primitive components.
// Mirrors src/components/ui/*.tsx but written as runnable JSX so the demo
// in index.html actually works in the browser via Babel + Tailwind v4 CDN.

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}) {
  const variants = {
    primary: 'bg-fg text-fg-inverse active:bg-fg-muted disabled:opacity-40',
    secondary: 'border border-border-strong bg-bg text-fg-muted active:bg-surface-2 disabled:opacity-50',
    ghost: 'bg-transparent text-fg-muted active:bg-surface-2 disabled:opacity-50',
    accent: 'bg-brand-500 text-fg-inverse active:opacity-80 disabled:opacity-50',
  };
  const sizes = {
    md: 'min-h-[44px] h-12 px-5 text-body',
    sm: 'min-h-[44px] h-11 px-4 text-body-sm',
  };
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
    variants[variant], sizes[size], fullWidth ? 'w-full' : '', className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" disabled={disabled || loading} className={classes} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

function TextInput({ label, hint, error, type = 'text', ...rest }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-sm font-medium text-fg-muted">{label}</label>
      <input
        id={id} type={type} {...rest}
        aria-invalid={error ? true : undefined}
        className={[
          'min-h-[44px] w-full rounded-md border bg-bg px-3 py-2',
          'text-body text-fg placeholder:text-fg-faint',
          'focus:outline-none focus:ring-2 focus:ring-brand-500',
          error ? 'border-error-500' : 'border-border-strong focus:border-fg-subtle',
        ].join(' ')}
      />
      {error ? <p role="alert" className="text-body-sm text-error-fg">{error}</p>
        : hint ? <p className="text-body-sm text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

function Card({ children, compact = false, className = '' }) {
  return (
    <article className={['rounded-2xl border border-border bg-bg shadow-card',
      compact ? 'p-4' : 'p-6', className].join(' ')}>
      {children}
    </article>
  );
}

function Badge({ variant = 'neutral', emphasis = false, children }) {
  const variants = {
    neutral: 'bg-surface-2 text-fg-subtle',
    success: 'bg-success-bg text-success-fg',
    error: 'bg-error-bg text-error-fg',
  };
  return (
    <span className={[
      'inline-flex items-center rounded-md px-2 py-0.5 font-medium',
      emphasis ? 'text-caption uppercase tracking-wider' : 'text-body-sm',
      variants[variant],
    ].join(' ')}>{children}</span>
  );
}

function IconButton({ 'aria-label': ariaLabel, variant = 'default', shape = 'round',
                     onClick, disabled, children }) {
  const variants = {
    default: 'border border-border bg-bg text-fg-muted active:bg-surface-2',
    filled: 'bg-fg text-fg-inverse active:bg-fg-muted',
    danger: 'bg-error-500 text-fg-inverse active:bg-error-fg',
  };
  return (
    <button
      type="button" aria-label={ariaLabel} onClick={onClick} disabled={disabled}
      className={[
        'inline-flex items-center justify-center select-none transition-colors h-11 w-11 min-h-[44px] min-w-[44px]',
        shape === 'round' ? 'rounded-full' : 'rounded-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        'disabled:opacity-50',
        variants[variant],
      ].join(' ')}>
      {children}
    </button>
  );
}

// — Icons —
const SpeakerIcon = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"/>
  </svg>
);
const MicIcon = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm6-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);
const BackspaceIcon = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>
  </svg>
);
const SpinnerIcon = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

function AudioButton({ state = 'idle', onPress, label = 'Play audio' }) {
  const isLoading = state === 'loading';
  const isPlaying = state === 'playing';
  return (
    <IconButton aria-label={label} variant={isPlaying ? 'filled' : 'default'}
      disabled={isLoading} onClick={onPress}>
      {isLoading
        ? <SpinnerIcon className="h-5 w-5 animate-spin"/>
        : <SpeakerIcon className="h-5 w-5"/>}
    </IconButton>
  );
}

function ProgressBar({ value, label = 'Session progress' }) {
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={1} aria-valuenow={v}
      className="relative h-1 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="h-full bg-brand-500 transition-[width] duration-200 ease-out"
        style={{ width: `${(v * 100).toFixed(1)}%` }}/>
    </div>
  );
}

// Phrase card — full body of the review screen.
function PhraseCard({ japanese, reading, english, scenario, audioSlot, footer, notes }) {
  return (
    <Card>
      <div className="flex flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          {scenario ? <Badge emphasis>{scenario}</Badge> : <span aria-hidden/>}
          {audioSlot ?? null}
        </header>
        <div className="flex flex-col items-center gap-2 text-center">
          <p lang="ja" className="font-jp text-jp-display text-fg">{japanese}</p>
          <p lang="ja" className="font-jp text-jp text-fg-muted">{reading}</p>
        </div>
        {english !== undefined ? (
          <>
            <hr className="border-border" />
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-body-lg text-fg">{english}</p>
              {notes ? <p className="text-body-sm text-fg-subtle">{notes}</p> : null}
            </div>
          </>
        ) : null}
        {footer ?? null}
      </div>
    </Card>
  );
}

// KanaGrid — see src/components/KanaGrid.tsx
function KanaGrid({ rows, onSelect, onBackspace }) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-xl border border-border bg-surface p-3">
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-5 gap-1">
          {row.map((cell, ci) =>
            cell === null
              ? <div key={ci} aria-hidden/>
              : <button key={ci} type="button"
                  aria-label={`${cell.kana} (${cell.romaji})`}
                  onClick={() => onSelect(cell.kana)}
                  className="flex h-11 min-h-[44px] items-center justify-center rounded-lg border border-border bg-bg shadow-key font-jp text-jp-lg text-fg transition-colors active:bg-surface-2">
                  {cell.kana}
                </button>
          )}
        </div>
      ))}
      {onBackspace ? (
        <div className="grid grid-cols-5 gap-1 pt-1">
          <div className="col-span-4"/>
          <button type="button" aria-label="Backspace" onClick={onBackspace}
            className="flex h-11 min-h-[44px] items-center justify-center rounded-lg border border-border bg-bg shadow-key text-fg-muted active:bg-surface-2">
            <BackspaceIcon className="h-5 w-5"/>
          </button>
        </div>
      ) : null}
    </div>
  );
}

// Share via window so each <script type="text/babel"> can grab them.
Object.assign(window, {
  Button, TextInput, Card, Badge, IconButton,
  SpeakerIcon, MicIcon, BackspaceIcon, SpinnerIcon,
  AudioButton, ProgressBar, PhraseCard, KanaGrid,
});
