import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/components/index.ts',
    lib:   'src/lib/index.ts',
  },
  format: ['esm'],
  dts: true,
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  clean: true,
  treeshake: true,
  sourcemap: true,
  // `clean: true` empties dist/ on every build -- including the committed
  // dist/tokens.plain.css that every preview page imports. `pnpm build` is
  // safe only because build:tokens runs after tsup; `pnpm dev` (tsup --watch)
  // had no such step, so the first watch rebuild deleted the sheet and every
  // preview page lost its styles. Found 2026-09-19 with two watchers running.
  // Regenerating here makes the sheet survive every build path, not just one.
  onSuccess: 'node scripts/build-tokens.mjs',
})
