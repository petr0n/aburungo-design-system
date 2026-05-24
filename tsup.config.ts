import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/components/index.ts'],
  format: ['esm'],
  dts: true,
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  clean: true,
  treeshake: true,
  sourcemap: true,
})
