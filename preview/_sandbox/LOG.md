# Variant log

| Component | Variants | Shipped | Why |
|---|---|---|---|
| Card / surfaces | `surfaces-1-current.html` — before vs after | **After** | Page and card were both stone-0, so a card had no tonal separation from the page, while KanaGrid/KanaKeyboard/ScoreCard sat *darker* than it. Swapped `--color-bg` to stone-50 (page) and `--color-surface` to stone-0 (card); `Card` moved from `bg-bg` to `bg-surface`. Everything already on `bg-surface` became correct for free. |
| Focus ring | none — measured, not explored | `ring-offset-2 ring-offset-bg` | A ring on the control edge was 2.25:1 on the primary button and 1.03:1 on Akane. The offset puts page colour between control and ring so it reads against the page at 4.95:1. Enforced by `check-adherence.mjs`. |
