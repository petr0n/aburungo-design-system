# Variant log

| Component | Variants | Shipped | Why |
|---|---|---|---|
| Card / surfaces | `surfaces-1-current.html` — before vs after | **After** | Page and card were both stone-0, so a card had no tonal separation from the page, while KanaGrid/KanaKeyboard/ScoreCard sat *darker* than it. Swapped `--color-bg` to stone-50 (page) and `--color-surface` to stone-0 (card); `Card` moved from `bg-bg` to `bg-surface`. Everything already on `bg-surface` became correct for free. |
| Focus ring | none — measured, not explored | `ring-offset-2 ring-offset-bg` | A ring on the control edge was 2.25:1 on the primary button and 1.03:1 on Akane. The offset puts page colour between control and ring so it reads against the page at 4.95:1. Enforced by `check-adherence.mjs`. |
| Vibrancy (A+B) | `vibrancy-1-before-after.html` | **After** | Every colour that landed on a surface was a 50/100 tint — `action-2-bg` was Rokushō at 97% white, `tag-bg` Ōgon at 95% white — while `bg-inverse` was never built at all. The drop's own index page uses the five at full strength on large fields. **A:** `AppHeader` and `KanaKeyboard` take the Sumi-iro band, Ōgon hairline, Akane mark. **B:** `action-2-bg` → Rokushō 100 with a Rokushō 500 border; `tag-bg` → Ōgon 200. Also reverted the values I had dulled for contrast: focus back to Ōgon 500, tag-fg to Ōgon 700, progress-fill to Rokushō 500. |
