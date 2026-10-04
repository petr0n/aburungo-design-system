### Component: `<ComponentName>`

**Import**
```ts
import { ComponentName } from 'aburungo-design-system'
import type { ComponentNameProps } from 'aburungo-design-system'
```

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
