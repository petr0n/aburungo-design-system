/**
 * Barrel export for the AburunGo component library.
 *
 *   import { Button, Card, PhraseCard } from '@/components'
 *
 * Domain components live alongside primitives — the primitives in `./ui/`
 * are public, exported here.  Internal shared helpers (icons, hooks) are
 * NOT re-exported; import them from their submodule directly.
 */

// UI primitives
export { Button } from './ui/Button'
export { TextInput } from './ui/TextInput'
export { Card, CardHeader, CardBody, CardFooter } from './ui/Card'
export { Badge } from './ui/Badge'
export { IconButton } from './ui/IconButton'

// Domain components
export { PhraseCard } from './PhraseCard'
export type { PhraseAccent } from './PhraseCard'
export { KanaGrid } from './KanaGrid'
export type { KanaCell } from './KanaGrid'
export { ProgressBar } from './ProgressBar'
export { AudioButton } from './AudioButton'

// Layout + state components
export { AppHeader } from './AppHeader'
export { GlobalHeader } from './GlobalHeader'
export { LoadingPlaceholder } from './LoadingPlaceholder'
export { EmptyState } from './EmptyState'
export { ErrorState } from './ErrorState'
export { ScoreCard } from './ScoreCard'
export { FlipCard } from './FlipCard'
export type { FlipCardPhase } from './FlipCard'
export { KanaKeyboard } from './KanaKeyboard'
export type { KanaKeyboardProps, KanaScript, KanaSection } from './KanaKeyboard'
export { VoiceInput } from './VoiceInput'
export type { VoiceInputProps, VoiceInputStatus } from './VoiceInput'
export { FillInput } from './FillInput'
export type { FillInputProps, InputMode } from './FillInput'

// Correctness vocabulary — the mark, and the frame that carries it
export { Maru } from './Maru'
export type { AnswerOutcome } from './Maru'
export { AnswerResult } from './AnswerResult'
export { GradePair } from './GradePair'

// Iconography (named exports — tree-shake by import)
export {
  SpeakerIcon,
  MicIcon,
  BackspaceIcon,
  SpinnerIcon,
} from './icons'
export type { IconBaseProps } from './icons'
