### Component: `<ComponentName>`

**Import**
```ts
import { ComponentName } from 'aburungo-design-system'
import type { ComponentNameProps } from 'aburungo-design-system'   // ONLY if scan.mjs says "props: … is public"
```
Most components keep their Props type private — `ButtonProps` is not in the barrel, for
one — so the second line is included only when `scan.mjs` reports the type as public.
Otherwise delete it; the props table below is documented from the source file instead.

**Props**

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| | | | | |

**Gaps** — app props or behaviour the ADS version does not cover. `None` if none.

**Files to delete** — paths relative to `../aburungo`, each confirmed fully superseded. `None` if none.

**Files to update** — one block per call site:
```diff
# src/path/File.tsx:LINE
- import { Button } from '@/components/ui/Button'
+ import { Button } from 'aburungo-design-system'
```

**CSS change** — `None`, or the exact edit to `../aburungo/src/index.css`.

**Tailwind scan** — `Covered` if `../aburungo/src/index.css` has
`@source '../node_modules/aburungo-design-system/dist/**/*.js';`, otherwise the line to add.

**Storybook** — `Section / Component / Story` in `storybook/stories.tsx`.
