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
})
