/**
 * KanaKeyboard — kana entry, consonant-first.
 *
 * The gojūon grid this replaced was ten rows at the 44px touch floor, plus
 * toggles and a utility row: **596px of a 780px phone**. It left nothing for
 * the thing being answered, and `FillInput` — which nests the keyboard inside a
 * bordered display block — could not fit at any viewport a phone has.
 *
 * So the keyboard is a 12-key pad: one key per consonant row, and tapping it
 * opens that row's five vowels above the pad. 256px closed, 308px open.
 *
 * This is not an invention. It is the information architecture every Japanese
 * phone keyboard already uses — flick input, without the gesture. Two taps
 * instead of one, in exchange for the screen back, and the two taps trace the
 * consonant/vowel structure a learner is building anyway.
 *
 * The groups derive from the existing data: every row in `HIRAGANA_BASIC` is
 * already a consonant group, so the pad key is the row's first cell. No new
 * table to keep in step.
 */
import { useState } from 'react'
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
  hiragana: { basic: HIRAGANA_BASIC, voiced: HIRAGANA_VOICED, small: HIRAGANA_SMALL },
  katakana: { basic: KATAKANA_BASIC, voiced: KATAKANA_VOICED, small: KATAKANA_SMALL },
}

/** Chrome buttons on the Rokushō ground: script and section toggles. */
const TOGGLE = 'h-11 min-h-[44px] rounded-lg px-3 font-jp text-body-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-on-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-keyboard-bg'
const TOGGLE_ON = 'bg-focus text-inverse-on-ogon'
const TOGGLE_OFF = 'border border-key-bg/40 text-key-bg active:bg-rokusho-800'

// Warm-paper keys — reading the kana is the task, so they stay maximally
// legible. Split so the open-group key SWAPS its background rather than
// stacking a second `bg-*`: two of those have equal specificity, and which one
// wins depends on stylesheet order rather than the order they are written.
const KEY_BASE = 'flex h-11 min-h-[44px] items-center justify-center rounded-xl font-jp text-jp shadow-key ' +
  'transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-on-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-keyboard-bg'
const KEY = `${KEY_BASE} bg-key-bg text-key-fg active:bg-key-press`

// The open consonant key inverts instead of taking a ring. An Ōgon ring on a
// warm-paper key is 2.4:1 — the exact failure `check-adherence` guards against
// — and inverting reuses the selected-state vocabulary the toggles already use.
const KEY_OPEN = `${KEY_BASE} bg-focus text-inverse-on-ogon`

export function KanaKeyboard({
  script,
  section,
  onScriptChange,
  onSectionChange,
  onKey,
  onBackspace,
}: KanaKeyboardProps) {
  /** Index of the open consonant group, or null when the pad is closed. */
  const [openGroup, setOpenGroup] = useState<number | null>(null)

  const rows = GRID[script][section]
  // Empty rows are dropped rather than indexed into. Today's data has none,
  // but `group[0]` on an empty row yields an undefined React key, an
  // "undefined row" aria-label and a blank key face — all silent.
  const groups = rows
    .map((row) => row.filter((c): c is string => c !== null))
    .filter((group) => group.length > 0)
  const open = openGroup !== null ? groups[openGroup] : undefined

  // Switching script or section invalidates the open group's index.
  function reset<T>(change: (value: T) => void) {
    return (value: T) => {
      setOpenGroup(null)
      change(value)
    }
  }

  function pick(kana: string) {
    onKey(kana)
    setOpenGroup(null)
  }

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-2xl border-2 border-keyboard-rule bg-keyboard-bg p-3"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpenGroup(null)
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => reset(onScriptChange)(s)}
              aria-pressed={script === s}
              className={`${TOGGLE} ${script === s ? TOGGLE_ON : TOGGLE_OFF}`}
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
              onClick={() => reset(onSectionChange)(sec)}
              aria-pressed={section === sec}
              className={`${TOGGLE} ${section === sec ? TOGGLE_ON : TOGGLE_OFF}`}
            >
              {SECTION_LABELS[sec]}
            </button>
          ))}
        </div>
      </div>

      {/* The open group's vowels, above the pad so the thumb travels up rather
          than over a key it is already touching. Absent, not hidden — an empty
          row would cost the 52px the compact layout exists to save. */}
      {open !== undefined && (
        <div
          role="group"
          aria-label={`${open[0]} row`}
          className="grid grid-cols-5 gap-1 rounded-xl bg-rokusho-800 p-1"
        >
          {open.map((kana) => (
            <button key={kana} type="button" onClick={() => pick(kana)} className={KEY}>
              {kana}
            </button>
          ))}
        </div>
      )}

      {/* 12-key pad: one key per consonant row, then ー and backspace. */}
      <div className="grid grid-cols-3 gap-1">
        {groups.map((group, i) => (
          <button
            key={group[0]}
            type="button"
            aria-expanded={openGroup === i}
            aria-label={`${group[0]} row`}
            onClick={() => setOpenGroup(openGroup === i ? null : i)}
            className={openGroup === i ? KEY_OPEN : KEY}
          >
            {group[0]}
          </button>
        ))}

        <button type="button" onClick={() => pick('ー')} className={KEY}>
          ー
        </button>
        <button
          type="button"
          onClick={onBackspace}
          aria-label="Backspace"
          className={KEY}
        >
          <BackspaceIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
