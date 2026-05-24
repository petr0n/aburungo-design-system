/**
 * AudioButton — purely presentational. Does not own or play audio.
 *
 * Three states:
 *   idle    → speaker icon, neutral chrome
 *   loading → spinner, disabled to presses
 *   playing → speaker icon, brand-tinted fill (subtle, not a celebration)
 *
 * Wrap with your own audio controller and pass state down.  Touch target 44px
 * via IconButton.
 */
import type { IconBaseProps } from './icons'
import { SpeakerIcon, SpinnerIcon } from './icons'
import { IconButton } from './ui/IconButton'

type AudioButtonState = 'idle' | 'loading' | 'playing'

type AudioButtonProps = {
  state?: AudioButtonState
  onPress: () => void
  /** Accessible label.  Defaults to "Play audio". */
  label?: string
  /** Disable presses entirely (e.g. when the phrase has no audioUrl). */
  disabled?: boolean
}

const ICON_PROPS: IconBaseProps = { className: 'h-5 w-5' }

export function AudioButton(props: AudioButtonProps) {
  const { state = 'idle', onPress, label = 'Play audio', disabled = false } = props

  const isLoading = state === 'loading'
  const isPlaying = state === 'playing'

  return (
    <IconButton
      aria-label={label}
      aria-pressed={isPlaying}
      onClick={onPress}
      disabled={disabled || isLoading}
      variant={isPlaying ? 'filled' : 'default'}
    >
      {isLoading ? (
        <SpinnerIcon {...ICON_PROPS} className="h-5 w-5 animate-spin" />
      ) : (
        <SpeakerIcon {...ICON_PROPS} />
      )}
    </IconButton>
  )
}
