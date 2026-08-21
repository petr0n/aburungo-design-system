/**
 * Which `<Button variant=…>` values a mirror is allowed to use.
 *
 * Its own module so `check-adherence.test.mjs` can import it. `check-adherence`
 * runs on import, so a test could not pull the function out of it directly.
 */
export const VARIANTS = ['primary', 'secondary', 'ghost']

/**
 * `<Button … variant=X>` in any JSX spelling, with X captured.
 *
 * Four literal forms are legal JSX and all four had to be covered:
 * `variant="x"`, `variant='x'`, `variant={"x"}`, `variant={'x'}`. The first
 * draft matched only the double-quoted one.
 *
 * `(?<![-\w])variant=` rather than `\bvariant=`: `\b` matches between the `-`
 * and the `v` of `data-variant`, so the word-boundary version still flagged it.
 * The lookbehind is what actually excludes a hyphenated attribute.
 *
 * `[\s\S]*?` and the `m`-less global flag are what make it work across a line
 * break. The first draft scanned line by line, so the commonest JSX style in
 * this repo —
 *
 *     <Button
 *       variant="accent"
 *
 * — sailed straight through. Measured on a probe of all six forms, the original
 * caught **one of five** real violations and produced one false positive.
 *
 * A dynamic `variant={expr}` is deliberately not matched: there is no literal to
 * check, and guessing at one would produce noise on correct code.
 */
const BUTTON_VARIANT =
  /<Button\b[^>]*?(?<![-\w])variant=(?:"([a-z-]+)"|'([a-z-]+)'|\{\s*"([a-z-]+)"\s*\}|\{\s*'([a-z-]+)'\s*\})/g

/**
 * A prop value no component implements is the quietest bug in this repo.
 *
 * `Button` dropped its `accent` variant in plan task 5.6. The variant map then
 * returns `undefined` for `variant="accent"`, the class list comes out empty,
 * and the button renders as bare text -- transparent background, no border,
 * measured. Nothing errors. It shipped on FIVE landing screens across three
 * files and survived for five days after 5.6 was recorded as complete, because
 * every one of them was in an untyped mirror.
 *
 * The typechecked harnesses never had it, and `variant="accent"` in
 * `src/components` would fail `tsc`. This rule is the mirrors' substitute.
 * Widen VARIANTS when a component legitimately grows one.
 *
 * The membership test is a list lookup on the captured value, not a negative
 * lookahead in the pattern: a lookahead of `(?!primary")` also accepts
 * `primaryX`, and the point of this gate is to be exact about which strings a
 * component implements.
 */
export function findUnknownVariants(source) {
  const out = []
  for (const m of source.matchAll(BUTTON_VARIANT)) {
    const value = m[1] ?? m[2] ?? m[3] ?? m[4]
    if (VARIANTS.includes(value)) continue
    out.push({
      value,
      index: m.index,
      text: m[0].replace(/\s+/g, ' ').trim(),
      msg: `Button has no variant "${value}". It renders as bare text, silently. Available: ${VARIANTS.join(', ')}.`,
    })
  }
  return out
}

