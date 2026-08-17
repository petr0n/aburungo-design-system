/**
 * Landing and sign-in, rebuilt on the real components.
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
 * (`variant="primary"`) and the hanko above it is the mark rather than a
 * button. That was the other thing the old screen had backwards: it spent the
 * accent variant on a call to action.
 */
import { useState } from 'react'
import { Button, TextInput } from '../../src/components'

export function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* .hanko draws the ア from a mask and takes no children. */}
        <span className="hanko" style={{ fontSize: 96 }} aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold tracking-tight text-fg-heading">AburunGo</h1>
          <p className="text-body-lg text-fg-muted">Practical Japanese for real life.</p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button fullWidth onClick={onStart}>
          Sign in
        </Button>
        <Button variant="secondary" fullWidth onClick={onStart}>
          Create account
        </Button>
      </div>
    </main>
  )
}

export function SignInScreen({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [email, setEmail] = useState('hello@aburungo.app')
  const [password, setPassword] = useState('correct-horse-battery')
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      onSubmit()
    }, 600)
  }

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 pb-10 pt-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <h2 className="text-body-lg font-semibold text-fg-heading">Sign in</h2>
        {/* balances the back button so the title stays optically centred */}
        <span className="w-16" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
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
          autoComplete="current-password"
        />
        <Button fullWidth type="submit" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-body-sm text-fg-subtle">
        New here?{' '}
        <button
          type="button"
          onClick={onSubmit}
          className="min-h-[44px] font-medium text-link underline-offset-2 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Create an account
        </button>
      </p>
    </main>
  )
}
