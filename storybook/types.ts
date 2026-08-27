/**
 * The story contract, and the narrowing helpers that go with it.
 *
 * Controls hand back whatever the DOM gives them — a text input yields a
 * string, a select yields whichever option string was chosen, a range yields a
 * number. That is a genuine trust boundary: `args` cannot be typed as the
 * component's props, because at runtime it holds whatever the panel last set.
 *
 * So args are `ArgValue` and each story narrows at the point of use with the
 * helpers below. `CLAUDE.md` bans `as` casts outside a validated boundary, and
 * this is the validation — `pick` is the same shape as `fromUrl` in
 * `ui_kits/flows/shell.tsx`, for the same reason: an unknown string arrives
 * from outside and only a known one may leave.
 */
import type { ReactNode } from 'react'

export type ArgValue = string | number | boolean
export type Args = Record<string, ArgValue>

export type ArgType =
  | { control: 'text' }
  | { control: 'boolean' }
  | { control: 'select'; options: readonly string[] }
  | { control: 'range'; min: number; max: number; step: number }

export type Story = {
  render: (a: Args) => ReactNode
  args?: Args
  argTypes?: Record<string, ArgType>
  /** The snippet shown on the Code tab. Hand-written, so keep it true. */
  code?: (a: Args) => string
}

export type ComponentEntry = { name: string; stories: Record<string, Story> }
export type Section = { title: string; components: readonly ComponentEntry[] }

/** An arbitrary control value, narrowed to one of a known set. */
export function pick<T extends string>(
  v: ArgValue | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.find((x) => x === v) ?? fallback
}

export function str(v: ArgValue | undefined, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

export function bool(v: ArgValue | undefined): boolean {
  return v === true
}

export function num(v: ArgValue | undefined, fallback = 0): number {
  return typeof v === 'number' ? v : fallback
}
