/**
 * An iPhone frame — status bar, Dynamic Island, home indicator.
 *
 * Ported from `ios-frame.jsx`, which also carried `IOSNavBar`, `IOSList`,
 * `IOSListRow`, `IOSGlassPill` and a full `IOSKeyboard`: ~280 lines of native
 * iOS widgets that AburunGo does not render. The product draws its own
 * `AppHeader` and its own kana keyboard, so those were a second design system
 * sitting unused next to ours. Only the device shell survived the port.
 *
 * **Raw hex and inline styles are correct here and only here.** This is Apple's
 * chrome, not ours — `#F2F2F7`, the black island, the 0.25-alpha home indicator
 * are iOS values, and expressing them as AburunGo tokens would claim they are
 * part of this palette. `check-adherence.mjs` scopes itself to
 * `src/components/**` for exactly this reason. Nothing in this file ships.
 */
import type { ReactNode } from 'react'

function StatusBar({ dark }: { dark: boolean }) {
  const c = dark ? '#fff' : '#000'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '21px 26px 19px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 20,
        width: '100%',
      }}
    >
      <span
        style={{
          flex: 1,
          fontFamily: '-apple-system, "SF Pro", system-ui',
          fontWeight: 590,
          fontSize: 17,
          lineHeight: '22px',
          color: c,
        }}
      >
        9:41
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
        <svg width="19" height="12" viewBox="0 0 19 12" aria-hidden="true">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c} />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c} />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c} />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c} />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden="true">
          <path
            d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z"
            fill={c}
          />
          <path
            d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
            fill={c}
          />
          <circle cx="8.5" cy="10.5" r="1.5" fill={c} />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

type Props = {
  children: ReactNode
  /**
   * Whether the safe-area strip behind the status bar is the product's dark
   * header band or its warm-stone page ground — which decides both the strip's
   * colour and whether the glyphs are white or black.
   *
   * Rendered wrong first: the strip was left as page ground while the glyphs
   * stayed white, so the clock and the battery were white on `#F7F6F1` at the
   * top of every flow. A real iOS nav bar extends its own colour up through the
   * safe area, and that is what the band does here.
   */
  dark?: boolean
}

/**
 * 402 × 874 is the iPhone 16 Pro logical size. `data-phone` is the same handle
 * the flows harness uses, so `scripts/check-touch-targets.mjs` and the
 * responsive sweep clip to the screen here too without knowing which harness
 * they are looking at.
 */
export function Device({ children, dark = true }: Props) {
  return (
    <div
      data-phone
      style={{
        width: 402,
        height: 874,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 11,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 37,
          borderRadius: 24,
          background: '#000',
          zIndex: 50,
        }}
      />
      {/* The safe-area strip: 62px clears the island, and it wears the same
          colour as whatever the product puts directly under it. An AppHeader
          tucked *behind* the island would lose its title to a black pill, so
          the band starts below the strip and the strip borrows its colour. */}
      <div
        className={`absolute inset-x-0 top-0 z-10 ${dark ? 'bg-inverse' : 'bg-bg'}`}
        style={{ height: 62 }}
      >
        <StatusBar dark={dark} />
      </div>
      <div className="flex h-full flex-col bg-bg" style={{ paddingTop: 62 }}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: 34,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: 8,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.25)' }} />
      </div>
    </div>
  )
}
