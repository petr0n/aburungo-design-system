import type { KanaRow } from '../lib/kanaData'
import {
  HIRAGANA_BASIC,
  HIRAGANA_VOICED,
  HIRAGANA_SMALL,
  KATAKANA_BASIC,
  KATAKANA_VOICED,
  KATAKANA_SMALL,
} from '../lib/kanaData'
import { BackspaceIcon } from './icons'

export type KanaScript = 'hiragana' | 'katakana'
export type KanaSection = 'basic' | 'voiced' | 'small'

export type KanaKeyboardProps = {
  script: KanaScript
  section: KanaSection
  onScriptChange: (script: KanaScript) => void
  onSectionChange: (section: KanaSection) => void
  onKey: (kana: string) => void
  onBackspace: () => void
}

const SECTION_LABELS: Record<KanaSection, string> = {
  basic: 'あ〜ん',
  voiced: '゛゜',
  small: '小',
}

const GRID: Record<KanaScript, Record<KanaSection, readonly KanaRow[]>> = {
  hiragana: {
    basic: HIRAGANA_BASIC,
    voiced: HIRAGANA_VOICED,
    small: HIRAGANA_SMALL,
  },
  katakana: {
    basic: KATAKANA_BASIC,
    voiced: KATAKANA_VOICED,
    small: KATAKANA_SMALL,
  },
}

export function KanaKeyboard({
  script,
  section,
  onScriptChange,
  onSectionChange,
  onKey,
  onBackspace,
}: KanaKeyboardProps) {
  const rows = GRID[script][section]

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-surface p-3">
      {/* Script + section toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onScriptChange(s)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                script === s
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}
            >
              {s === 'hiragana' ? 'ひら' : 'カタ'}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(['basic', 'voiced', 'small'] as const).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSectionChange(sec)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                section === sec
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}
            >
              {SECTION_LABELS[sec]}
            </button>
          ))}
        </div>
      </div>

      {/* Kana grid */}
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-1">
            {row.map((cell, colIdx) =>
              cell === null ? (
                <div key={colIdx} />
              ) : (
                <button
                  key={colIdx}
                  type="button"
                  onClick={() => onKey(cell)}
                  className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2"
                >
                  {cell}
                </button>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Utility row */}
      <div className="grid grid-cols-5 gap-1">
        <div className="col-span-3" />
        <button
          type="button"
          onClick={() => onKey('ー')}
          className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2"
        >
          ー
        </button>
        <button
          type="button"
          onClick={onBackspace}
          aria-label="Backspace"
          className="flex h-11 items-center justify-center rounded-xl border border-border bg-bg text-fg-muted shadow-key active:bg-surface-2"
        >
          <BackspaceIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
