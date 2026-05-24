---
name: aburungo-design
description: Use this skill to generate well-branded interfaces and assets for AburunGo — a practical Japanese learning app for English speakers — either for production or throwaway prototypes/mocks/slides/marketing. Contains essential design guidelines, color and type tokens, fonts, logos/icons, content/voice rules, and a mobile UI kit. Anti-gamification is core: no points, streaks, hearts, badges, mascots, level-ups, or reward-loop mechanics ever appear in AburunGo designs.
user-invocable: true
---

# AburunGo design skill

Read the `README.md` file at the root of this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/mobile/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, marketing, etc), copy assets out into your output and create static HTML files for the user to view. If working on the production AburunGo code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

## Non-negotiables for AburunGo

1. **No gamification.** No points, XP, streaks, hearts, badges, mascots, level-ups, or any reward-loop ornament. The reward is using the language.
2. **Mobile-first and touch-first.** Every interactive element ≥ 44px tall. No hover-only affordances; use `active:` press states.
3. **Solid white surfaces.** No gradients, no full-bleed imagery, no glass/blur.
4. **One accent.** Brand purple `#aa3bff` only on auth CTAs, focus rings, and the logo. Everything else is the zinc scale.
5. **Noto Sans** for English UI, **M PLUS Rounded 1c** for Japanese content (`.jp` class / `lang="ja"`).
6. **Voice:** plain, declarative, second person. No emoji. No exclamation marks unless load-bearing.
7. **Iconography:** filled inline SVG only. No emoji, no unicode glyph icons, no outline icons.
