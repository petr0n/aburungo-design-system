# Brief: page templates for the whole site

**Written 2026-08-22, for whoever designs the page templates.** The book work in
`docs/book-identity-and-checkpoint-mockups-plan.md` built per-screen *content* and never
built the frame those screens sit in. This is the handoff for the frame.

The short version of why this exists: a "branded global header" was invented here on
2026-08-22 without opening the app's real shell first. It was rejected, correctly —
*"not remotely aligned with the actual AburunGo site."* Don't repeat that. Read §1
before designing anything.

---

## 1. Read these first, in this order

| # | Path | Why |
|---|---|---|
| 1 | `../aburungo/src/components/PageShell.tsx` | **The site's actual chrome.** Everything below is context for this file |
| 2 | `../aburungo/src/App.tsx` | The routes a template has to serve |
| 3 | `DESIGN.md` (this repo) | Palette roles, type hierarchy, named rules, per-surface taste dials |
| 4 | `src/tokens.css` | The only place a token value is written |
| 5 | `src/brand.css` | The brand utilities — most of what a title page needs already exists |
| 6 | `CLAUDE.md` (this repo) | The hard rules, including one that is enforced by a hook |

---

## 2. What the site actually is

`PageShell` wraps every page. It is **not** a coloured bar, and the Sumi `AppHeader`
band is a per-screen thing, not the site chrome.

```
mx-auto max-w-5xl px-4 sm:px-6, min-h-svh
├── header
│   ├── row 1: <Link class="ctype">  hanko + wordmark + rule + kata-vert
│   │            at clamp(60px, 9vw, 108px)          … AccountChip on the right
│   └── row 2: tab nav, border-t border-border,
│              active tab underlined border-b-2 border-brand-500
├── flex row: content (flex-1) + <aside class="hidden w-44 lg:block">
└── footer: border-t, the same .ctype lockup at 16px
```

The eight nav destinations: **Today · Words · Kana · Flashcards · Practice · Kanji ·
(Chat, only when Hana is enabled) · How to use**. Twelve public routes plus an admin
section behind `AdminRoute`.

Three things to notice, because they constrain a template more than they look:

1. **The lockup is enormous** — up to 108px — and it is the branding. A small wordmark
   bar is not the AburunGo header; that was the rejected design.
2. **The container is `max-w-5xl`**, not `3xl` and not `7xl`. The book surfaces cap
   their band at `max-w-3xl`; if the frame disagrees, one of them is wrong.
3. **There is a `lg:` sidebar that most pages leave empty.** A template that ignores it
   will look different from the pages that use it.

---

## 3. What this package gives you, and what it does not

**Gives you:** 23 components (`src/components/index.ts`), the full token set, and the
brand utilities `.hanko` `.maru` `.wm` `.kata-vert` `.ctype` `.frame` `.glass`
`.emboss-bg` + `.crest-1..5` + `.tile-sm/md/lg`.

**Does not give you: a page frame.** No shell, no nav, no footer, no account chip, no
sidebar. That is the gap. Everything built for the books assumes a bare screen with a
band on top.

`.ctype` is the lockup `PageShell` uses and it is already in `src/brand.css`. A title
page should almost certainly be built from it rather than from a fragment of it — the
book chapter opener currently uses a bare `.kata-vert` strip, which is a fragment, and
is the one book surface expected to change once these templates land.

---

## 4. The gates. A template is not done until these pass

```
pnpm lint          adherence + contrast + harness self-checks
pnpm check:touch   every control ≥44px, no hover-only affordances
pnpm build         brand check → lint → tsup → tokens → flows
```

- **No raw hex, no non-DS fonts** in `src/components/`. Enforced; it fails the build.
- **Contrast** is a real gate with three accepted exceptions (the Ōgon focus ring).
  New pairs go in `scripts/check-contrast.mjs`.
- **Touch targets ≥44px**, `active:` states required, no hover-only affordances.
- The contrast gate reads **flat tokens**. It cannot see a background image, a
  `currentColor`, or anything composited. Those have to be measured by rendering —
  see §6.

---

## 5. Decided. Do not re-open these

| Rule | |
|---|---|
| **One dark slab per screen** | `AppHeader` is it. A second dark bar is why the global header failed |
| **The Two-Plane Rule** | Chrome = the book. Card accent = the situation. They never merge |
| **The Band Ink Rule** | A band's title and subtitle share one ink; there is no muted step that survives on Akane |
| **Warm stone is load-bearing** | Page `#F7F6F1`, cards `#FFFDF8`. Cards are *lighter* than the page so they lift without a shadow. `#FFFDF8` is not a mistake for white |
| **Accents are inputs** | `PhraseCard` takes an `accent` prop. Colour carries meaning; it is not locked per component |
| **Verdict at 800** | Rokushō 800 / Akane 800, so correctness never wears a colour a band is already wearing |
| **No limit on books** | `BookId` is derived from the `BOOKS` array |
| **The lab is append-only** | Rejected options stay on the page, tagged, with the reason they lost |

---

## 6. Traps

**Silent-inert failures are this repo's characteristic bug.** A class or token that does
not exist renders *nothing* and errors *nowhere*. It has happened with `bg-inverse`, with
`variant="accent"` (five landing screens shipped with a bare-text primary button), with a
`.glass` border, and on 2026-08-22 with `border-rule` — a token that does not exist, which
would have drawn no border at all. **Render it and read the pixels back.** `pnpm shots`
and the puppeteer helpers in `scripts/lib/harness.mjs` are there for this.

Others worth knowing:

- **`brand-500` is a legacy v2 token.** `PageShell` still underlines its active tab with
  it. Prefer role tokens; the Zuihoden palette replaced it.
- **The patterned ground carries only `fg`, `fg-heading`, `fg-muted`.** `fg-subtle` is
  3.47:1 on it and is barred. Use `.glass` if fine print must sit over a crest.
- **Two harnesses are hand-written mirrors** (`ui_kits/app/`, `storybook/`). A component
  can be right in TSX and wrong on screen there. Adding a component means mirroring it
  by hand in the same commit.
- **`dist/tokens.plain.css` is generated but committed.** A broad `git add` has deleted
  it three times.
- **The lightning-bolt mark is banned and hook-enforced.** See `CLAUDE.md`. Don't work
  around the check.

---

## 7. Where to build

**`ui_kits/flows/`.** It imports the real components, is typechecked, and is bundled by
`pnpm build:flows`. It cannot drift. `?view=desktop` renders any flow at 1280 in a
browser frame; `?phone=375` narrows the phone shell.

Do **not** build templates in `ui_kits/app/` or `storybook/` — those are the hand-written
mirrors.

Add a flow in `ui_kits/flows/registry.ts` once and both harnesses pick it up.

---

## 8. What the templates should answer

1. **What sits above the page band at desktop width?** Currently nothing. This is the
   question the rejected header was trying to answer.
2. **Is the container `max-w-5xl` (the site) or `max-w-3xl` (the book band)?** They
   disagree today.
3. **What is the `lg:` sidebar for**, and what does a page look like without one?
4. **How does the huge `.ctype` lockup behave on a phone?** It clamps to 60px, which is
   still most of a small screen's first fold.
5. **Does a book screen keep its own band inside the site frame, or replace it?** The
   book identity is currently carried entirely by that band.
6. **Landing and signed-in are different frames** — `/` versus the eight nav
   destinations. Are they one template or two?

---

## 9. Where the book work stands

`docs/book-identity-and-checkpoint-mockups-plan.md` is the plan; §3b, §3c and the Phase 3
notes carry the measured findings. Phases 0–2 are done: five identities, five crests,
the four surfaces per book, the chapter checkpoint. Phase 3 (the remaining gates) is
open. Render them at
`http://127.0.0.1:6006/ui_kits/flows/?flow=book-one` — and serve with **`pnpm serve`**,
not `python3 -m http.server`, which caches and has twice made shipped work look absent.
