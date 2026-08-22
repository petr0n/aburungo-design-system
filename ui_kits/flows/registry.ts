/**
 * Every flow, in one list.
 *
 * Both harnesses import this: `ui_kits/flows/` renders a flow beside its state
 * rail, `ui_kits/mobile/` renders the same flow inside an iOS device frame.
 * Adding a flow means adding it here once — there is no second list to keep in
 * step, which is what `ui_kits/mobile/screens.jsx` used to be.
 */
import type { ReactNode } from 'react'
import { bookOneFlow } from './book-one'
import { checkpointFlow } from './checkpoint'
import { flashcardFlow } from './flashcard-round'
import { fillFlow } from './fill-blank'
import { kanaFlow } from './kana-practice'
import { lessonsFlow } from './lesson-list'
import type { FlowDef } from './shell'

/**
 * A flow is generic over its own state union, and those unions have nothing
 * in common — `FlowDef<string>` would be wrong, because a flow's `go` accepts
 * only its own ids. Storing them in one array therefore needs the type
 * parameter hidden without being widened or cast away.
 *
 * `open` does that: it hands the flow to a callback that is itself generic, so
 * `T` is recovered at the moment of use and every call site stays exact. The
 * alternative was an `as` cast in the harness that is meant to be the one that
 * cannot lie about what it renders.
 */
type FlowUser<R> = <T extends string>(flow: FlowDef<T>) => R

export type FlowEntry = {
  id: string
  label: string
  open: <R>(use: FlowUser<R>) => R
}

function entry<T extends string>(flow: FlowDef<T>): FlowEntry {
  return { id: flow.id, label: flow.label, open: (use) => use(flow) }
}

export const FLOWS: readonly FlowEntry[] = [
  entry(flashcardFlow),
  entry(kanaFlow),
  entry(fillFlow),
  entry(lessonsFlow),
  entry(checkpointFlow),
  entry(bookOneFlow),
]

export function flowById(id: string): FlowEntry {
  return FLOWS.find((f) => f.id === id) ?? FLOWS[0]
}

/** Convenience for the common case: render the flow with a generic renderer. */
export function renderFlow(entry: FlowEntry, render: FlowUser<ReactNode>): ReactNode {
  return entry.open(render)
}
