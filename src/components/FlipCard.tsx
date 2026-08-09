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
      {/*
        Both faces sit in the SAME grid cell rather than the back being
        positioned absolutely. Absolute took the back out of flow, so the
        container only ever measured the front — and the back is always taller,
        since it carries the answer the front is hiding. It clipped, and every
        call site had to pin a min-height it guessed. Grid overlaps them while
        letting both size the track, so the card is as tall as its taller face
        and neither jumps on flip.

        Each face is itself a grid so its single child stretches to the cell.
        Without that the container is stable but the card inside still resizes
        mid-flip — 288px front against a 339px back — which reads as the card
        growing as it turns.
      */}
      <div
        className="grid w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="grid" style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden' }}>
          {front}
        </div>
        <div
          className="grid"
          style={{
            gridArea: '1 / 1',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
