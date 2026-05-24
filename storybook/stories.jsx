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
  Accent: {
    render: (a) => <Button variant="accent" size="md">{a.label}</Button>,
    args: { label: 'Create account' },
    argTypes: { label: { control: 'text' } },
    code: (a) => `<Button variant="accent" size="md">${a.label}</Button>`,
  },
  'All variants': {
    render: () => (
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    ),
    code: () => `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="accent">Accent</Button>
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
      const groups = [
        { title: 'Brand', items: [
          ['brand-50', '#f5efff'], ['brand-100', '#ede6ff'], ['brand-300', '#c4a5ff'],
          ['brand-500', '#aa3bff'], ['brand-600', '#863bff'], ['brand-700', '#7e14ff'],
        ]},
        { title: 'Neutrals', items: [
          ['surface', '#fafafa'], ['surface-2', '#f4f4f5'], ['border', '#e4e4e7'],
          ['border-strong', '#d4d4d8'], ['fg-faint', '#a1a1aa'], ['fg-subtle', '#71717a'],
          ['fg-muted', '#52525b'], ['fg', '#18181b'],
        ]},
        { title: 'Semantic', items: [
          ['success-bg', '#f0fdf4'], ['success-fg', '#15803d'],
          ['error-bg', '#fef2f2'], ['error-fg', '#b91c1c'],
        ]},
      ];
      return (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <h3 className="text-caption uppercase tracking-wider text-fg-subtle">{g.title}</h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {g.items.map(([name, hex]) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="h-14 rounded-lg border border-border" style={{ background: hex }}/>
                    <div className="text-body-sm font-medium text-fg">{name}</div>
                    <div className="font-mono text-caption text-fg-subtle">{hex}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    },
    code: () => `// Tailwind utilities generated from src/index.css @theme:
//   bg-brand-500 / text-fg-muted / border-border / shadow-card …`,
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
];
