#!/usr/bin/env node
/**
 * Self-check for the mirror variant gate.
 *
 * This regex has been wrong five separate ways, three of them found by review
 * rather than by me: it missed single quotes, missed both brace-wrapped forms,
 * missed the multi-line JSX that is the commonest style in this repo, and
 * false-positived on `data-variant` because `\b` matches between `-` and `v`.
 * Measured against these cases, the first version caught ONE of five real
 * violations and produced one false positive, while the gate reported clean.
 *
 * The cases below are that measurement, kept. A gate nobody tested is a gate
 * that reports clean because it is looking in the wrong place.
 *
 *   node scripts/lib/variants.test.mjs
 */
import { findUnknownVariants } from './variants.mjs'

let failed = 0
const check = (label, source, expected) => {
  const got = findUnknownVariants(source).map((h) => h.value)
  const ok = JSON.stringify(got) === JSON.stringify(expected)
  if (!ok) {
    failed += 1
    console.error(`  FAIL  ${label}\n        expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`)
  }
  return ok
}

// The four literal JSX spellings, all legal, all previously missed but one.
check('double quotes', '<Button variant="accent">x</Button>', ['accent'])
check('single quotes', "<Button variant='accent'>x</Button>", ['accent'])
check('brace + double', '<Button variant={"accent"}>x</Button>', ['accent'])
check('brace + single', "<Button variant={'accent'}>x</Button>", ['accent'])

// Props wrap. This is the commonest style in the mirrors and a line-by-line
// scan sailed straight past it.
check('multi-line', '<Button\n  variant="accent"\n  size="md"\n>x</Button>', ['accent'])

// A hyphenated attribute is not the prop. `\b` matched between `-` and `v`.
check('data-variant is not variant', '<Button data-variant="accent">x</Button>', [])
check('aria-variant is not variant', '<Button aria-variant="accent">x</Button>', [])

// The three real variants pass, and a near-miss does not sneak through the way
// a negative lookahead would have let `primaryX` through.
check('primary is fine', '<Button variant="primary">x</Button>', [])
check('secondary is fine', '<Button variant="secondary">x</Button>', [])
check('ghost is fine', '<Button variant="ghost">x</Button>', [])
check('primaryX is not primary', '<Button variant="primaryx">x</Button>', ['primaryx'])

// A dynamic value has no literal to check; guessing would be noise.
check('dynamic value ignored', '<Button variant={tone}>x</Button>', [])

// Several in one file, and another component's variant is not ours to police.
check('two in one file', '<Button variant="accent"/>\n<Button variant="plum"/>', ['accent', 'plum'])
check('other components untouched', '<Badge variant="accent"/>', [])

if (failed > 0) {
  console.error(`\nvariant gate self-check: ${failed} failing`)
  process.exit(1)
}
console.log('variant gate self-check: ok (14 cases)')
