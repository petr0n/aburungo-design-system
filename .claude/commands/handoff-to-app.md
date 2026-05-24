# Handoff: ADS component → AburunGo app

You are handing off a completed ADS component (or set of components) to the AburunGo app at `../aburungo`. Your job is to produce a self-contained integration spec so that the app can be updated precisely and without guesswork.

## Step 1 — Identify the target component(s)

If the user named a component, use it. Otherwise, ask which component(s) to hand off.

Check that the component exists and is exported:
- Source file: `src/components/<ComponentName>.tsx` (or `src/components/ui/<ComponentName>.tsx`)
- Exported from: `src/components/index.ts`
- Built: `dist/index.js` and `dist/index.d.ts` must exist — run `pnpm build` first if they don't

## Step 2 — Read the component

Read the full TypeScript source of the component. Extract:
- All exported names (component + types)
- Every prop (name, type, required/optional, default)
- Any slots or compound sub-components (e.g. `CardHeader`, `CardBody`)
- Peer dependencies implied by props (e.g. `audioSlot` expects an `AudioButton`)

## Step 3 — Audit the AburunGo app

Scan `../aburungo/src/` to find:
1. **Direct duplicates** — components with the same name and purpose that should be deleted and replaced by the ADS import.
2. **Partial duplicates** — inline implementations (JSX inline-styles, one-off Tailwind utility stacks) that recreate this component's appearance. List the file and line range.
3. **Call sites** — every place in the app that already uses a component by this name. List file:line.
4. **Import path currently used** — e.g. `@/components/ui/Button` or `@/components/PhraseCard`.

## Step 4 — Write the integration spec

Output a markdown document with these exact sections:

---

### Component: `<ComponentName>`

**Import**
```ts
import { ComponentName } from 'aburungo-design-system'
// If importing types too:
import { ComponentName } from 'aburungo-design-system'
import type { ComponentNameProps } from 'aburungo-design-system'
```

**Props**

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| … | … | … | … | … |

**Files to delete**
List every file in `../aburungo/src/` that is fully superseded by this component. Include path relative to repo root.

**Files to update**
For each call site, show a before/after diff:
```diff
- import { Button } from '@/components/ui/Button'
+ import { Button } from 'aburungo-design-system'
```
Include file path and line number.

**CSS change required?**
State whether any change is needed to `../aburungo/src/index.css`. Usually none — the app already has the ADS tokens. If a new token was added to `src/index.css` in this ADS component, list it and show where to paste it in the app's CSS.

**Tailwind content scan**
The app's Vite config must scan ADS components for Tailwind utilities. Check whether `../aburungo/vite.config.ts` already includes a content path covering `node_modules/aburungo-design-system/`. If not, add it to the spec.

**Storybook reference**
State the section and story name in the ADS storybook where this component can be previewed: e.g. `Primitives / Button / Primary`.

---

## Step 5 — Offer to apply

After writing the spec, ask: "Apply these changes to the AburunGo app now?"

If yes:
1. Delete the listed files.
2. Update each import at the listed file:line locations.
3. Apply any CSS changes.
4. Run `pnpm --filter aburungo build` and `pnpm --filter aburungo test` from the monorepo root, or `pnpm build && pnpm test` from inside `../aburungo`.
5. Report pass/fail.

## Hard rules

- Never delete a file without first confirming it is fully superseded — check for any code in it that is NOT covered by the ADS component.
- If the app component has props the ADS version does not support, note the gap explicitly. Do not silently drop functionality.
- Do not modify `src/components/` in this repo during a handoff — if a gap is found, flag it as a follow-up for the ADS, not a quick patch.
- Write for a developer who was not in the design conversation. No assumed context.
