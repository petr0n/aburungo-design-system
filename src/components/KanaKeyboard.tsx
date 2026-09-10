/**
 * KanaKeyboard — kana entry, consonant-first, with marks rather than boards.
 *
 * The gojūon grid this replaced was ten rows at the 44px touch floor, plus
 * toggles and a utility row: **596px of a 780px phone**. It left nothing for
 * the thing being answered, and `FillInput` — which nests the keyboard inside a
 * bordered display block — could not fit at any viewport a phone has.
 *
 * So the keyboard is a pad of one key per consonant row. Press one and its
 * five vowels float over the pad, anchored to the key under the thumb; slide
 * onto the one you want and lift. Release without moving and you get the row's
 * own kana, so あ is one press and い is a press and a slide.
 *
 * This is not an invention. It is the information architecture every Japanese
 * phone keyboard already uses, and now the gesture too: the popup is what
 * Gboard shows on a long press, driven by pointer capture so the release
 * decides, not a second tap.
 *
 * **Voiced and small kana are marks, not boards.** They used to be two more
 * boards behind a section toggle, which meant が cost three taps and you had
 * to know which board が lived on before you could go looking for it — the one
 * thing a learner does not yet know. Now か is typed and then marked, the
 * order every Japanese keyboard uses, and the mark keys sit on the pad where
 * the section toggles used to sit in the header.
 *
 * **Three columns**, so a key is a thumb wide rather than a fingertip. The
 * height that costs is paid back by the popup: the vowels no longer occupy a
 * row of their own above the pad, because they float over it.
 *
 * The groups derive from the existing data: every row in `HIRAGANA_BASIC` is
 * already a consonant group, so the pad key is the row's first cell. No new
 * table to keep in step.
 */
import { useRef, useState } from 'react'
import type { KanaModifier, KanaRow } from '../lib/kanaData'
import {
  applyKanaModifier,
  HIRAGANA_BASIC,
  KATAKANA_BASIC,
} from '../lib/kanaData'
import { BackspaceIcon } from './icons'

export type KanaScript = 'hiragana' | 'katakana'

export type KanaKeyboardProps = {
  script: KanaScript
  /**
   * The kana entered so far. Only its last character is ever read, by the
   * mark keys — a mark applies to the character just typed.
   */
  value: string
  onScriptChange: (script: KanaScript) => void
  onKey: (kana: string) => void
  onBackspace: () => void
  /**
   * Replace the last character, for the mark keys.
   *
   * Explicit rather than a backspace followed by a key press: that pair only
   * composes correctly if the consumer happens to update state functionally,
   * and a consumer that reads its own state instead would drop a character
   * with nothing to show for it.
   */
  onReplaceLast: (kana: string) => void
}

const BASIC: Record<KanaScript, readonly KanaRow[]> = {
  hiragana: HIRAGANA_BASIC,
  katakana: KATAKANA_BASIC,
}

/**
 * The flick cross. A row is [a, i, u, e, o]; the centre is the row's own kana
 * and the four arms are the vowels, in the positions Japanese flick input has
 * used since feature phones — い left, う up, え right, お down. Written as
 * explicit grid cells so a row with holes (や, わ) leaves the arm empty rather
 * than sliding the next kana into it.
 */
const CROSS: readonly { slot: number; cell: string }[] = [
  { slot: 2, cell: 'col-start-2 row-start-1' }, // u
  { slot: 1, cell: 'col-start-1 row-start-2' }, // i
  { slot: 0, cell: 'col-start-2 row-start-2' }, // the row's own kana
  { slot: 3, cell: 'col-start-3 row-start-2' }, // e
  { slot: 4, cell: 'col-start-2 row-start-3' }, // o
]

const MARKS: readonly { mark: KanaModifier; label: string; name: string }[] = [
  { mark: 'dakuten', label: '゛', name: 'Voiced mark' },
  { mark: 'handakuten', label: '゜', name: 'Half-voiced mark' },
  { mark: 'small', label: '小', name: 'Small kana' },
]

// Chrome buttons on the Rokushō ground: the script toggle.
//
// `whitespace-nowrap` and tight padding because these have to survive a narrow
// container. Inside a Card the keyboard gets ~310px rather than the ~360px it
// has standalone, and five toggles at `px-3` wrapped their labels — "ひら"
// stacking to two lines — which silently doubled the row's height.
// min-w-[44px] as well as min-h: the height was right and the WIDTH was not.
// Short labels -- 小 at 30px, ひら at 40px -- cleared the 44px height and were
// still too narrow to hit, which reads as compliant in the source and is not.
const TOGGLE = 'flex h-11 min-h-[44px] flex-1 touch-none select-none items-center justify-center whitespace-nowrap rounded-lg px-1 font-jp text-caption font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-on-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-keyboard-bg'
const TOGGLE_ON = 'bg-focus text-inverse-on-ogon'
const TOGGLE_OFF = 'border border-key-bg/40 text-key-bg hover:bg-rokusho-800 active:bg-rokusho-800'

// Warm-paper keys — reading the kana is the task, so they stay maximally
// legible. Split so the open-group key SWAPS its background rather than
// stacking a second `bg-*`: two of those have equal specificity, and which one
// wins depends on stylesheet order rather than the order they are written.
const KEY_BASE = 'flex h-11 min-h-[44px] touch-none select-none items-center justify-center rounded-xl font-jp text-jp-lg shadow-key ' +
  'transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-on-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-keyboard-bg'
const KEY = `${KEY_BASE} bg-key-bg text-key-fg hover:bg-key-press active:bg-key-press`

// A mark key that does nothing to the last character is disabled rather than
// hidden: the pad would reflow under the thumb mid-word. `disabled:opacity-40`
// is the same vocabulary Button uses, and WCAG 1.4.3 exempts disabled
// controls, so this does not owe the contrast gate a ratio.
const KEY_MARK = `${KEY} disabled:opacity-40`

// The open consonant key inverts instead of taking a ring. An Ōgon ring on a
// warm-paper key is 2.4:1 — the exact failure `check-adherence` guards against
// — and inverting reuses the selected-state vocabulary the toggles already use.
const KEY_OPEN = `${KEY_BASE} bg-focus text-inverse-on-ogon`

export function KanaKeyboard({
  script,
  value,
  onScriptChange,
  onKey,
  onBackspace,
  onReplaceLast,
}: KanaKeyboardProps) {
  /** Index of the open consonant group, or null when the pad is closed. */
  const [openGroup, setOpenGroup] = useState<number | null>(null)

  const rows = BASIC[script]
  // Rows keep their holes. や is [や, null, ゆ, null, よ] and わ is
  // [わ, null, null, を, ん]: filtering the nulls out would slide ゆ into the
  // left arm of the cross, where い lives on every other row. The face is
  // row[0], so a row without one is dropped rather than indexed into.
  const groups = rows.filter((row) => row[0] !== null)

  // Switching script invalidates the open group's index.
  function changeScript(next: KanaScript) {
    setOpenGroup(null)
    onScriptChange(next)
  }

  function pick(kana: string) {
    onKey(kana)
    setOpenGroup(null)
  }

  /**
   * Where the press started, so release can tell a flick from a click.
   * A ref rather than state: it changes every pointermove and nothing renders
   * from it.
   */
  const origin = useRef<{ x: number; y: number } | null>(null)

  /**
   * Pointer capture on the consonant key, so the release lands here wherever
   * the thumb has travelled — over a kana in the cross, back on the key, or
   * off the board. Without capture the cross would have to catch its own
   * pointerup, and a thumb that slid off the edge would leave it open.
   */
  function openOn(index: number, e: React.PointerEvent<HTMLButtonElement>) {
    setOpenGroup(index)
    origin.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  /**
   * A flick selects; a click opens and stays.
   *
   * The first version typed on every release, which reads fine under a thumb
   * and is unusable with a mouse: press and release land on the same pixel, so
   * the cross resolved to its centre before you could move to an arm. Nothing
   * but the base kana was reachable by clicking.
   *
   * So the release only selects if the pointer actually travelled — 8px, about
   * the slop of a deliberate tap. Otherwise the cross stays up and the next
   * click on an arm picks it. Touch gets one gesture, mouse gets two clicks,
   * and neither has to know which one the keyboard expected.
   *
   * `elementFromPoint` rather than the event target: with capture the target is
   * always the key that was pressed, so the thing under the pointer has to be
   * asked for by position.
   */
  const FLICK_SLOP = 8

  function releaseOver(e: React.PointerEvent<HTMLButtonElement>) {
    const from = origin.current
    origin.current = null
    if (from === null) return
    const moved = Math.hypot(e.clientX - from.x, e.clientY - from.y) > FLICK_SLOP
    if (!moved) return
    const under = document.elementFromPoint(e.clientX, e.clientY)
    const kana = under?.closest<HTMLElement>('[data-kana]')?.dataset.kana
    if (kana !== undefined) pick(kana)
    else setOpenGroup(null)
  }

  return (
    <div
      className="flex w-max flex-col gap-2 rounded-2xl border-2 border-keyboard-rule bg-keyboard-bg p-3"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpenGroup(null)
      }}
    >
      <div className="flex w-[13rem] items-center gap-1 self-center">
        {(['hiragana', 'katakana'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeScript(s)}
            aria-pressed={script === s}
            className={`${TOGGLE} ${script === s ? TOGGLE_ON : TOGGLE_OFF}`}
          >
            {s === 'hiragana' ? 'ひら' : 'カタ'}
          </button>
        ))}
      </div>

      {/* The pad. Ten consonant keys fill three columns and leave two cells in
          the fourth row, which ー and backspace take; the marks get a row of
          their own and space spans the width, where a thumb expects it.

          Fixed width, not full width. Stretched across a desktop viewport the
          keys became long rectangles with a kana adrift in the middle; at
          13rem a key is a 67px square at any screen size, which is the shape the
          thumb and the eye both expect. */}
      <div className="mx-auto grid w-[13rem] grid-cols-3 gap-1">
        {groups.map((row, i) => {
          const face = row[0] as string
          return (
            <div key={face} className="relative">
              <button
                type="button"
                data-kana={face}
                aria-expanded={openGroup === i}
                aria-label={`${face} row`}
                onPointerDown={(e) => openOn(i, e)}
                onPointerUp={releaseOver}
                onPointerCancel={() => setOpenGroup(null)}
                // A click with no detail is a keyboard Enter or Space. Pointer
                // input is handled on release, so only the keyboard path
                // toggles here; acting on both would fire twice.
                onClick={(e) => {
                  if (e.detail === 0) setOpenGroup(openGroup === i ? null : i)
                }}
                className={`${openGroup === i ? KEY_OPEN : KEY} aspect-square h-auto w-full`}
              >
                {face}
              </button>

              {openGroup === i && (
                <div
                  role="group"
                  aria-label={`${face} row`}
                  // The cross, centred ON the key rather than parked above it:
                  //
                  //        う
                  //     い あ え
                  //        お
                  //
                  // which is the flick layout every Japanese phone keyboard
                  // uses. Centring it on the key means a release that has not
                  // moved is already over the centre cell, so the geometry
                  // agrees with the gesture instead of fighting it. The board
                  // does not clip, so an edge key overhangs rather than
                  // shifting the arms away from the finger.
                  className="absolute left-1/2 top-1/2 z-30 grid w-max -translate-x-1/2 -translate-y-1/2 grid-cols-[repeat(3,2.75rem)] grid-rows-[repeat(3,2.75rem)] gap-1 rounded-xl bg-rokusho-800 p-1 shadow-key"
                >
                  {CROSS.map(({ slot, cell }) => {
                    const kana = row[slot]
                    if (kana === null || kana === undefined) {
                      return <span key={cell} className={`${cell} h-11 w-11`} aria-hidden="true" />
                    }
                    return (
                      <button
                        key={cell}
                        type="button"
                        data-kana={kana}
                        onClick={() => pick(kana)}
                        className={`${KEY} ${cell} h-11 w-11`}
                      >
                        {kana}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <button type="button" onClick={() => pick('ー')} className={`${KEY} aspect-square h-auto`}>
          ー
        </button>
        <button
          type="button"
          onClick={onBackspace}
          aria-label="Backspace"
          className={`${KEY} aspect-square h-auto`}
        >
          <BackspaceIcon className="h-5 w-5" />
        </button>

        {MARKS.map(({ mark, label, name }) => {
          const marked = applyKanaModifier(value, mark)
          return (
            <button
              key={mark}
              type="button"
              disabled={marked === null}
              aria-label={name}
              onClick={() => {
                if (marked !== null) onReplaceLast(marked)
                setOpenGroup(null)
              }}
              className={`${KEY_MARK} aspect-square h-auto`}
            >
              {label}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => pick(' ')}
          aria-label="Space"
          className={`${KEY} col-span-3`}
        >
          <span className="text-caption text-key-fg/60">space</span>
        </button>
      </div>
    </div>
  )
}
