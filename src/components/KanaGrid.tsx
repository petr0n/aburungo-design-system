/**
 * KanaGrid — tap-input keyboard of kana characters.
 *
 * Generous touch targets (44px), 5-column grid (matches the gojuuon row
 * layout), clear active state.  Empty cells in a row are rendered as gaps
 * (null in the row).
 *
 * Purely presentational.  Owner of the keyboard composes rows from kana
 * data and listens for onSelect(kana).
 */
import type { KeyboardEvent } from 'react'

export type KanaCell = {
  kana: string
  romaji: string
}

type KanaRow = readonly (KanaCell | null)[]

type KanaGridProps = {
  rows: readonly KanaRow[]
  onSelect: (kana: string) => void
  /** Optional render for the JP key glyph.  Defaults to the kana itself. */
  renderKey?: (cell: KanaCell) => string
}

export function KanaGrid(props: KanaGridProps) {
  const { rows, onSelect, renderKey } = props

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, kana: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(kana)
    }
  }

  return (
    <div className="flex w-full flex-col gap-1 rounded-xl border border-border bg-surface p-3">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-5 gap-1">
          {row.map((cell, colIdx) =>
            cell === null ? (
              <div key={colIdx} aria-hidden="true" />
            ) : (
              <button
                key={colIdx}
                type="button"
                aria-label={`${cell.kana} (${cell.romaji})`}
                onClick={() => onSelect(cell.kana)}
                onKeyDown={(event) => handleKeyDown(event, cell.kana)}
                className={[
                  'flex h-11 min-h-[44px] items-center justify-center',
                  'rounded-lg border border-border bg-bg shadow-key',
                  'font-jp text-jp-lg text-fg',
                  'transition-colors active:bg-surface-2',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                ].join(' ')}
              >
                {renderKey !== undefined ? renderKey(cell) : cell.kana}
              </button>
            ),
          )}
        </div>
      ))}
    </div>
  )
}
