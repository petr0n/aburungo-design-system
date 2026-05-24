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

// ─── Layout / state components ────────────────────────────────────────────────

function AppHeader({ title, left, right }) {
  return (
    <header className="grid min-h-[56px] grid-cols-[1fr_auto_1fr] items-center py-2">
      <div className="flex items-center">{left}</div>
      <h1 className="text-heading-sm font-semibold text-fg">{title}</h1>
      <div className="flex items-center justify-end">{right}</div>
    </header>
  );
}

function LoadingPlaceholder({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <p className="text-body-sm text-fg-faint">{label}</p>
    </div>
  );
}

function EmptyState({ message, description, action }) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-body font-medium text-fg">{message}</p>
      {description != null && <p className="text-body-sm text-fg-subtle">{description}</p>}
      {action != null && <div className="mt-1">{action}</div>}
    </div>
  );
}

function ErrorState({ message, description, action }) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-heading-sm font-semibold text-fg">{message}</p>
      {description != null && <p className="text-body text-fg-subtle">{description}</p>}
      {action != null && <div>{action}</div>}
    </div>
  );
}

function ScoreCard({ correct, total, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="text-display font-bold text-fg">
          {correct}<span className="text-heading-lg text-fg-subtle"> / {total}</span>
        </p>
        <p className="mt-1 text-body-sm text-fg-subtle">correct</p>
      </div>
      {children}
    </div>
  );
}

function FlipCard({ front, back, flipped, phase = 'idle', onEntered, onExited }) {
  const slideClass =
    phase === 'entering' ? 'animate-card-enter' :
    phase === 'exiting'  ? 'animate-card-exit'  : '';

  function handleAnimationEnd() {
    if (phase === 'entering' && onEntered) onEntered();
    if (phase === 'exiting'  && onExited)  onExited();
  }

  return (
    <div className={slideClass} onAnimationEnd={handleAnimationEnd} style={{ perspective: '1200px' }}>
      <div className="relative w-full" style={{
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="w-full" style={{ backfaceVisibility: 'hidden' }}>{front}</div>
        <div className="absolute inset-0 w-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{back}</div>
      </div>
    </div>
  );
}

// ─── Kana data (mirrors src/lib/kanaData.ts) ──────────────────────────────────

const _H_BASIC = [
  ['あ','い','う','え','お'],
  ['か','き','く','け','こ'],
  ['さ','し','す','せ','そ'],
  ['た','ち','つ','て','と'],
  ['な','に','ぬ','ね','の'],
  ['は','ひ','ふ','へ','ほ'],
  ['ま','み','む','め','も'],
  ['や', null,'ゆ', null,'よ'],
  ['ら','り','る','れ','ろ'],
  ['わ', null, null,'を','ん'],
];
const _H_VOICED = [
  ['が','ぎ','ぐ','げ','ご'],
  ['ざ','じ','ず','ぜ','ぞ'],
  ['だ','ぢ','づ','で','ど'],
  ['ば','び','ぶ','べ','ぼ'],
  ['ぱ','ぴ','ぷ','ぺ','ぽ'],
];
const _H_SMALL = [
  ['ぁ','ぃ','ぅ','ぇ','ぉ'],
  ['っ','ゃ','ゅ','ょ', null],
];
function _toKata(rows) {
  return rows.map(row => row.map(c => c === null ? null : String.fromCodePoint(c.codePointAt(0) + 0x60)));
}
const KANA_GRIDS = {
  hiragana: { basic: _H_BASIC, voiced: _H_VOICED, small: _H_SMALL },
  katakana: { basic: _toKata(_H_BASIC), voiced: _toKata(_H_VOICED), small: _toKata(_H_SMALL) },
};
const _SECTION_LABELS = { basic: 'あ〜ん', voiced: '゛゜', small: '小' };

// ─── KanaKeyboard ─────────────────────────────────────────────────────────────

function KanaKeyboard({ script, section, onScriptChange, onSectionChange, onKey, onBackspace }) {
  const rows = KANA_GRIDS[script][section];

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {['hiragana', 'katakana'].map((s) => (
            <button key={s} type="button" onClick={() => onScriptChange(s)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                script === s
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}>
              {s === 'hiragana' ? 'ひら' : 'カタ'}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {['basic', 'voiced', 'small'].map((sec) => (
            <button key={sec} type="button" onClick={() => onSectionChange(sec)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                section === sec
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}>
              {_SECTION_LABELS[sec]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-5 gap-1">
            {row.map((cell, ci) =>
              cell === null
                ? <div key={ci}/>
                : <button key={ci} type="button" onClick={() => onKey(cell)}
                    className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2">
                    {cell}
                  </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1">
        <div className="col-span-3"/>
        <button type="button" onClick={() => onKey('ー')}
          className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2">
          ー
        </button>
        <button type="button" onClick={onBackspace} aria-label="Backspace"
          className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg text-fg-muted shadow-key active:bg-surface-2">
          <BackspaceIcon className="h-5 w-5"/>
        </button>
      </div>
    </div>
  );
}

// ─── VoiceInput ───────────────────────────────────────────────────────────────

function VoiceInput({ status, onPress, disabled, errorMessage }) {
  const isListening  = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {isListening && (
          <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-error-500 opacity-30"/>
        )}
        <button type="button" onClick={onPress}
          disabled={disabled || isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={[
            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isListening
              ? 'bg-error-500 text-fg-inverse active:bg-error-fg'
              : 'border-2 border-border-strong bg-bg text-fg-muted active:bg-surface-2',
            (disabled || isProcessing) ? 'opacity-50' : '',
          ].join(' ')}>
          {isProcessing
            ? <SpinnerIcon className="h-5 w-5 animate-spin"/>
            : <MicIcon className="h-6 w-6"/>}
        </button>
      </div>
      <p className="text-body-sm text-fg-subtle">
        {status === 'idle'       && 'Tap to speak'}
        {status === 'listening'  && 'Listening… tap to stop'}
        {status === 'processing' && 'Processing…'}
        {status === 'error'      && (
          <span className="text-error-fg">{errorMessage ?? 'Could not hear you. Try again.'}</span>
        )}
      </p>
    </div>
  );
}

// Share via window so each <script type="text/babel"> can grab them.
Object.assign(window, {
  Button, TextInput, Card, Badge, IconButton,
  SpeakerIcon, MicIcon, BackspaceIcon, SpinnerIcon,
  AudioButton, ProgressBar, PhraseCard, KanaGrid,
  AppHeader, LoadingPlaceholder, EmptyState, ErrorState, ScoreCard, FlipCard,
  KanaKeyboard, VoiceInput,
  KANA_GRIDS,
});
