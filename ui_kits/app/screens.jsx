// AburunGo — responsive app screens.
// Same components from mobile/components.jsx, responsive layouts.
// Breakpoint md = 896px (set via @theme --breakpoint-md: 56rem in app.html).

// ──────────────────────────────────────────────────────────────────────
//  Content — real phrases from src/content/phrases/*.yaml
// ──────────────────────────────────────────────────────────────────────
const ALL_PHRASES = [
  { id: 'transit.station-where', scenario: 'transit',
    japanese: '駅はどこですか', reading: 'えきはどこですか',
    romaji: 'eki wa doko desu ka', english: 'Where is the station?',
    notes: 'Universal — works at info desks, on the street, at hotel front desks.' },
  { id: 'transit.ticket-where', scenario: 'transit',
    japanese: '切符はどこで買えますか', reading: 'きっぷはどこでかえますか',
    romaji: 'kippu wa doko de kaemasu ka', english: 'Where can I buy a ticket?' },
  { id: 'transit.next-train', scenario: 'transit',
    japanese: '次の電車は何時ですか', reading: 'つぎのでんしゃはなんじですか',
    romaji: 'tsugi no densha wa nanji desu ka', english: 'What time is the next train?' },
  { id: 'transit.getting-off-here', scenario: 'transit',
    japanese: 'ここで降ります', reading: 'ここでおります',
    romaji: 'koko de orimasu', english: "I'm getting off here.",
    notes: 'Useful in taxis. On trains, just move toward the door.' },
  { id: 'restaurant.menu-please', scenario: 'restaurant',
    japanese: 'メニューをお願いします', reading: 'メニューをおねがいします',
    romaji: 'menyuu o onegai shimasu', english: 'Menu, please.' },
  { id: 'restaurant.this-please', scenario: 'restaurant',
    japanese: 'これをください', reading: 'これをください',
    romaji: 'kore o kudasai', english: "I'll have this.",
    notes: "The most useful single phrase — works even when you can't read the menu." },
  { id: 'restaurant.check-please', scenario: 'restaurant',
    japanese: 'お会計お願いします', reading: 'おかいけいおねがいします',
    romaji: 'okaikei onegai shimasu', english: 'The check, please.' },
  { id: 'restaurant.thanks-for-meal', scenario: 'restaurant',
    japanese: 'ごちそうさまでした', reading: 'ごちそうさまでした',
    romaji: 'gochisousama deshita', english: 'Thanks for the meal.' },
];

const SCENARIOS = [
  { id: 'all', label: 'All scenarios' },
  { id: 'transit', label: 'Transit' },
  { id: 'restaurant', label: 'Restaurant' },
];

// ──────────────────────────────────────────────────────────────────────
//  Minimal romaji → hiragana converter (real, enough rows to be useful)
// ──────────────────────────────────────────────────────────────────────
const ROMAJI_MAP = {
  // vowels
  a:'あ', i:'い', u:'う', e:'え', o:'お',
  // k
  ka:'か', ki:'き', ku:'く', ke:'け', ko:'こ',
  kya:'きゃ', kyu:'きゅ', kyo:'きょ',
  // g
  ga:'が', gi:'ぎ', gu:'ぐ', ge:'げ', go:'ご',
  // s
  sa:'さ', shi:'し', si:'し', su:'す', se:'せ', so:'そ',
  sha:'しゃ', shu:'しゅ', sho:'しょ',
  // z
  za:'ざ', ji:'じ', zi:'じ', zu:'ず', ze:'ぜ', zo:'ぞ',
  // t
  ta:'た', chi:'ち', ti:'ち', tsu:'つ', tu:'つ', te:'て', to:'と',
  cha:'ちゃ', chu:'ちゅ', cho:'ちょ',
  // d
  da:'だ', de:'で', do:'ど', du:'づ',
  // n (single)
  na:'な', ni:'に', nu:'ぬ', ne:'ね', no:'の',
  nya:'にゃ', nyu:'にゅ', nyo:'にょ',
  // h
  ha:'は', hi:'ひ', fu:'ふ', hu:'ふ', he:'へ', ho:'ほ',
  hya:'ひゃ', hyu:'ひゅ', hyo:'ひょ',
  // b / p
  ba:'ば', bi:'び', bu:'ぶ', be:'べ', bo:'ぼ',
  pa:'ぱ', pi:'ぴ', pu:'ぷ', pe:'ぺ', po:'ぽ',
  // m
  ma:'ま', mi:'み', mu:'む', me:'め', mo:'も',
  // y
  ya:'や', yu:'ゆ', yo:'よ',
  // r
  ra:'ら', ri:'り', ru:'る', re:'れ', ro:'ろ',
  // w
  wa:'わ', wo:'を',
  // n final
  n:'ん', nn:'ん',
};

function romajiToKana(input) {
  let i = 0;
  let out = '';
  let pending = '';
  const lower = input.toLowerCase();
  while (i < lower.length) {
    // Sokuon: double consonant produces little tsu
    if (i + 1 < lower.length && lower[i] === lower[i+1] && /[bcdfghjklmpqrstvwxyz]/.test(lower[i])) {
      out += 'っ'; i++; continue;
    }
    let matched = false;
    for (const len of [3, 2, 1]) {
      const slice = lower.slice(i, i + len);
      if (ROMAJI_MAP[slice]) { out += ROMAJI_MAP[slice]; i += len; matched = true; break; }
    }
    if (!matched) {
      // unmatched — push to pending so the user sees what's still buffering
      pending += lower[i]; i++;
    } else {
      pending = '';
    }
  }
  return { converted: out, pending };
}

function compareAnswer(userAnswer, expected) {
  const norm = (s) => s.replace(/\s+/g, '').replace(/[。、！？\?]/g, '');
  return norm(userAnswer) === norm(expected);
}

// ──────────────────────────────────────────────────────────────────────
//  Kana keyboard data (basic hiragana rows)
// ──────────────────────────────────────────────────────────────────────
const HIRAGANA_ROWS = [
  [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o']],
  [['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko']],
  [['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so']],
  [['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to']],
  [['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no']],
  [['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho']],
  [['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo']],
  [['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro']],
  [['や','ya'],[null],['ゆ','yu'],[null],['よ','yo']],
  [['わ','wa'],[null],['を','wo'],[null],['ん','n']],
].map((row) => row.map((c) => c[0] === null ? null : { kana: c[0], romaji: c[1] }));

// ──────────────────────────────────────────────────────────────────────
//  useKeyboardShortcuts
// ──────────────────────────────────────────────────────────────────────
function useKeyboardShortcuts(map) {
  React.useEffect(() => {
    function onKey(e) {
      // Don't intercept while the user is mid-typing a romaji answer
      const tag = e.target?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA';
      const handler = map[e.key];
      if (!handler) return;
      // Allow Enter / Escape inside inputs; everything else needs focus outside
      if (inField && !['Enter', 'Escape'].includes(e.key)) return;
      e.preventDefault();
      handler(e);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [map]);
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-bg px-1.5 font-mono text-[11px] font-medium text-fg-muted shadow-key">
      {children}
    </kbd>
  );
}

// ──────────────────────────────────────────────────────────────────────
//  Landing — responsive: stacks on mobile, two-column on md+
// ──────────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5">
        <div className="flex items-center gap-2.5">
          <img src="../../assets/logo.svg" alt="" width="22" height="21"/>
          <span className="text-body-lg font-semibold text-fg">AburunGo</span>
        </div>
        <nav className="flex items-center gap-3 md:gap-7 text-body-sm text-fg-muted">
          <a href="#how" className="hidden md:inline hover:text-fg">How it works</a>
          <a href="#scenarios" className="hidden md:inline hover:text-fg">Scenarios</a>
          <Button variant="primary" size="sm" onClick={onStart}>Sign in</Button>
        </nav>
      </header>

      <section className="px-5 pb-12 pt-6 md:px-16 md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
          <div className="flex flex-col items-start gap-5 md:gap-6">
            <Badge emphasis>Practical Japanese</Badge>
            <h1 className="text-display font-bold tracking-tight text-fg md:text-display-lg">
              Ready to use Japanese in real life.
            </h1>
            <p className="max-w-md text-body-lg text-fg-subtle">
              Phrases for the situations you actually run into — transit, restaurants,
              day-to-day. Short focused reviews. Nothing in the way.
            </p>
            <div className="flex flex-col gap-2 self-stretch md:flex-row md:gap-3 md:self-auto">
              <Button variant="accent" size="md" onClick={onStart}>Start learning</Button>
              <Button variant="secondary" size="md" onClick={onStart}>Browse scenarios</Button>
            </div>
            <p className="flex items-center gap-2 pt-2 text-body-sm text-fg-subtle">
              <span className="inline-flex h-2 w-2 rounded-full bg-success-500"/>
              No streaks, XP, mascots. Ever.
            </p>
          </div>
          <div className="order-first flex items-center justify-center md:order-last">
            <img src="../../assets/hero.png" alt="" width="320" height="320"
                 className="select-none pointer-events-none w-56 md:w-80"/>
          </div>
        </div>
      </section>

      <section id="scenarios" className="border-t border-border bg-surface px-5 py-12 md:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-caption uppercase tracking-wider text-fg-subtle">Real situations</span>
              <h2 className="text-heading-lg font-semibold text-fg">Built around moments, not vocab lists.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {['Transit', 'Restaurant', 'Shopping', 'Directions', 'Pharmacy', 'Small talk', 'Hotel', 'Greetings']
              .map((label) => (
                <div key={label} className="flex flex-col gap-1 rounded-xl border border-border bg-bg p-4 shadow-card">
                  <div className="text-body-sm font-semibold text-fg">{label}</div>
                  <div className="text-body-sm text-fg-subtle">8 phrases</div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 text-body-sm text-fg-subtle md:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2"><img src="../../assets/logo.svg" alt="" width="16" height="15"/> AburunGo · for English speakers</div>
          <div className="flex gap-5"><a href="#" className="hover:text-fg">Privacy</a><a href="#" className="hover:text-fg">Source</a></div>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
//  Sidebar — visible only md+
// ──────────────────────────────────────────────────────────────────────
function Sidebar({ activeScenario, onScenarioChange, completed, total, onExit }) {
  const counts = React.useMemo(() => {
    const c = {};
    for (const s of SCENARIOS) {
      c[s.id] = s.id === 'all' ? ALL_PHRASES.length : ALL_PHRASES.filter((p) => p.scenario === s.id).length;
    }
    return c;
  }, []);

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-border bg-surface px-4 py-6 md:flex">
      <button onClick={onExit} className="flex items-center gap-2.5 px-2">
        <img src="../../assets/logo.svg" alt="" width="22" height="21"/>
        <span className="text-body-lg font-semibold text-fg">AburunGo</span>
      </button>

      <nav className="flex flex-col gap-1">
        <div className="px-2 pb-1 text-caption uppercase tracking-wider text-fg-subtle">Scenarios</div>
        {SCENARIOS.map((s) => (
          <button key={s.id} onClick={() => onScenarioChange(s.id)}
            className={[
              'flex items-center justify-between rounded-lg px-3 py-2 text-left text-body-sm transition-colors',
              activeScenario === s.id
                ? 'bg-bg text-fg shadow-card'
                : 'text-fg-muted hover:bg-bg active:bg-bg',
            ].join(' ')}>
            <span className="font-medium">{s.label}</span>
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-caption text-fg-faint">{counts[s.id]}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-2">
        <div className="flex items-center justify-between text-body-sm text-fg-subtle">
          <span>This session</span>
          <span className="font-mono">{completed} / {total}</span>
        </div>
        <ProgressBar value={total === 0 ? 0 : completed / total}/>
        <button className="mt-2 flex items-center justify-between rounded-lg px-3 py-2 text-left text-body-sm text-fg-muted hover:bg-bg">
          <span className="font-medium">Settings</span>
          <span className="text-fg-faint">⋯</span>
        </button>
        <Button variant="ghost" size="sm" fullWidth onClick={onExit}>Sign out</Button>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────────────
//  Mobile top header — visible only below md
// ──────────────────────────────────────────────────────────────────────
function MobileHeader({ completed, total, onExit, activeScenario, onScenarioChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2 border-b border-border bg-bg/90 px-4 pb-3 pt-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="flex items-center gap-2">
          <img src="../../assets/logo.svg" alt="" width="20" height="19"/>
          <span className="text-body-lg font-semibold text-fg">AburunGo</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)}
            className="inline-flex h-9 items-center rounded-full border border-border bg-bg px-3 text-body-sm text-fg-muted">
            {SCENARIOS.find((s) => s.id === activeScenario)?.label} ▾
          </button>
        </div>
      </div>
      <ProgressBar value={total === 0 ? 0 : completed / total}/>
      {open && (
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-bg p-2">
          {SCENARIOS.map((s) => (
            <button key={s.id}
              onClick={() => { onScenarioChange(s.id); setOpen(false); }}
              className={[
                'rounded-lg px-3 py-2 text-left text-body-sm',
                activeScenario === s.id ? 'bg-surface text-fg font-medium' : 'text-fg-muted active:bg-surface',
              ].join(' ')}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────────
//  Review — responsive fill-in-the-blank
// ──────────────────────────────────────────────────────────────────────
function ReviewApp({ onExit }) {
  const [activeScenario, setActiveScenario] = React.useState('all');
  const [queue, setQueue] = React.useState(() => ALL_PHRASES.map((p) => p.id));
  const [index, setIndex] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [results, setResults] = React.useState([]); // { id, correct }
  const [phase, setPhase] = React.useState('input'); // input | result
  const [mode, setMode] = React.useState('romaji'); // romaji | kana | system
  const [romaji, setRomaji] = React.useState('');
  const [kanaInput, setKanaInput] = React.useState('');
  const [correct, setCorrect] = React.useState(false);
  const [audio, setAudio] = React.useState('idle');
  const inputRef = React.useRef(null);

  // Filter queue when scenario changes
  React.useEffect(() => {
    const list = activeScenario === 'all'
      ? ALL_PHRASES
      : ALL_PHRASES.filter((p) => p.scenario === activeScenario);
    setQueue(list.map((p) => p.id));
    setIndex(0);
    setCompleted(0);
    setResults([]);
    setPhase('input');
    setRomaji('');
    setKanaInput('');
  }, [activeScenario]);

  React.useEffect(() => {
    if (phase === 'input' && mode === 'romaji') {
      inputRef.current?.focus();
    }
  }, [phase, mode, index]);

  const phraseId = queue[index];
  const phrase = ALL_PHRASES.find((p) => p.id === phraseId);

  const total = queue.length;
  const allDone = phrase === undefined;

  function submitAnswer() {
    if (allDone || phase === 'result') return;
    const userAnswer = mode === 'romaji' ? romajiToKana(romaji).converted : kanaInput;
    if (userAnswer.trim() === '') return;
    const isCorrect = compareAnswer(userAnswer, phrase.reading);
    setCorrect(isCorrect);
    setPhase('result');
    setResults((r) => [...r, { id: phrase.id, correct: isCorrect }]);
  }

  function next() {
    setPhase('input');
    setRomaji('');
    setKanaInput('');
    setAudio('idle');
    setCompleted((c) => c + 1);
    setIndex((i) => i + 1);
  }

  function playAudio() {
    if (audio !== 'idle') return;
    setAudio('loading');
    window.setTimeout(() => setAudio('playing'), 250);
    window.setTimeout(() => setAudio('idle'), 1400);
  }

  function reset() {
    setIndex(0); setCompleted(0); setResults([]); setPhase('input');
    setRomaji(''); setKanaInput('');
  }

  // Keyboard shortcuts
  const shortcuts = React.useMemo(() => ({
    Enter: () => phase === 'input' ? submitAnswer() : next(),
    ' ':   () => { if (phase === 'result') next(); },
    p:     () => playAudio(),
    Escape:() => onExit(),
  }), [phase, romaji, kanaInput, mode, phrase, audio]);
  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        activeScenario={activeScenario}
        onScenarioChange={setActiveScenario}
        completed={completed}
        total={total}
        onExit={onExit}
      />
      <main className="flex min-h-screen flex-1 flex-col">
        <MobileHeader
          completed={completed} total={total}
          onExit={onExit}
          activeScenario={activeScenario}
          onScenarioChange={setActiveScenario}
        />

        {allDone ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <h2 className="text-heading-lg font-semibold text-fg md:text-display">All caught up!</h2>
            <p className="text-body text-fg-subtle md:text-body-lg">
              {results.length === 0
                ? "Pick a scenario from the sidebar to start a session."
                : `You got ${results.filter((r) => r.correct).length} of ${results.length} right this session.`}
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="md" onClick={reset}>Start over</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 md:px-12 md:py-10">
            <div className="w-full max-w-2xl">

              {/* Desktop session counter */}
              <div className="hidden items-center justify-between pb-6 text-body-sm text-fg-subtle md:flex">
                <span className="font-mono">{index + 1} / {total}</span>
                <span>Press <Kbd>Esc</Kbd> to exit</span>
              </div>

              <Card>
                <div className="flex flex-col gap-6">
                  <header className="flex items-start justify-between gap-4">
                    <Badge emphasis>{phrase.scenario}</Badge>
                    <AudioButton state={audio} onPress={playAudio} label="Play audio (P)"/>
                  </header>

                  {/* Prompt — bigger on desktop */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-body-sm text-fg-subtle md:text-body">How do you say…</p>
                    <p className="text-heading font-semibold text-fg md:text-heading-lg">{phrase.english}</p>
                    {phrase.notes && (
                      <p className="max-w-md text-body-sm italic text-fg-faint">{phrase.notes}</p>
                    )}
                  </div>

                  {phase === 'input' ? (
                    <>
                      {/* Mode picker */}
                      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
                        {[
                          { id: 'romaji', label: 'Romaji' },
                          { id: 'kana',   label: 'Kana grid' },
                          { id: 'system', label: 'JP keyboard' },
                        ].map((m) => (
                          <button key={m.id} type="button" onClick={() => setMode(m.id)}
                            className={[
                              'flex-1 rounded-lg py-2 text-body-sm font-medium transition-colors',
                              mode === m.id ? 'bg-bg text-fg shadow-card' : 'text-fg-subtle active:bg-surface-2'
                            ].join(' ')}>
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {mode === 'romaji' && (() => {
                        const { converted, pending } = romajiToKana(romaji);
                        return (
                          <div className="flex flex-col gap-2">
                            <div lang="ja"
                              className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg">
                              {converted || pending ? (
                                <><span>{converted}</span><span className="text-fg-faint">{pending}</span></>
                              ) : (
                                <span className="text-fg-faint text-body">Kana preview</span>
                              )}
                            </div>
                            <input ref={inputRef} value={romaji} onChange={(e) => setRomaji(e.target.value)}
                              placeholder="Type romaji here…" autoComplete="off" autoCorrect="off" spellCheck={false}
                              className="h-12 w-full rounded-xl border border-border-strong px-4 text-body text-fg placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none"/>
                          </div>
                        );
                      })()}

                      {mode === 'kana' && (
                        <div className="flex flex-col gap-2">
                          <div lang="ja"
                            className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg">
                            {kanaInput || <span className="text-fg-faint text-body">Tap kana below…</span>}
                          </div>
                          <KanaGrid
                            rows={HIRAGANA_ROWS}
                            onSelect={(c) => setKanaInput((k) => k + c)}
                            onBackspace={() => setKanaInput((k) => [...k].slice(0, -1).join(''))}
                          />
                        </div>
                      )}

                      {mode === 'system' && (
                        <div className="flex flex-col gap-2">
                          <input ref={inputRef} value={kanaInput} onChange={(e) => setKanaInput(e.target.value)}
                            placeholder="Type in Japanese…" lang="ja"
                            className="h-12 w-full rounded-xl border border-border-strong px-4 font-jp text-jp-lg text-fg placeholder:text-fg-faint placeholder:font-sans placeholder:text-body focus:border-fg-subtle focus:outline-none"/>
                          <p className="text-body-sm text-fg-subtle">Switch your device keyboard to Japanese (日本語).</p>
                        </div>
                      )}

                      <Button variant="primary" size="md" fullWidth onClick={submitAnswer}
                        disabled={mode === 'romaji' ? romaji.trim() === '' : kanaInput.trim() === ''}>
                        Check answer
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className={[
                        'rounded-xl p-4 text-center',
                        correct ? 'bg-success-bg' : 'bg-error-bg',
                      ].join(' ')}>
                        <p className={[
                          'text-body-lg font-semibold',
                          correct ? 'text-success-fg' : 'text-error-fg',
                        ].join(' ')}>
                          {correct ? 'Correct!' : 'Not quite'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-xl bg-surface p-5 text-center">
                        <p lang="ja" className="font-jp text-jp-display text-fg md:text-jp-display-lg">{phrase.japanese}</p>
                        <p lang="ja" className="font-jp text-jp text-fg-subtle">{phrase.reading}</p>
                        <p className="text-body-sm italic text-fg-faint">{phrase.romaji}</p>
                      </div>
                      <Button variant="primary" size="md" fullWidth onClick={next}>Next</Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Desktop keyboard hints */}
              <div className="hidden items-center justify-center gap-5 pt-6 text-body-sm text-fg-subtle md:flex">
                <span className="flex items-center gap-2"><Kbd>Enter</Kbd> {phase === 'input' ? 'Check' : 'Next'}</span>
                <span className="flex items-center gap-2"><Kbd>P</Kbd> Play audio</span>
                <span className="flex items-center gap-2"><Kbd>Esc</Kbd> Exit</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

Object.assign(window, { Landing, ReviewApp });
