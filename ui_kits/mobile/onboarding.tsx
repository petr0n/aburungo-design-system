/**
 * Onboarding — one screen, two panes, a crossfade between them.
 *
 * It used to be two separate screens: tapping "Sign in" swapped the whole
 * surface, mark and all. Now the hanko and the wordmark hold still and only the
 * block beneath them changes — the buttons fade out and the fields fade in *in
 * the same place*, so the screen reads as one thing opening rather than two
 * screens replacing each other.
 *
 * The panes are stacked in one grid cell rather than swapped, which is what
 * makes "in the same place" literally true. The cell then animates to whichever
 * pane is showing — stacking alone sizes it to the *taller* of the two, which
 * left a block of dead space under the buttons before the fields had ever been
 * opened. See `useActivePaneHeight`.
 *
 * The hidden pane is `inert`, so it takes no tab stop and no screen reader
 * focus while it is invisible — opacity alone would leave a working but
 * unreachable form sitting behind the visible one.
 *
 * `motion-safe:` gates the transition. Under `prefers-reduced-motion` the panes
 * swap instantly instead of fading, which is the whole point of that setting;
 * nothing becomes invisible or unreachable either way.
 *
 * The versions these replace were the worst screens in the repo and had been
 * since `init commit`:
 *
 *   - **The primary CTA rendered as bare text.** Both buttons asked for
 *     `variant="accent"`. No `Button` has ever implemented `accent` — not the
 *     mirror, not `src/components/ui/Button.tsx`, which has `primary`,
 *     `secondary` and `ghost`. The variant map returned `undefined`, the class
 *     list came out empty, and "Sign in" was a line of text on the page. Plain
 *     JSX with no types could not say so; this file is typechecked, so the same
 *     mistake now fails the build.
 *   - **A violet 3D mark sat in the logo position.** `assets/hero.png`,
 *     described in the README as the product's one illustration, survived the
 *     entire v3 migration on five surfaces. The mark is the ア hanko —
 *     `CLAUDE.md`'s first rule — so that is what is here.
 *
 * Akane is the hanko and errors, never a CTA, so the primary action is Ai-iro
 * (`variant="primary"`). That was the other thing the old screen had backwards:
 * it spent the accent variant on a call to action.
 */
import { useLayoutEffect, useState } from 'react'
import type { FormEvent, ReactNode, Ref } from 'react'
import { Button, TextInput } from '../../src/components'

export type OnboardingPane = 'choose' | 'signin' | 'signup'

/**
 * Google's four-colour "G", at the official geometry.
 *
 * **Raw hex is correct here and only here**, the same exception `device.tsx`
 * takes for Apple's chrome: these are Google's trademark colours, not this
 * palette's. Their brand terms do not allow the mark to be recoloured, so
 * expressing it in AburunGo tokens would be both wrong and a licence problem —
 * and would quietly claim Google Blue is one of our five. `check-adherence.mjs`
 * scopes itself to `src/components/**`, which is why this file is allowed to
 * hold it and a shipped component would not be.
 */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

/**
 * Not a `Button` variant.
 *
 * A fourth variant would put Google's chrome in the shipped component library
 * for one call site, and the design rules say a component earns its place by
 * repeating. It is also the one control on the screen that is deliberately
 * *not* in the palette — the recognisability is the point — so it should not
 * look like a design-system button that happens to be white.
 *
 * Card ground rather than page ground, so it lifts the same way every other
 * surface does; `border` gives it the boundary a `1.09:1` fill cannot.
 */
function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <GoogleMark />
      Continue with Google
    </button>
  )
}

/** One cell of the crossfade. Both panes occupy the same grid area. */
function Pane({
  show,
  paneRef,
  children,
}: {
  show: boolean
  paneRef?: Ref<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <div
      ref={paneRef}
      inert={!show}
      aria-hidden={!show}
      className={[
        '[grid-area:1/1] flex flex-col gap-3',
        'motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out',
        show ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * Height of the pane that is currently showing.
 *
 * Stacking both panes in one grid cell is what makes "in the same place" true,
 * but it also sizes the cell to the *taller* of the two — which left a block of
 * dead space under the buttons before the fields had ever been opened. This
 * measures the active pane and animates the container to it, so the block grows
 * as the fields arrive and shrinks when they leave.
 *
 * `null` until the first measurement, which renders the container at `auto` so
 * the screen is never wrong on the first paint or with JS measurement skipped.
 */
function useActivePaneHeight(active: HTMLDivElement | null): number | null {
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (active === null) return
    const measure = () => setHeight(active.getBoundingClientRect().height)
    measure()
    // Fonts and the loading spinner both change the pane's height after mount.
    const observer = new ResizeObserver(measure)
    observer.observe(active)
    return () => observer.disconnect()
  }, [active])

  return height
}

export function OnboardingScreen({ start = 'choose' }: { start?: OnboardingPane }) {
  const [pane, setPane] = useState<OnboardingPane>(start)
  const [email, setEmail] = useState('hello@aburungo.app')
  const [password, setPassword] = useState('correct-horse-battery')
  const [loading, setLoading] = useState(false)

  const signingUp = pane === 'signup'

  // Two refs, one measured: whichever pane is showing drives the container.
  const [choosePane, setChoosePane] = useState<HTMLDivElement | null>(null)
  const [formPane, setFormPane] = useState<HTMLDivElement | null>(null)
  const height = useActivePaneHeight(pane === 'choose' ? choosePane : formPane)

  function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setPane('choose')
    }, 700)
  }

  // Anchored to the top, not centred. Centring re-balanced the whole column
  // every time the block grew, so the mark drifted up as the fields opened and
  // the fields did not quite land where the buttons had been -- which is the one
  // thing this screen is supposed to get right.
  return (
    <main className="flex flex-1 flex-col gap-10 px-6 pb-10 pt-20">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* .hanko draws the ア from a mask and takes no children. */}
        <span className="hanko" style={{ fontSize: 96 }} aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold tracking-tight text-fg-heading">AburunGo</h1>
          <p className="text-body-lg text-fg-muted">Practical Japanese for real life.</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div
          // `items-start` is load-bearing: a grid child stretches to the cell by
          // default, so measuring a pane returned the height of the TALLER one and
          // the container never shrank. Panes size to their content now.
          className="grid items-start overflow-hidden motion-safe:transition-[height] motion-safe:duration-300 motion-safe:ease-out"
          style={height === null ? undefined : { height }}
        >
          <Pane show={pane === 'choose'} paneRef={setChoosePane}>
            <Button fullWidth onClick={() => setPane('signin')}>
              Sign in
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setPane('signup')}>
              Create account
            </Button>
          </Pane>

          <Pane show={pane !== 'choose'} paneRef={setFormPane}>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={signingUp ? 'new-password' : 'current-password'}
              />
              <Button fullWidth type="submit" loading={loading}>
                {signingUp ? 'Create account' : 'Sign in'}
              </Button>
            </form>
            <Button variant="ghost" fullWidth onClick={() => setPane('choose')}>
              ← Back
            </Button>
          </Pane>
        </div>

        {/* Google sits outside the crossfade on purpose: it is an alternative to
            both paths, so taking it should not mean backing out of the one you
            just chose. */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="text-body-sm text-fg-subtle">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <GoogleButton onPress={() => setPane('choose')} />
      </div>
    </main>
  )
}
