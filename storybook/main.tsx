/**
 * The storybook shell — sidebar, canvas, controls, code tab.
 *
 * This used to live as an inline `<script type="text/babel">` in
 * `index.html`, next to two more Babel tags: one for `stories.jsx` and one for
 * `ui_kits/mobile/components.jsx`, the hand-written mirror every story
 * actually rendered. A component could be correct in TSX and wrong here, and
 * nothing could tell you — which is how a `variant="accent"` that no `Button`
 * has ever implemented shipped five landing screens with a bare-text primary
 * button.
 *
 * Now it is bundled by `scripts/build-flows.mjs` alongside the two flow
 * harnesses, and the stories import `src/components` directly. There is no
 * second copy left to drift, and the in-browser Babel compiler is gone with
 * it.
 *
 * React is external and arrives from the page's import map, the same way the
 * flow harnesses get it. That matters here specifically: the shell and the
 * stories must share ONE React, or every hook inside a real component throws
 * on render.
 */
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import { SECTIONS } from './stories'
import type { Args, ArgType, ComponentEntry, Section, Story } from './types'

function Caret() {
  return (
    <svg className="caret" viewBox="0 0 12 12" fill="none">
      <path
        d="M4.5 3l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

type Pick = { sectionTitle: string; componentName: string; storyName: string }
type Found = { section: Section; component: ComponentEntry; storyName: string; story: Story }

/**
 * Resolve a hash to a story, falling back at each level rather than throwing.
 *
 * A stale bookmark naming a story that has since been renamed lands on the
 * first story of the nearest thing that still exists, which is the right
 * behaviour for a browsable catalogue.
 */
function findStory(
  sections: readonly Section[],
  sectionTitle: string,
  componentName: string,
  storyName: string,
): Found {
  const section = sections.find((s) => s.title === sectionTitle) ?? sections[0]
  const component = section.components.find((c) => c.name === componentName) ?? section.components[0]
  const names = Object.keys(component.stories)
  const name = names.includes(storyName) ? storyName : names[0]
  return { section, component, storyName: name, story: component.stories[name] }
}

function parseHash(): Pick | null {
  const h = (window.location.hash || '#').slice(1)
  if (h === '') return null
  const parts = h.split('/').map(decodeURIComponent)
  if (parts.length < 3) return null
  return { sectionTitle: parts[0], componentName: parts[1], storyName: parts[2] }
}

function writeHash(s: string, c: string, n: string) {
  window.location.hash = `#${encodeURIComponent(s)}/${encodeURIComponent(c)}/${encodeURIComponent(n)}`
}

type SidebarProps = {
  sections: readonly Section[]
  current: Found
  navOpen: boolean
  onSelect: (section: string, component: string, story: string) => void
}

function Sidebar({ sections, current, navOpen, onSelect }: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {}
    for (const s of sections) {
      for (const c of s.components) o[`${s.title}/${c.name}`] = c.name === current.component.name
    }
    return o
  })

  function toggle(key: string) {
    setOpen((o) => ({ ...o, [key]: !o[key] }))
  }

  return (
    <aside className={['sb-sidebar', navOpen ? 'open' : ''].join(' ')}>
      {sections.map((s) => (
        <div key={s.title}>
          <div className="sb-section-title">{s.title}</div>
          {s.components.map((c) => {
            const key = `${s.title}/${c.name}`
            const isOpen = open[key] === true
            return (
              <div key={c.name}>
                <div
                  className={['sb-component-row', isOpen ? 'open' : ''].join(' ')}
                  onClick={() => toggle(key)}
                >
                  <Caret />
                  <span>{c.name}</span>
                </div>
                {isOpen &&
                  Object.keys(c.stories).map((storyName) => {
                    const isActive =
                      current.section.title === s.title &&
                      current.component.name === c.name &&
                      current.storyName === storyName
                    return (
                      <div
                        key={storyName}
                        className={['sb-story-row', isActive ? 'active' : ''].join(' ')}
                        onClick={() => onSelect(s.title, c.name, storyName)}
                      >
                        {storyName}
                      </div>
                    )
                  })}
              </div>
            )
          })}
        </div>
      ))}
    </aside>
  )
}

type ControlsProps = {
  args: Args
  argTypes: Record<string, ArgType> | undefined
  onChange: (next: Args) => void
}

function ControlsPanel({ args, argTypes, onChange }: ControlsProps) {
  const keys = Object.keys(argTypes ?? {})
  if (argTypes === undefined || keys.length === 0) {
    return <p className="sb-empty">This story has no controls.</p>
  }
  return (
    <div>
      {keys.map((key) => {
        const t = argTypes[key]
        const v = args[key]
        const set = (nv: Args[string]) => onChange({ ...args, [key]: nv })
        return (
          <div key={key} className="sb-controls-row">
            <label>{key}</label>
            <div>
              {t.control === 'text' && (
                <input
                  type="text"
                  value={typeof v === 'string' ? v : ''}
                  onChange={(e) => set(e.target.value)}
                />
              )}
              {t.control === 'boolean' && (
                <input type="checkbox" checked={v === true} onChange={(e) => set(e.target.checked)} />
              )}
              {t.control === 'select' && (
                <select value={String(v ?? '')} onChange={(e) => set(e.target.value)}>
                  {t.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}
              {t.control === 'range' && (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={t.min}
                    max={t.max}
                    step={t.step}
                    value={typeof v === 'number' ? v : t.min}
                    onChange={(e) => set(Number(e.target.value))}
                  />
                  <span className="font-mono text-body-sm text-fg-muted">
                    {(typeof v === 'number' ? v : t.min).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="sb-control-type">{t.control}</div>
          </div>
        )
      })}
    </div>
  )
}

function StoryCanvas({ story, args }: { story: Story; args: Args }): ReactNode {
  return story.render(args)
}

const FALLBACK: Pick = { sectionTitle: 'Primitives', componentName: 'Button', storyName: 'Primary' }

function App() {
  const [pick, setPick] = useState<Pick>(() => parseHash() ?? FALLBACK)
  const [tab, setTab] = useState<'controls' | 'code'>('controls')
  const [gridBg, setGridBg] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [argOverrides, setArgOverrides] = useState<Record<string, Args>>({})

  const current = findStory(SECTIONS, pick.sectionTitle, pick.componentName, pick.storyName)
  const argKey = `${current.section.title}/${current.component.name}/${current.storyName}`
  const args: Args = { ...(current.story.args ?? {}), ...(argOverrides[argKey] ?? {}) }

  function select(sectionTitle: string, componentName: string, storyName: string) {
    writeHash(sectionTitle, componentName, storyName)
    setPick({ sectionTitle, componentName, storyName })
    setNavOpen(false)
  }

  useEffect(() => {
    function onHash() {
      const p = parseHash()
      if (p !== null) setPick(p)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (parseHash() === null) writeHash(FALLBACK.sectionTitle, FALLBACK.componentName, FALLBACK.storyName)
  }, [])

  const code = current.story.code === undefined ? '' : current.story.code(args)

  return (
    <div className="sb-root">
      {/* Backdrop — mobile only, closes the drawer on tap. */}
      <div
        className={['sb-backdrop', navOpen ? 'open' : ''].join(' ')}
        onClick={() => setNavOpen(false)}
      />

      <header className="sb-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="sb-menu-btn"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((o) => !o)}
          >
            <HamburgerIcon />
          </button>
          <div className="sb-brand">
            <img src="../assets/logo-a-128.png" alt="" />
            <span>AburunGo · Storybook</span>
          </div>
        </div>
        <div className="sb-meta">
          <span>{Object.keys(current.story.argTypes ?? {}).length} controls</span>
          <a href="../README.md" target="_blank" rel="noreferrer">
            README
          </a>
          <a href="../ui_kits/flows/index.html">Open flows</a>
        </div>
      </header>

      <Sidebar sections={SECTIONS} current={current} navOpen={navOpen} onSelect={select} />

      <main className="sb-main">
        <div className="sb-toolbar">
          <div className="crumbs">
            <span>{current.section.title}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--color-fg-muted)', fontWeight: 500 }}>
              {current.component.name}
            </span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--color-fg)', fontWeight: 600 }}>{current.storyName}</span>
          </div>
          <div className="tabs">
            <button data-active={gridBg} onClick={() => setGridBg(true)}>
              Grid
            </button>
            <button data-active={!gridBg} onClick={() => setGridBg(false)}>
              Solid
            </button>
          </div>
        </div>

        <div className="sb-preview">
          <div className={`sb-canvas ${gridBg ? '' : 'sb-canvas-bg-solid'}`}>
            <StoryCanvas key={argKey} story={current.story} args={args} />
          </div>
        </div>

        <div className="sb-bottom">
          <div className="sb-bottom-tabs">
            <button data-active={tab === 'controls'} onClick={() => setTab('controls')}>
              Controls
            </button>
            <button data-active={tab === 'code'} onClick={() => setTab('code')}>
              Code
            </button>
          </div>
          <div className="sb-bottom-body">
            {tab === 'controls' && (
              <ControlsPanel
                args={args}
                argTypes={current.story.argTypes}
                onChange={(next) => setArgOverrides((o) => ({ ...o, [argKey]: next }))}
              />
            )}
            {tab === 'code' && (
              <pre className="sb-code">{code === '' ? '// (no code snippet for this story)' : code}</pre>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * The story registry, exposed deliberately for tooling.
 *
 * `scripts/check-touch-targets.mjs` walks every story to measure its controls,
 * and it reads this rather than scraping the sidebar so it cannot fall behind
 * what the sidebar shows. It was `window.STORIES` when the stories were a
 * browser-JSX global; the conversion to an ES module removed it, the gate
 * silently measured **zero** stories, and still printed `ok`. Both halves of
 * that are fixed — the gate now fails on an empty walk — but the contract is
 * kept, and it is a contract, not a debug leftover. Renaming it breaks the
 * gate quietly.
 */
declare global {
  interface Window {
    STORIES?: readonly Section[]
  }
}
window.STORIES = SECTIONS

const host = document.getElementById('root')
if (host === null) throw new Error('storybook: no #root in the host page')

createRoot(host).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
