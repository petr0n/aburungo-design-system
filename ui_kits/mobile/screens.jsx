// AburunGo UI kit — screen-level compositions.
// Wraps the primitives into the four key screens of the product:
//   Landing → SignIn → Review → Empty

// ─── Phrase data — real, from src/content/phrases/*.yaml ───────────────────
const PHRASES = [
  { id: 'transit.station-where', scenario: 'transit',
    japanese: '駅はどこですか', reading: 'えきはどこですか',
    romaji: 'eki wa doko desu ka', english: 'Where is the station?',
    notes: 'Universal — works at info desks, on the street, at hotel front desks.' },
  { id: 'transit.next-train', scenario: 'transit',
    japanese: '次の電車は何時ですか', reading: 'つぎのでんしゃはなんじですか',
    romaji: 'tsugi no densha wa nanji desu ka', english: 'What time is the next train?' },
  { id: 'restaurant.this-please', scenario: 'restaurant',
    japanese: 'これをください', reading: 'これをください',
    romaji: 'kore o kudasai', english: "I'll have this.",
    notes: "The most useful single phrase in any Japanese restaurant — works even when you can't read the menu." },
  { id: 'restaurant.check-please', scenario: 'restaurant',
    japanese: 'お会計お願いします', reading: 'おかいけいおねがいします',
    romaji: 'okaikei onegai shimasu', english: 'The check, please.' },
];

const HIRAGANA_ROW1 = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' },
  { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
];
const HIRAGANA_ROW2 = [
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' },
  { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
];
const HIRAGANA_ROW3 = [
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' },
  { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
];
const HIRAGANA_ROW4 = [
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' },
  { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
];

// ─── App header — shown on all signed-in screens ───────────────────────────
function AppHeader({ onSignOut, progress }) {
  return (
    <header className="flex flex-col gap-2 pt-3 pb-2">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-body-lg font-semibold text-fg">AburunGo</h1>
        <Button variant="ghost" size="sm" onClick={onSignOut}>Sign out</Button>
      </div>
      <ProgressBar value={progress} />
    </header>
  );
}

// ─── Landing screen ────────────────────────────────────────────────────────
function LandingScreen({ onStart }) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <img src="../../assets/hero.png" alt="" width={180} height={180}
             className="select-none pointer-events-none"/>
        <h1 className="text-display font-bold tracking-tight text-fg">AburunGo</h1>
        <p className="text-body-lg text-fg-subtle">Practical Japanese for real life.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button variant="accent" size="md" fullWidth onClick={onStart}>Sign in</Button>
        <Button variant="secondary" size="md" fullWidth onClick={onStart}>Create account</Button>
      </div>
    </main>
  );
}

// ─── Sign in screen ────────────────────────────────────────────────────────
function SignInScreen({ onSubmit, onBack }) {
  const [email, setEmail] = React.useState('hello@aburungo.app');
  const [password, setPassword] = React.useState('••••••••');
  const [loading, setLoading] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => { setLoading(false); onSubmit(); }, 600);
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-8 px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
        <h2 className="text-body-lg font-semibold text-fg">Sign in</h2>
        <span className="w-12"/>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextInput label="Email" type="email" value={email}
                   onChange={(e) => setEmail(e.target.value)} autoComplete="email"/>
        <TextInput label="Password" type="password" value={password}
                   onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
        <Button variant="accent" size="md" fullWidth type="submit" loading={loading}>
          Sign in
        </Button>
      </form>
      <p className="text-center text-body-sm text-fg-subtle">
        New here?{' '}
        <button type="button" className="font-medium text-brand-500 underline-offset-2 hover:underline">
          Create an account
        </button>
      </p>
    </main>
  );
}

// ─── Review screen (fill-in-the-blank) ─────────────────────────────────────
function ReviewScreen({ onSignOut, onComplete }) {
  const [index, setIndex] = React.useState(0);
  const [mode, setMode] = React.useState('romaji'); // romaji | kana | system
  const [romaji, setRomaji] = React.useState('');
  const [kana, setKana] = React.useState('');
  const [phase, setPhase] = React.useState('input'); // input | result
  const [correct, setCorrect] = React.useState(false);
  const [audio, setAudio] = React.useState('idle');

  const phrase = PHRASES[index];

  function check() {
    const answer = mode === 'romaji' ? romaji : kana;
    const isCorrect = answer.replace(/\s+/g, '').includes(phrase.reading.slice(0, 3));
    setCorrect(isCorrect);
    setPhase('result');
  }
  function next() {
    setPhase('input'); setRomaji(''); setKana('');
    if (index < PHRASES.length - 1) setIndex(index + 1);
    else onComplete();
  }
  function playAudio() {
    setAudio('loading');
    window.setTimeout(() => setAudio('playing'), 250);
    window.setTimeout(() => setAudio('idle'), 1400);
  }

  const progress = (index + (phase === 'result' ? 0.5 : 0)) / PHRASES.length;

  const modes = [
    { id: 'romaji', label: 'Romaji' },
    { id: 'kana', label: 'Kana grid' },
    { id: 'system', label: 'JP keyboard' },
  ];

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-5 px-4 pb-6">
      <AppHeader onSignOut={onSignOut} progress={progress}/>

      <Card>
        <div className="flex flex-col gap-6">
          <header className="flex items-start justify-between gap-4">
            <Badge emphasis>{phrase.scenario}</Badge>
            <AudioButton state={audio} onPress={playAudio}/>
          </header>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-body-sm text-fg-subtle">How do you say…</p>
            <p className="text-heading font-semibold text-fg">{phrase.english}</p>
            {phrase.notes && <p className="text-body-sm italic text-fg-faint mt-1">{phrase.notes}</p>}
          </div>

          {phase === 'input' ? (
            <>
              <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
                {modes.map((m) => (
                  <button key={m.id} type="button" onClick={() => setMode(m.id)}
                    className={[
                      'flex-1 rounded-lg py-2 text-body-sm font-medium transition-colors',
                      mode === m.id ? 'bg-bg text-fg shadow-card' : 'text-fg-subtle active:bg-surface-2'
                    ].join(' ')}>
                    {m.label}
                  </button>
                ))}
              </div>

              {mode === 'romaji' && (
                <div className="flex flex-col gap-2">
                  <div lang="ja" className="min-h-10 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg">
                    {romaji || <span className="text-fg-faint text-body">Kana preview</span>}
                  </div>
                  <input value={romaji} onChange={(e) => setRomaji(e.target.value)}
                    placeholder="Type romaji here…" autoComplete="off" autoCorrect="off" spellCheck={false}
                    className="h-12 w-full rounded-xl border border-border-strong px-4 text-body text-fg placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none"/>
                </div>
              )}

              {mode === 'kana' && (
                <div className="flex flex-col gap-2">
                  <div lang="ja" className="min-h-12 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg">
                    {kana || <span className="text-fg-faint text-body">Tap kana below…</span>}
                  </div>
                  <KanaGrid
                    rows={[HIRAGANA_ROW1, HIRAGANA_ROW2, HIRAGANA_ROW3, HIRAGANA_ROW4]}
                    onSelect={(c) => setKana(kana + c)}
                    onBackspace={() => setKana([...kana].slice(0, -1).join(''))}
                  />
                </div>
              )}

              {mode === 'system' && (
                <div className="flex flex-col gap-2">
                  <input value={kana} onChange={(e) => setKana(e.target.value)}
                    placeholder="Type in Japanese…" lang="ja"
                    className="h-12 w-full rounded-xl border border-border-strong px-4 font-jp text-jp-lg text-fg placeholder:text-fg-faint placeholder:font-sans placeholder:text-body focus:border-fg-subtle focus:outline-none"/>
                  <p className="text-body-sm text-fg-subtle">Switch your device keyboard to Japanese (日本語).</p>
                </div>
              )}

              <Button variant="primary" size="md" fullWidth onClick={check}
                disabled={mode === 'romaji' ? romaji.trim() === '' : kana.trim() === ''}>
                Check answer
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className={[
                'rounded-xl p-4 text-center',
                correct ? 'bg-success-bg' : 'bg-error-bg',
              ].join(' ')}>
                <p className={['text-body-lg font-semibold',
                  correct ? 'text-success-fg' : 'text-error-fg'].join(' ')}>
                  {correct ? 'Correct!' : 'Not quite'}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-surface p-4 text-center">
                <p lang="ja" className="font-jp text-jp-lg text-fg">{phrase.japanese}</p>
                <p lang="ja" className="font-jp text-jp text-fg-subtle">{phrase.reading}</p>
                <p className="text-body-sm italic text-fg-faint">{phrase.romaji}</p>
              </div>
              <Button variant="primary" size="md" fullWidth onClick={next}>Next</Button>
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}

// ─── Empty / All-caught-up state ───────────────────────────────────────────
function EmptyScreen({ onSignOut, onRestart }) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-6">
      <AppHeader onSignOut={onSignOut} progress={1}/>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center pt-12">
        <h2 className="text-heading-lg font-semibold text-fg">All caught up!</h2>
        <p className="text-body text-fg-subtle">No phrases due for review right now.</p>
        <div className="pt-2">
          <Button variant="secondary" size="md" onClick={onRestart}>Start over</Button>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { LandingScreen, SignInScreen, ReviewScreen, EmptyScreen });
