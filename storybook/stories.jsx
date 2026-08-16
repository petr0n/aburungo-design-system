// AburunGo Storybook — stories.
// Each Story = a named, rendered example of a component with optional controls.
// Stories are grouped into Sections; sections render in the sidebar.

// Helper for code-string display
function jsx(strings, ...vals) {
  return strings.reduce((acc, str, i) => acc + str + (vals[i] ?? ''), '');
}

// ───── Button ──────────────────────────────────────────────────────────
const ButtonStories = {
  Primary: {
    render: (a) => <Button variant="primary" size={a.size} disabled={a.disabled}
                           loading={a.loading} fullWidth={a.fullWidth}>{a.label}</Button>,
    args: { label: 'Check answer', size: 'md', disabled: false, loading: false, fullWidth: false },
    argTypes: {
      label: { control: 'text' },
      size: { control: 'select', options: ['md', 'sm'] },
      disabled: { control: 'boolean' },
      loading: { control: 'boolean' },
      fullWidth: { control: 'boolean' },
    },
    code: (a) => `<Button variant="primary" size="${a.size}"${a.disabled ? ' disabled' : ''}${a.loading ? ' loading' : ''}${a.fullWidth ? ' fullWidth' : ''}>${a.label}</Button>`,
  },
  Secondary: {
    render: (a) => <Button variant="secondary" size={a.size} disabled={a.disabled}>{a.label}</Button>,
    args: { label: 'Show answer', size: 'md', disabled: false },
    argTypes: { label: { control: 'text' }, size: { control: 'select', options: ['md','sm'] }, disabled: { control: 'boolean' } },
    code: (a) => `<Button variant="secondary" size="${a.size}">${a.label}</Button>`,
  },
  Ghost: {
    render: (a) => <Button variant="ghost" size="sm">{a.label}</Button>,
    args: { label: 'Sign out' },
    argTypes: { label: { control: 'text' } },
    code: (a) => `<Button variant="ghost" size="sm">${a.label}</Button>`,
  },
  'All variants': {
    render: () => (
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    ),
    code: () => `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="primary" disabled>Disabled</Button>`,
  },
};

// ───── TextInput ───────────────────────────────────────────────────────
const TextInputStories = {
  Default: {
    render: (a) => <div className="w-80"><TextInput label={a.label} placeholder={a.placeholder}/></div>,
    args: { label: 'Email', placeholder: 'you@example.com' },
    argTypes: { label: { control: 'text' }, placeholder: { control: 'text' } },
    code: (a) => `<TextInput label="${a.label}" placeholder="${a.placeholder}"/>`,
  },
  'With hint': {
    render: () => <div className="w-80"><TextInput label="Email" hint="We never share this." placeholder="you@example.com"/></div>,
    code: () => `<TextInput label="Email" hint="We never share this." placeholder="you@example.com"/>`,
  },
  'With error': {
    render: () => <div className="w-80"><TextInput label="Password" type="password" defaultValue="hi" error="Must be at least 8 characters."/></div>,
    code: () => `<TextInput label="Password" type="password" error="Must be at least 8 characters."/>`,
  },
};

// ───── Card ────────────────────────────────────────────────────────────
const CardStories = {
  Default: {
    render: () => (
      <div className="w-80">
        <Card>
          <p className="text-body text-fg">A surface with hairline border + a single drop-shadow. That's the entire elevation system.</p>
        </Card>
      </div>
    ),
    code: () => `<Card>\n  <p>…</p>\n</Card>`,
  },
  Compact: {
    render: () => (
      <div className="w-80">
        <Card compact>
          <p className="text-body-sm text-fg-muted">Compact padding — for inline list rows.</p>
        </Card>
      </div>
    ),
    code: () => `<Card compact>\n  <p>…</p>\n</Card>`,
  },
};

// ───── Badge ───────────────────────────────────────────────────────────
const BadgeStories = {
  Neutral: {
    render: (a) => <Badge variant={a.variant} emphasis={a.emphasis}>{a.label}</Badge>,
    args: { label: 'restaurant', variant: 'neutral', emphasis: true },
    argTypes: {
      label: { control: 'text' },
      variant: { control: 'select', options: ['neutral', 'success', 'error'] },
      emphasis: { control: 'boolean' },
    },
    code: (a) => `<Badge variant="${a.variant}"${a.emphasis ? ' emphasis' : ''}>${a.label}</Badge>`,
  },
  'All variants': {
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Badge emphasis>restaurant</Badge>
        <Badge emphasis>transit</Badge>
        <Badge>Polite form</Badge>
        <Badge variant="success">Got it</Badge>
        <Badge variant="error">Didn't</Badge>
      </div>
    ),
    code: () => `<Badge emphasis>restaurant</Badge>
<Badge>Polite form</Badge>
<Badge variant="success">Got it</Badge>
<Badge variant="error">Didn't</Badge>`,
  },
};

// ───── IconButton ──────────────────────────────────────────────────────
const IconButtonStories = {
  Default: {
    render: () => <IconButton aria-label="Play audio"><SpeakerIcon className="h-5 w-5"/></IconButton>,
    code: () => `<IconButton aria-label="Play audio">\n  <SpeakerIcon className="h-5 w-5"/>\n</IconButton>`,
  },
  Filled: {
    render: () => <IconButton aria-label="Now playing" variant="filled"><SpeakerIcon className="h-5 w-5"/></IconButton>,
    code: () => `<IconButton aria-label="Now playing" variant="filled">\n  <SpeakerIcon className="h-5 w-5"/>\n</IconButton>`,
  },
  Danger: {
    render: () => <IconButton aria-label="Listening" variant="danger"><MicIcon className="h-5 w-5"/></IconButton>,
    code: () => `<IconButton aria-label="Listening" variant="danger">\n  <MicIcon className="h-5 w-5"/>\n</IconButton>`,
  },
  Square: {
    render: () => <IconButton aria-label="Backspace" shape="square"><BackspaceIcon className="h-5 w-5"/></IconButton>,
    code: () => `<IconButton aria-label="Backspace" shape="square">\n  <BackspaceIcon className="h-5 w-5"/>\n</IconButton>`,
  },
};

// ───── AudioButton ─────────────────────────────────────────────────────
const AudioButtonStories = {
  Idle: {
    render: () => <AudioButton state="idle" onPress={() => {}}/>,
    code: () => `<AudioButton state="idle" onPress={play}/>`,
  },
  Loading: {
    render: () => <AudioButton state="loading" onPress={() => {}}/>,
    code: () => `<AudioButton state="loading" onPress={play}/>`,
  },
  Playing: {
    render: () => <AudioButton state="playing" onPress={() => {}}/>,
    code: () => `<AudioButton state="playing" onPress={play}/>`,
  },
  Interactive: {
    render: () => {
      const [s, setS] = React.useState('idle');
      function press() {
        if (s !== 'idle') return;
        setS('loading');
        window.setTimeout(() => setS('playing'), 300);
        window.setTimeout(() => setS('idle'), 1500);
      }
      return <AudioButton state={s} onPress={press}/>;
    },
    code: () => `// Click cycles idle → loading → playing → idle`,
  },
};

// ───── ProgressBar ─────────────────────────────────────────────────────
const ProgressBarStories = {
  Default: {
    render: (a) => <div className="w-80"><ProgressBar value={a.value}/></div>,
    args: { value: 0.4 },
    argTypes: { value: { control: 'range', min: 0, max: 1, step: 0.05 } },
    code: (a) => `<ProgressBar value={${a.value.toFixed(2)}}/>`,
  },
  Stages: {
    render: () => (
      <div className="flex w-80 flex-col gap-4">
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <div key={v} className="flex items-center gap-3">
            <span className="w-8 font-mono text-body-sm text-fg-subtle">{Math.round(v*100)}%</span>
            <div className="flex-1"><ProgressBar value={v}/></div>
          </div>
        ))}
      </div>
    ),
    code: () => `<ProgressBar value={0}/>
<ProgressBar value={0.25}/>
<ProgressBar value={0.5}/>
<ProgressBar value={0.75}/>
<ProgressBar value={1}/>`,
  },
};

// ───── PhraseCard ──────────────────────────────────────────────────────
const PhraseCardStories = {
  Default: {
    render: (a) => (
      <div className="w-full max-w-md">
        <PhraseCard
          scenario={a.scenario}
          japanese={a.japanese}
          reading={a.reading}
          english={a.revealed ? a.english : undefined}
          audioSlot={<AudioButton onPress={() => {}}/>}
        />
      </div>
    ),
    args: {
      scenario: 'restaurant',
      japanese: 'お会計お願いします',
      reading: 'おかいけいおねがいします',
      english: 'The check, please.',
      revealed: true,
    },
    argTypes: {
      scenario: { control: 'select', options: ['restaurant', 'transit', 'shopping', 'directions'] },
      japanese: { control: 'text' }, reading: { control: 'text' }, english: { control: 'text' },
      revealed: { control: 'boolean' },
    },
    code: (a) => `<PhraseCard
  scenario="${a.scenario}"
  japanese="${a.japanese}"
  reading="${a.reading}"
  english="${a.english}"
  audioSlot={<AudioButton onPress={play}/>}
/>`,
  },
  'With notes': {
    render: () => (
      <div className="w-full max-w-md">
        <PhraseCard
          scenario="restaurant" japanese="これをください" reading="これをください"
          english="I'll have this."
          notes="The most useful single phrase in any Japanese restaurant — works even when you can't read the menu."
          audioSlot={<AudioButton onPress={() => {}}/>}
        />
      </div>
    ),
    code: () => `<PhraseCard
  scenario="restaurant"
  japanese="これをください"
  reading="これをください"
  english="I'll have this."
  notes="…"
/>`,
  },
};

// ───── KanaGrid ────────────────────────────────────────────────────────
const KANA_ROWS = [
  [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o']],
  [['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko']],
  [['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so']],
  [['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to']],
].map((row) => row.map(([k, r]) => ({ kana: k, romaji: r })));

const KanaGridStories = {
  Interactive: {
    render: () => {
      const [out, setOut] = React.useState('');
      return (
        <div className="flex w-80 flex-col gap-3">
          <div lang="ja" className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg">
            {out || <span className="text-fg-faint text-body">Tap kana below…</span>}
          </div>
          <KanaGrid rows={KANA_ROWS}
            onSelect={(c) => setOut((k) => k + c)}
            onBackspace={() => setOut((k) => [...k].slice(0, -1).join(''))}/>
        </div>
      );
    },
    code: () => `<KanaGrid
  rows={HIRAGANA_ROWS}
  onSelect={(c) => setKana(kana + c)}
  onBackspace={() => setKana(kana.slice(0, -1))}
/>`,
  },
};

// ───── Tokens ──────────────────────────────────────────────────────────
const TokensStories = {
  Colors: {
    render: () => {
      // Values are read from the live @theme at render time, so a swatch cannot
      // show a stale hex. That is only half of drift, and this page learned the
      // other half the hard way: it used to list `brand-50…700` — v2's purple
      // ramp, surviving as a legacy alias remapped onto Akane — so it rendered
      // six reds labelled "Brand" and showed none of Ai-iro, Rokushō, Ōgon or
      // Sumi-iro. Live values, correct; the list of tokens, two palettes out of
      // date. Anything added to src/tokens.css must be added here too.
      const ramp = (hue) => [50,100,200,300,400,500,600,700,800,900].map((s) => `${hue}-${s}`);
      const groups = [
        {
          title: 'The five — one job each',
          cols: 'sm:grid-cols-3 lg:grid-cols-5',
          items: [
            { token: 'akane-500',   jp: 'Akane 茜色',    job: 'The hanko, and error states. Never a CTA.' },
            { token: 'ai-500',      jp: 'Ai-iro 藍色',   job: 'Primary action, headings, Japanese content.' },
            { token: 'rokusho-500', jp: 'Rokushō 緑青',  job: 'Progress, correctness, secondary action, links.' },
            { token: 'ogon-500',    jp: 'Ōgon 黄金',     job: 'Focus rings, scenario tags, hairlines on dark.' },
            { token: 'stone-800',   jp: 'Sumi-iro 墨色', job: 'Body text and the header band.' },
          ],
        },
        { title: 'Akane 茜色', items: ramp('akane'), dense: true },
        { title: 'Ai-iro 藍色', items: ramp('ai'), dense: true },
        { title: 'Rokushō 緑青', items: ramp('rokusho'), dense: true },
        { title: 'Ōgon 黄金', items: ramp('ogon'), dense: true },
        {
          title: 'Warm stone — the neutrals',
          note: 'Cards (stone-0) are lighter than the page (stone-50) so they lift without a shadow. #FFFDF8 is not a mistake for #FFFFFF.',
          items: ['stone-0','stone-50','stone-100','stone-200','stone-300','stone-400','stone-500','stone-600','stone-700','stone-800','stone-900'],
          dense: true,
        },
        {
          title: 'The roles those steps carry',
          note: 'Reach for these, not the ramp. A role survives a palette change; a ramp step does not. fg-subtle and fg-faint both sit at stone-500 — Ishi-iro stone-400 was too light to read at 2.30:1, so the placeholder role moved down and Ishi-iro stayed put for non-text use.',
          items: ['surface','surface-2','border','border-strong','fg-faint','fg-subtle','fg-muted','fg'],
        },
        {
          title: 'Roles · action',
          note: 'Primary is Ai-iro. Akane is never a CTA.',
          items: ['action','action-press','action-fg','action-2-bg','action-2-fg','action-2-border'],
        },
        {
          title: 'Roles · the mark',
          note: 'Akane. The hanko and error states — its only two jobs.',
          items: ['accent','accent-press','accent-fg'],
        },
        {
          title: 'Roles · focus & scenario tags',
          note: 'Ōgon. Focus is Ōgon 500 on both grounds — settled, kept over the contrast ratio deliberately.',
          items: ['focus','focus-on-inverse','tag-bg','tag-fg'],
        },
        {
          title: 'Roles · links & progress',
          note: 'Rokushō. link is Rokushō darkened — 500 fails AA as text.',
          items: ['link','progress-track','progress-fill'],
        },
        {
          title: 'Roles · dark chrome',
          note: 'One dark slab per screen: the header band is Sumi-iro, so the kana keyboard is Rokushō instead.',
          items: ['inverse','fg-inverse','fg-on-inverse-2','rule-on-inverse'],
        },
        {
          title: 'Roles · kana keyboard',
          items: ['keyboard-bg','keyboard-rule','key-bg','key-fg','key-press'],
        },
        {
          title: 'Roles · card accents',
          note: 'An input, not a fixed colour. PhraseCard and ScoreCard take an accent so colour says which scenario. -bg tints the card body; the bare token is the rule and tag.',
          items: ['accent-ogon','accent-ogon-fg','accent-ogon-bg',
                  'accent-ai','accent-ai-fg','accent-ai-bg',
                  'accent-rokusho','accent-rokusho-fg','accent-rokusho-bg',
                  'accent-akane','accent-akane-fg','accent-akane-bg'],
        },
        {
          title: 'Roles · text',
          note: 'fg-heading is Ai-iro — headings and Japanese content. Ishi-iro stone-400 is not a text colour: it fails AA at 2.30:1 and is for disabled fills and hairlines.',
          items: ['fg-heading','fg','fg-muted','fg-subtle','fg-faint'],
        },
        {
          title: 'Roles · feedback',
          note: 'Correctness banners only, never decorative tints. Correct/incorrect deliberately share tokens with success/error.',
          items: ['success-bg','success-fg','error-bg','error-fg'],
        },
      ];
      const readToken = (name) => {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue(`--color-${name}`).trim();
        return raw || 'unset';
      };
      return (
        <div className="flex flex-col gap-8">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-caption uppercase tracking-wider text-fg-subtle">{g.title}</h3>
                {g.note && <p className="max-w-prose text-caption text-fg-faint">{g.note}</p>}
              </div>
              <div className={`grid gap-3 ${g.cols ?? (g.dense
                ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-11'
                : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6')}`}>
                {g.items.map((item) => {
                  const name = typeof item === 'string' ? item : item.token;
                  return (
                    <div key={name} className="flex flex-col gap-1.5">
                      <div
                        className={`${g.dense ? 'h-10' : 'h-14'} rounded-lg border border-border`}
                        style={{ background: `var(--color-${name})` }}
                      />
                      {typeof item !== 'string' && (
                        <div className="text-body-sm font-semibold text-fg-heading">{item.jp}</div>
                      )}
                      <div className="font-mono text-caption text-fg">{name}</div>
                      <div className="font-mono text-caption text-fg-subtle">{readToken(name)}</div>
                      {typeof item !== 'string' && (
                        <div className="text-caption text-fg-muted">{item.job}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    },
    code: () => `// Tailwind utilities generated from src/tokens.css @theme:
//   bg-action / text-fg-heading / border-border / ring-focus / bg-accent-ai …
// Prefer a role token over a ramp step; prefer a ramp step over a hex.`,
  },
  Typography: {
    render: () => (
      <div className="flex flex-col gap-5">
        <div>
          <div className="text-caption uppercase tracking-wider text-fg-subtle">display</div>
          <p className="text-display-lg font-bold tracking-tight">Ready to use Japanese.</p>
        </div>
        <div>
          <div className="text-caption uppercase tracking-wider text-fg-subtle">heading-lg</div>
          <p className="text-heading-lg font-semibold">Practical Japanese.</p>
        </div>
        <div>
          <div className="text-caption uppercase tracking-wider text-fg-subtle">body-lg</div>
          <p className="text-body-lg">Phrases for the situations you actually run into.</p>
        </div>
        <div>
          <div className="text-caption uppercase tracking-wider text-fg-subtle">jp-display</div>
          <p lang="ja" className="font-jp text-jp-display">お会計お願いします</p>
        </div>
        <div>
          <div className="text-caption uppercase tracking-wider text-fg-subtle">jp-lg</div>
          <p lang="ja" className="font-jp text-jp-lg">えきはどこですか</p>
        </div>
      </div>
    ),
    code: () => `<p className="text-display-lg font-bold tracking-tight">…</p>
<p lang="ja" className="font-jp text-jp-display">…</p>`,
  },
};

// ───── AppHeader ───────────────────────────────────────────────────────
const AppHeaderStories = {
  'Title only': {
    render: (a) => (
      <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden">
        <AppHeader title={a.title}/>
      </div>
    ),
    args: { title: 'Flashcards' },
    argTypes: { title: { control: 'text' } },
    code: (a) => `<AppHeader title="${a.title}"/>`,
  },
  'With left + right': {
    render: () => (
      <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden">
        <AppHeader
          title="Flashcards"
          left={<Button variant="ghost" size="sm">Back</Button>}
          right={<Button variant="ghost" size="sm">Settings</Button>}
        />
      </div>
    ),
    code: () => `<AppHeader
  title="Flashcards"
  left={<Button variant="ghost" size="sm">Back</Button>}
  right={<Button variant="ghost" size="sm">Settings</Button>}
/>`,
  },
  'With icon slots': {
    render: () => (
      <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden">
        <AppHeader
          title="Practice"
          left={<IconButton aria-label="Back"><BackspaceIcon className="h-5 w-5"/></IconButton>}
          right={<AudioButton state="idle" onPress={() => {}}/>}
        />
      </div>
    ),
    code: () => `<AppHeader
  title="Practice"
  left={<IconButton aria-label="Back">…</IconButton>}
  right={<AudioButton state="idle" onPress={play}/>}
/>`,
  },
};

// ───── LoadingPlaceholder ──────────────────────────────────────────────
const LoadingPlaceholderStories = {
  Default: {
    render: (a) => (
      <div className="w-full max-w-md">
        <LoadingPlaceholder label={a.label}/>
      </div>
    ),
    args: { label: 'Loading…' },
    argTypes: { label: { control: 'text' } },
    code: (a) => `<LoadingPlaceholder label="${a.label}"/>`,
  },
  Custom: {
    render: () => <div className="w-full max-w-md"><LoadingPlaceholder label="Checking health…"/></div>,
    code: () => `<LoadingPlaceholder label="Checking health…"/>`,
  },
};

// ───── EmptyState ──────────────────────────────────────────────────────
const EmptyStateStories = {
  'Message only': {
    render: (a) => (
      <div className="w-full max-w-md">
        <EmptyState message={a.message}/>
      </div>
    ),
    args: { message: 'No cards due' },
    argTypes: { message: { control: 'text' } },
    code: (a) => `<EmptyState message="${a.message}"/>`,
  },
  'With description': {
    render: () => (
      <div className="w-full max-w-md">
        <EmptyState
          message="No cards due"
          description="You're all caught up. Come back tomorrow for your next review."
        />
      </div>
    ),
    code: () => `<EmptyState
  message="No cards due"
  description="You're all caught up. Come back tomorrow."
/>`,
  },
  'With action': {
    render: () => (
      <div className="w-full max-w-md">
        <EmptyState
          message="No feedback yet"
          description="User feedback will appear here once learners submit reports."
          action={<Button variant="secondary" size="sm">Refresh</Button>}
        />
      </div>
    ),
    code: () => `<EmptyState
  message="No feedback yet"
  description="…"
  action={<Button variant="secondary" size="sm">Refresh</Button>}
/>`,
  },
};

// ───── ErrorState ──────────────────────────────────────────────────────
const ErrorStateStories = {
  Default: {
    render: (a) => (
      <div className="w-full max-w-md">
        <ErrorState message={a.message}/>
      </div>
    ),
    args: { message: 'Something went wrong' },
    argTypes: { message: { control: 'text' } },
    code: (a) => `<ErrorState message="${a.message}"/>`,
  },
  'With description': {
    render: () => (
      <div className="w-full max-w-md">
        <ErrorState
          message="Couldn't load cards"
          description="Network request failed. Check your connection and try again."
        />
      </div>
    ),
    code: () => `<ErrorState
  message="Couldn't load cards"
  description="Network request failed."
/>`,
  },
  'With retry action': {
    render: () => (
      <div className="w-full max-w-md">
        <ErrorState
          message="Couldn't load cards"
          description="Network request failed. Check your connection and try again."
          action={<Button variant="primary" size="sm">Try again</Button>}
        />
      </div>
    ),
    code: () => `<ErrorState
  message="Couldn't load cards"
  description="…"
  action={<Button variant="primary" size="sm">Try again</Button>}
/>`,
  },
};

// ───── ScoreCard ───────────────────────────────────────────────────────
const ScoreCardStories = {
  Default: {
    render: (a) => (
      <div className="w-full max-w-sm">
        <ScoreCard correct={a.correct} total={a.total}/>
      </div>
    ),
    args: { correct: 18, total: 25 },
    argTypes: {
      correct: { control: 'range', min: 0, max: 30, step: 1 },
      total:   { control: 'range', min: 1, max: 30, step: 1 },
    },
    code: (a) => `<ScoreCard correct={${a.correct}} total={${a.total}}/>`,
  },
  Tones: {
    render: () => (
      <div className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
        {['plain', 'rokusho', 'ai'].map((tone) => (
          <div key={tone} className="flex flex-1 flex-col gap-2">
            <div className="font-mono text-caption text-fg-subtle">tone=&quot;{tone}&quot;</div>
            <ScoreCard correct={18} total={25} tone={tone}/>
          </div>
        ))}
      </div>
    ),
    code: () => `<ScoreCard correct={18} total={25} tone="rokusho"/>
// rokusho is a tint with a 1px rule — it sits above the phrase list and a
// saturated block there wins the screen away from what the learner is reading.
// ai stays solid: exactly one tone is allowed to be emphatic.`,
  },
  'With actions': {
    render: () => (
      <div className="w-full max-w-sm">
        <ScoreCard correct={18} total={25} tone="rokusho">
          <Button variant="primary" fullWidth>Practice missed (7)</Button>
          <Button variant="secondary" fullWidth>Done</Button>
        </ScoreCard>
      </div>
    ),
    code: () => `<ScoreCard correct={18} total={25}>
  <Button variant="primary" fullWidth>Practice missed (7)</Button>
  <Button variant="secondary" fullWidth>Done</Button>
</ScoreCard>`,
  },
  Perfect: {
    render: () => (
      <div className="w-full max-w-sm">
        <ScoreCard correct={25} total={25}>
          <Button variant="primary" fullWidth>Done</Button>
        </ScoreCard>
      </div>
    ),
    code: () => `<ScoreCard correct={25} total={25}>
  <Button variant="primary" fullWidth>Done</Button>
</ScoreCard>`,
  },
};

// ───── AnswerResult ────────────────────────────────────────────────────
const AnswerResultStories = {
  Recalled: {
    render: () => (
      <div className="w-full max-w-sm">
        <AnswerResult outcome="recalled">
          <p lang="ja" className="font-jp text-jp-lg text-fg">お願いします</p>
          <p lang="ja" className="font-jp text-jp text-fg-muted">おねがいします</p>
        </AnswerResult>
      </div>
    ),
    code: () => `<AnswerResult outcome="recalled">
  <p lang="ja" className="font-jp text-jp-lg text-fg">お願いします</p>
  <p lang="ja" className="font-jp text-jp text-fg-muted">おねがいします</p>
</AnswerResult>`,
  },
  'Not quite': {
    render: () => (
      <div className="w-full max-w-sm">
        <AnswerResult outcome="review" userAnswer="おねがいしします">
          <p lang="ja" className="font-jp text-jp-lg text-fg">お願いします</p>
          <p lang="ja" className="font-jp text-jp text-fg-muted">おねがいします</p>
        </AnswerResult>
      </div>
    ),
    code: () => `<AnswerResult outcome="review" userAnswer="おねがいしします">
  <p lang="ja" className="font-jp text-jp-lg text-fg">お願いします</p>
  <p lang="ja" className="font-jp text-jp text-fg-muted">おねがいします</p>
</AnswerResult>`,
  },
  'GradePair — the learner grades': {
    render: () => (
      <div className="max-w-sm">
        <GradePair onGrade={() => {}}/>
      </div>
    ),
    code: () => `<GradePair onGrade={(outcome) => ...}/>`,
  },
  'Maru on its own': {
    render: () => (
      <div className="flex items-center gap-6 text-heading">
        <Maru outcome="recalled"/>
        <Maru outcome="review"/>
      </div>
    ),
    code: () => `<Maru outcome="recalled"/>
<Maru outcome="review"/>`,
  },
};

// ───── FlipCard ────────────────────────────────────────────────────────
function _FlipFace({ jp, reading, en, isBack }) {
  return (
    <div className={[
      'flex rounded-2xl border border-border bg-bg shadow-card',
      isBack ? 'flex-col gap-4 p-6' : 'min-h-48 items-center justify-center p-6',
    ].join(' ')}>
      {isBack ? (
        <>
          <div className="flex flex-col items-center gap-1 text-center">
            <p lang="ja" className="font-jp text-jp-display text-fg">{jp}</p>
            <p lang="ja" className="font-jp text-jp text-fg-muted">{reading}</p>
          </div>
          <hr className="border-border"/>
          <p className="text-center text-body-lg text-fg">{en}</p>
        </>
      ) : (
        <p lang="ja" className="font-jp text-jp-display text-fg">{jp}</p>
      )}
    </div>
  );
}

const FlipCardStories = {
  'Front face': {
    render: () => (
      <div className="w-full max-w-sm">
        <FlipCard
          flipped={false}
          front={<_FlipFace jp="電車" reading="でんしゃ" en="train"/>}
          back={<_FlipFace jp="電車" reading="でんしゃ" en="train" isBack/>}
        />
      </div>
    ),
    code: () => `<FlipCard flipped={false} front={<FrontFace/>} back={<BackFace/>}/>`,
  },
  'Back face': {
    render: () => (
      <div className="w-full max-w-sm">
        <FlipCard
          flipped={true}
          front={<_FlipFace jp="電車" reading="でんしゃ" en="train"/>}
          back={<_FlipFace jp="電車" reading="でんしゃ" en="train" isBack/>}
        />
      </div>
    ),
    code: () => `<FlipCard flipped={true} front={<FrontFace/>} back={<BackFace/>}/>`,
  },
  Interactive: {
    render: () => {
      const [flipped, setFlipped] = React.useState(false);
      return (
        <div className="flex w-full max-w-sm flex-col gap-4">
          <FlipCard
            flipped={flipped}
            front={<_FlipFace jp="電車" reading="でんしゃ" en="train"/>}
            back={<_FlipFace jp="電車" reading="でんしゃ" en="train" isBack/>}
          />
          <Button variant={flipped ? 'secondary' : 'primary'} fullWidth
                  onClick={() => setFlipped((f) => !f)}>
            {flipped ? 'Flip back' : 'Reveal'}
          </Button>
        </div>
      );
    },
    code: () => `const [flipped, setFlipped] = useState(false)
<FlipCard flipped={flipped} front={…} back={…}/>
<Button onClick={() => setFlipped(f => !f)}>Reveal</Button>`,
  },
  'Entering phase': {
    render: () => {
      const [key, setKey] = React.useState(0);
      return (
        <div className="flex w-full max-w-sm flex-col gap-4">
          <FlipCard
            key={key}
            flipped={false}
            phase="entering"
            front={<_FlipFace jp="駅" reading="えき" en="station"/>}
            back={<_FlipFace jp="駅" reading="えき" en="station" isBack/>}
          />
          <Button variant="secondary" fullWidth onClick={() => setKey((k) => k + 1)}>
            Replay enter
          </Button>
        </div>
      );
    },
    code: () => `<FlipCard phase="entering" flipped={false} front={…} back={…}/>`,
  },
};

// ───── KanaKeyboard ────────────────────────────────────────────────────
const KanaKeyboardStories = {
  Interactive: {
    render: () => {
      const [script, setScript]   = React.useState('hiragana');
      const [section, setSection] = React.useState('basic');
      const [out, setOut]         = React.useState('');
      return (
        <div className="flex w-full max-w-md flex-col gap-3">
          <div lang="ja" className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg">
            {out || <span className="text-fg-faint text-body">Tap keys…</span>}
          </div>
          <KanaKeyboard
            script={script} section={section}
            onScriptChange={setScript} onSectionChange={setSection}
            onKey={(k) => setOut((s) => s + k)}
            onBackspace={() => setOut((s) => [...s].slice(0, -1).join(''))}
          />
        </div>
      );
    },
    code: () => `const [script, setScript]   = useState('hiragana')
const [section, setSection] = useState('basic')
<KanaKeyboard
  script={script} section={section}
  onScriptChange={setScript} onSectionChange={setSection}
  onKey={(k) => setKana(kana + k)}
  onBackspace={() => setKana(kana.slice(0, -1))}
/>`,
  },
  'Katakana / Voiced': {
    render: () => {
      const [out, setOut] = React.useState('');
      return (
        <div className="flex w-full max-w-md flex-col gap-3">
          <div lang="ja" className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 font-jp text-jp-lg text-fg">
            {out || <span className="text-fg-faint text-body">Tap keys…</span>}
          </div>
          <KanaKeyboard
            script="katakana" section="voiced"
            onScriptChange={() => {}} onSectionChange={() => {}}
            onKey={(k) => setOut((s) => s + k)}
            onBackspace={() => setOut((s) => [...s].slice(0, -1).join(''))}
          />
        </div>
      );
    },
    code: () => `<KanaKeyboard script="katakana" section="voiced" …/>`,
  },
};

// ───── VoiceInput ──────────────────────────────────────────────────────
const VoiceInputStories = {
  Idle: {
    render: () => <VoiceInput status="idle" onPress={() => {}}/>,
    code: () => `<VoiceInput status="idle" onPress={start}/>`,
  },
  Listening: {
    render: () => <VoiceInput status="listening" onPress={() => {}}/>,
    code: () => `<VoiceInput status="listening" onPress={stop}/>`,
  },
  Processing: {
    render: () => <VoiceInput status="processing" onPress={() => {}}/>,
    code: () => `<VoiceInput status="processing" onPress={() => {}}/>`,
  },
  Error: {
    render: () => <VoiceInput status="error" onPress={() => {}} errorMessage="Could not hear you. Try again."/>,
    code: () => `<VoiceInput status="error" onPress={start} errorMessage="Could not hear you. Try again."/>`,
  },
  Interactive: {
    render: () => {
      const [status, setStatus] = React.useState('idle');
      function press() {
        if (status === 'idle') {
          setStatus('listening');
        } else if (status === 'listening') {
          setStatus('processing');
          window.setTimeout(() => setStatus('idle'), 1000);
        }
      }
      return <VoiceInput status={status} onPress={press}/>;
    },
    code: () => `// Idle → listening (tap) → processing (tap) → idle after 1 s`,
  },
};

// ───── FillInput ───────────────────────────────────────────────────────
// Helper: stateful wrapper so stories can drive the stateless ADS FillInput
function _FillInputDemo({ initialMode = 'romaji', onSubmit: onSubmitProp }) {
  const [mode,        setMode]        = React.useState(initialMode);
  const [romaji,      setRomaji]      = React.useState('');
  const [kana,        setKana]        = React.useState('');
  const [showHint,    setShowHint]    = React.useState(false);
  const [kanaScript,  setKanaScript]  = React.useState('hiragana');
  const [kanaSection, setKanaSection] = React.useState('basic');
  const [lastAnswer,  setLastAnswer]  = React.useState(null);

  // Clear on mode change
  React.useEffect(() => { setRomaji(''); setKana(''); }, [mode]);

  const { converted, pending } = convertRomaji(romaji);
  const canSubmit = mode === 'romaji' ? romaji.trim() !== '' : kana.trim() !== '';

  function handleSubmit() {
    const value = mode === 'romaji' ? finalizeRomaji(romaji) : kana;
    if (!value.trim()) return;
    setLastAnswer(value.trim());
    setRomaji(''); setKana('');
    if (onSubmitProp) onSubmitProp(value.trim());
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FillInput
        mode={mode} romajiValue={romaji} kanaValue={kana}
        converted={converted} pending={pending}
        kanaScript={kanaScript} kanaSection={kanaSection}
        canSubmit={canSubmit}
        onModeChange={setMode}
        onRomajiChange={setRomaji}
        onKanaKey={(c) => setKana((p) => p + c)}
        onKanaBackspace={() => setKana((p) => [...p].slice(0, -1).join(''))}
        onKanaScriptChange={setKanaScript}
        onKanaSectionChange={setKanaSection}
        onSystemChange={setKana}
        onSubmit={handleSubmit}
        onToggleSystemHint={() => setShowHint((h) => !h)}
        showSystemHint={showHint}
        placeholder="Answer in hiragana…"
      />
      {lastAnswer && (
        <p className="text-center text-body text-fg-muted">
          Submitted: <span className="font-jp text-fg">{lastAnswer}</span>
        </p>
      )}
    </div>
  );
}

const FillInputStories = {
  'Romaji mode': {
    render: () => <_FillInputDemo initialMode="romaji"/>,
    code: () => `<FillInput
  mode="romaji" romajiValue={romaji} kanaValue={kana}
  converted={converted} pending={pending}
  kanaScript={kanaScript} kanaSection={kanaSection}
  canSubmit={canSubmit}
  onModeChange={setMode} onRomajiChange={setRomaji}
  onKanaKey={…} onKanaBackspace={…}
  onKanaScriptChange={setKanaScript} onKanaSectionChange={setKanaSection}
  onSystemChange={setKana} onSubmit={handleSubmit}
  onToggleSystemHint={…}
/>`,
  },
  'Kana grid mode': {
    render: () => <_FillInputDemo initialMode="kana"/>,
    code: () => `<FillInput mode="kana" …/>`,
  },
  'System IME mode': {
    render: () => <_FillInputDemo initialMode="system"/>,
    code: () => `<FillInput mode="system" …/>`,
  },
};

// ───── Public catalog ──────────────────────────────────────────────────
window.STORIES = [
  {
    title: 'Foundations',
    components: [
      { name: 'Colors', stories: { Palette: TokensStories.Colors } },
      { name: 'Typography', stories: { Scale: TokensStories.Typography } },
    ],
  },
  {
    title: 'Primitives',
    components: [
      { name: 'Button', stories: ButtonStories },
      { name: 'TextInput', stories: TextInputStories },
      { name: 'Card', stories: CardStories },
      { name: 'Badge', stories: BadgeStories },
      { name: 'IconButton', stories: IconButtonStories },
    ],
  },
  {
    title: 'Domain',
    components: [
      { name: 'AudioButton', stories: AudioButtonStories },
      { name: 'ProgressBar', stories: ProgressBarStories },
      { name: 'PhraseCard', stories: PhraseCardStories },
      { name: 'KanaGrid', stories: KanaGridStories },
    ],
  },
  {
    title: 'Layout',
    components: [
      { name: 'AppHeader',          stories: AppHeaderStories },
      { name: 'LoadingPlaceholder', stories: LoadingPlaceholderStories },
      { name: 'EmptyState',         stories: EmptyStateStories },
      { name: 'ErrorState',         stories: ErrorStateStories },
      { name: 'ScoreCard',          stories: ScoreCardStories },
      { name: 'AnswerResult',       stories: AnswerResultStories },
      { name: 'FlipCard',           stories: FlipCardStories },
    ],
  },
  {
    title: 'Input',
    components: [
      { name: 'KanaKeyboard', stories: KanaKeyboardStories },
      { name: 'VoiceInput',   stories: VoiceInputStories },
      { name: 'FillInput',    stories: FillInputStories },
    ],
  },
];
