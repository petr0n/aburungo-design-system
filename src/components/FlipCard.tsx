import type { ReactNode } from 'react'

export type FlipCardPhase = 'entering' | 'idle' | 'exiting'

type Props = {
  front: ReactNode
  back: ReactNode
  flipped: boolean
  phase?: FlipCardPhase
  onEntered?: () => void
  onExited?: () => void
}

export function FlipCard({ front, back, flipped, phase = 'idle', onEntered, onExited }: Props) {
  const slideClass =
    phase === 'entering' ? 'animate-card-enter' :
    phase === 'exiting'  ? 'animate-card-exit'  : ''

  function handleAnimationEnd() {
    if (phase === 'entering') onEntered?.()
    if (phase === 'exiting')  onExited?.()
  }

  return (
    <div
      className={`w-full ${slideClass}`}
      onAnimationEnd={handleAnimationEnd}
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="w-full" style={{ backfaceVisibility: 'hidden' }}>
          {front}
        </div>
        <div
          className="absolute inset-0 w-full"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
