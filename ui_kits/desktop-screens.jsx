// Five desktop variants for the AburunGo design system.
// Built on the existing primitives in mobile/components.jsx — same Button,
// Card, Badge, AudioButton, PhraseCard, etc.  Only the screen-level layout
// differs.  This is the canvas the user picks from.

const SAMPLE_PHRASE = {
  scenario: 'restaurant',
  japanese: 'お会計お願いします',
  reading: 'おかいけいおねがいします',
  romaji: 'okaikei onegai shimasu',
  english: 'The check, please.',
  notes: '"Okanjou" is a common alternative at smaller places.',
};

const SCENARIOS = [
  { id: 'transit', label: 'Transit', count: 8, due: 3 },
  { id: 'restaurant', label: 'Restaurant', count: 12, due: 5 },
  { id: 'shopping', label: 'Shopping', count: 6, due: 0 },
  { id: 'pharmacy', label: 'Pharmacy', count: 4, due: 2 },
  { id: 'directions', label: 'Directions', count: 9, due: 1 },
  { id: 'small-talk', label: 'Small talk', count: 7, due: 4 },
];

// ────────────────────────────────────────────────────────────────────────
//  A · Centered narrow — conservative.  Same review card as mobile,
//  centered in a clean desktop canvas with a small app header.
// ────────────────────────────────────────────────────────────────────────
function CenteredVariant() {
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border px-10 py-4">
        <div className="flex items-center gap-3">
          <img src="../assets/logo.svg" alt="" width="22" height="21"/>
          <span className="text-body-lg font-semibold text-fg">AburunGo</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-body-sm text-fg-subtle">3 of 8 due today</span>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-[37%] bg-brand-500"/>
          </div>
          <Button variant="ghost" size="sm">Sign out</Button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-10">
        <div className="w-full max-w-xl">
          <PhraseCard
            scenario={SAMPLE_PHRASE.scenario}
            japanese={SAMPLE_PHRASE.japanese}
            reading={SAMPLE_PHRASE.reading}
            english={SAMPLE_PHRASE.english}
            notes={SAMPLE_PHRASE.notes}
            audioSlot={<AudioButton onPress={() => {}}/>}
            footer={
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="secondary" size="md" fullWidth>Didn't</Button>
                <Button variant="primary" size="md" fullWidth>Got it</Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
//  B · Two-pane — sidebar with scenarios + progress, main pane with review.
//  The most "desktop app" of the three.  Familiar metaphor.
// ────────────────────────────────────────────────────────────────────────
function TwoPaneVariant() {
  return (
    <div className="flex h-full w-full bg-bg">
      <aside className="flex w-64 flex-col gap-6 border-r border-border bg-surface px-4 py-6">
        <div className="flex items-center gap-3 px-2">
          <img src="../assets/logo.svg" alt="" width="22" height="21"/>
          <span className="text-body-lg font-semibold text-fg">AburunGo</span>
        </div>

        <nav className="flex flex-col gap-1">
          <div className="px-2 pb-1 text-caption uppercase tracking-wider text-fg-subtle">Scenarios</div>
          {SCENARIOS.map((s, i) => (
            <button key={s.id}
              className={[
                'flex items-center justify-between rounded-lg px-3 py-2 text-left text-body-sm',
                i === 1 ? 'bg-bg text-fg shadow-card' : 'text-fg-muted hover:bg-bg active:bg-bg',
              ].join(' ')}>
              <span className="font-medium">{s.label}</span>
              <span className={[
                'rounded-md px-1.5 py-0.5 text-caption',
                s.due > 0 ? 'bg-brand-100 text-brand-700' : 'bg-surface-2 text-fg-faint'
              ].join(' ')}>{s.due > 0 ? `${s.due} due` : 'caught up'}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 px-2">
          <div className="flex items-center justify-between text-body-sm text-fg-subtle">
            <span>Today</span><span className="font-mono">15 / 23</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-brand-500" style={{width: '65%'}}/>
          </div>
          <Button variant="ghost" size="sm" fullWidth>Sign out</Button>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-12">
        <div className="w-full max-w-xl">
          <PhraseCard
            scenario={SAMPLE_PHRASE.scenario}
            japanese={SAMPLE_PHRASE.japanese}
            reading={SAMPLE_PHRASE.reading}
            english={SAMPLE_PHRASE.english}
            notes={SAMPLE_PHRASE.notes}
            audioSlot={<AudioButton onPress={() => {}}/>}
            footer={
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="secondary" size="md" fullWidth>Didn't</Button>
                <Button variant="primary" size="md" fullWidth>Got it</Button>
              </div>
            }
          />
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
//  C · Focused — phrase huge, no card chrome, keyboard-driven.
//  An ambient, library-quiet study mode.  Desktop earns the room.
// ────────────────────────────────────────────────────────────────────────
function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border border-border bg-bg px-2 font-mono text-caption text-fg-muted shadow-key">
      {children}
    </kbd>
  );
}

function FocusVariant() {
  return (
    <div className="relative flex h-full w-full flex-col bg-bg">
      <header className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-3">
          <img src="../assets/logo.svg" alt="" width="22" height="21"/>
          <span className="text-body-lg font-semibold text-fg">AburunGo</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-caption uppercase tracking-wider text-fg-subtle">Restaurant · 6 of 12</span>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-brand-500" style={{width: '50%'}}/>
          </div>
          <Button variant="ghost" size="sm">Exit session</Button>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <p lang="ja" className="font-jp text-jp-hero text-fg">{SAMPLE_PHRASE.japanese}</p>
          <p lang="ja" className="font-jp text-jp-lg text-fg-muted">{SAMPLE_PHRASE.reading}</p>
          <p className="text-body-lg italic text-fg-subtle">{SAMPLE_PHRASE.romaji}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-bg px-5 text-body-sm font-medium text-fg-muted active:bg-surface-2">
            <SpeakerIcon className="h-4 w-4"/> Play audio <Kbd>P</Kbd>
          </button>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border px-12 py-5">
        <div className="flex items-center gap-5 text-body-sm text-fg-subtle">
          <span className="flex items-center gap-2"><Kbd>Space</Kbd> Show answer</span>
          <span className="flex items-center gap-2"><Kbd>1</Kbd> Didn't</span>
          <span className="flex items-center gap-2"><Kbd>2</Kbd> Got it</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">Didn't</Button>
          <Button variant="primary" size="md">Got it</Button>
        </div>
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
//  Landing — hero + side illustration.
// ────────────────────────────────────────────────────────────────────────
function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-12 py-5">
      <div className="flex items-center gap-3">
        <img src="../assets/logo.svg" alt="" width="22" height="21"/>
        <span className="text-body-lg font-semibold text-fg">AburunGo</span>
      </div>
      <nav className="flex items-center gap-7 text-body-sm text-fg-muted">
        <a href="#" className="hover:text-fg">How it works</a>
        <a href="#" className="hover:text-fg">Scenarios</a>
        <a href="#" className="hover:text-fg">About</a>
        <Button variant="primary" size="sm">Sign in</Button>
      </nav>
    </header>
  );
}

function LandingHeroVariant() {
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <LandingHeader/>
      <section className="grid flex-1 grid-cols-2 gap-10 px-16 py-12">
        <div className="flex flex-col justify-center gap-6">
          <Badge emphasis>Practical Japanese</Badge>
          <h1 className="text-display-lg font-bold tracking-tight text-fg">
            Ready to use Japanese in real life.
          </h1>
          <p className="max-w-md text-body-lg text-fg-subtle">
            Phrases for the situations you actually run into — transit, restaurants,
            day-to-day interactions. Short focused reviews. Nothing in the way.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="accent" size="md">Start learning</Button>
            <Button variant="secondary" size="md">Browse scenarios</Button>
          </div>
          <div className="flex items-center gap-3 pt-3 text-body-sm text-fg-subtle">
            <span className="inline-flex h-2 w-2 rounded-full bg-success-500"/>
            No streaks, no XP, no mascots. Ever.
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src="../assets/hero.png" alt="" width="360" height="360" className="select-none"/>
        </div>
      </section>
    </div>
  );
}

function LandingStackedVariant() {
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <LandingHeader/>
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-16 text-center">
        <img src="../assets/hero.png" alt="" width="200" height="200" className="select-none"/>
        <Badge emphasis>Practical Japanese</Badge>
        <h1 className="max-w-3xl text-display-lg font-bold tracking-tight text-fg">
          Ready to use Japanese in real life.
        </h1>
        <p className="max-w-xl text-body-lg text-fg-subtle">
          Phrases for the situations you actually run into. Short focused reviews. Nothing in the way.
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="accent" size="md">Start learning</Button>
          <Button variant="secondary" size="md">Browse scenarios</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
          {SCENARIOS.slice(0, 6).map((s) => (
            <span key={s.id}
              className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-body-sm text-fg-muted">
              {s.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, {
  CenteredVariant, TwoPaneVariant, FocusVariant,
  LandingHeroVariant, LandingStackedVariant,
});
