import { MicIcon, SpinnerIcon } from './icons'

export type VoiceInputStatus = 'idle' | 'listening' | 'processing' | 'error'

export type VoiceInputProps = {
  status: VoiceInputStatus
  onPress: () => void
  disabled?: boolean
  errorMessage?: string
}

export function VoiceInput({ status, onPress, disabled, errorMessage }: VoiceInputProps) {
  const isListening = status === 'listening'
  const isProcessing = status === 'processing'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {isListening && (
          <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-error-500 opacity-30" />
        )}
        <button
          type="button"
          onClick={onPress}
          disabled={disabled ?? isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={[
            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isListening
              ? 'bg-error-500 text-fg-inverse active:bg-error-fg'
              : 'border-2 border-border-strong bg-bg text-fg-muted active:bg-surface-2',
            (disabled ?? isProcessing) ? 'opacity-50' : '',
          ].join(' ')}
        >
          {isProcessing ? (
            <SpinnerIcon className="h-5 w-5 animate-spin" />
          ) : (
            <MicIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <p className="text-body-sm text-fg-subtle">
        {status === 'idle' && 'Tap to speak'}
        {status === 'listening' && 'Listening… tap to stop'}
        {status === 'processing' && 'Processing…'}
        {status === 'error' && (
          <span className="text-error-fg">{errorMessage ?? 'Could not hear you. Try again.'}</span>
        )}
      </p>
    </div>
  )
}
