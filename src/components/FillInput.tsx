import type React from 'react'
import { KanaKeyboard } from './KanaKeyboard'
import type { KanaScript, KanaSection } from './KanaKeyboard'

export type InputMode = 'romaji' | 'kana' | 'system'

export type FillInputProps = {
  // --- controlled state ---
  mode: InputMode
  /** Raw romaji string typed by the user. */
  romajiValue: string
  /** Accumulated kana (kana grid and system IME modes). */
  kanaValue: string
  /** Pre-computed from convertRomaji(romajiValue).converted. */
  converted: string
  /** Pre-computed from convertRomaji(romajiValue).pending. */
  pending: string
  /** Current script for the embedded KanaKeyboard. */
  kanaScript: KanaScript
  /** Current section for the embedded KanaKeyboard. */
  kanaSection: KanaSection
  canSubmit: boolean
  disabled?: boolean
  placeholder?: string
  showSystemHint?: boolean
  /** Forwarded to the active text input for focus management. */
  inputRef?: React.RefObject<HTMLInputElement | null>
  // --- event handlers ---
  onModeChange: (mode: InputMode) => void
  onRomajiChange: (value: string) => void
  onKanaKey: (char: string) => void
  onKanaBackspace: () => void
  onKanaScriptChange: (script: KanaScript) => void
  onKanaSectionChange: (section: KanaSection) => void
  onSystemChange: (value: string) => void
  onSubmit: () => void
  onToggleSystemHint: () => void
}

const MODE_LABELS: Record<InputMode, string> = {
  romaji: 'Romaji',
  kana: 'Kana grid',
  system: 'JP keyboard',
}

const SYSTEM_HINT =
  'Switch your keyboard to Japanese (日本語) — on iOS: Settings → General → Keyboard → Keyboards → Add New Keyboard → Japanese. On Android: Settings → General Management → Language → On-screen Keyboard → add Japanese.'

export function FillInput({
  mode,
  romajiValue,
  kanaValue,
  converted,
  pending,
  kanaScript,
  kanaSection,
  canSubmit,
  disabled,
  placeholder,
  showSystemHint,
  inputRef,
  onModeChange,
  onRomajiChange,
  onKanaKey,
  onKanaBackspace,
  onKanaScriptChange,
  onKanaSectionChange,
  onSystemChange,
  onSubmit,
  onToggleSystemHint,
}: FillInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Mode picker */}
      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
        {(['romaji', 'kana', 'system'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={[
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              mode === m
                ? 'bg-bg text-fg shadow-card'
                : 'text-fg-subtle hover:text-fg active:bg-surface-2',
            ].join(' ')}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Romaji mode */}
      {mode === 'romaji' && (
        <div className="flex flex-col gap-2">
          {/* Live kana preview */}
          <div className="min-h-10 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg">
            {converted !== '' || pending !== '' ? (
              <>
                <span>{converted}</span>
                <span className="text-fg-faint">{pending}</span>
              </>
            ) : (
              <span className="text-body text-fg-faint">
                {placeholder ?? 'Kana preview'}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={romajiValue}
            onChange={(e) => onRomajiChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type romaji here…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-border-strong px-4 text-body text-fg placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
        </div>
      )}

      {/* Kana grid mode */}
      {mode === 'kana' && (
        <div className="flex flex-col gap-2">
          {/* Accumulated kana display */}
          <div className="min-h-12 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg">
            {kanaValue !== '' ? (
              kanaValue
            ) : (
              <span className="text-body text-fg-faint">
                {placeholder ?? 'Tap kana below…'}
              </span>
            )}
          </div>
          <KanaKeyboard
            script={kanaScript}
            section={kanaSection}
            onScriptChange={onKanaScriptChange}
            onSectionChange={onKanaSectionChange}
            onKey={onKanaKey}
            onBackspace={onKanaBackspace}
          />
        </div>
      )}

      {/* System IME mode */}
      {mode === 'system' && (
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            value={kanaValue}
            onChange={(e) => onSystemChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder ?? 'Type in Japanese…'}
            lang="ja"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-border-strong px-4 font-jp text-jp text-fg placeholder:font-sans placeholder:text-body placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
          <div className="flex items-start gap-2">
            <p className="text-body-sm text-fg-subtle">
              Switch your device keyboard to Japanese (日本語).
            </p>
            <button
              type="button"
              onClick={onToggleSystemHint}
              className="shrink-0 text-body-sm text-fg-faint underline hover:text-fg-muted active:text-fg-muted"
            >
              How?
            </button>
          </div>
          {showSystemHint && (
            <p className="rounded-xl bg-surface p-3 text-body-sm text-fg-muted">
              {SYSTEM_HINT}
            </p>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="h-12 w-full rounded-xl bg-fg text-body font-medium text-fg-inverse transition-colors hover:bg-fg-muted disabled:opacity-40 active:bg-fg-muted"
      >
        Check answer
      </button>
    </div>
  )
}
