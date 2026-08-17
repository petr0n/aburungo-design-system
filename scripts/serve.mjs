#!/usr/bin/env node
/**
 * serve — the repo over http, with caching switched off.
 *
 * `python3 -m http.server` honours the browser cache, which cost two rounds of
 * design review to the same illusion: the file on disk was correct, the bundle
 * in the tab was not, so a fix that had shipped looked like it had not. A
 * design harness is read by reloading it, so caching is never wanted here.
 *
 *   pnpm serve            # port 6006
 *   node scripts/serve.mjs 8080
 */
import { serveRepo } from './lib/harness.mjs'

const PORT = Number(process.argv[2] ?? 6006)
await serveRepo({ port: PORT })
console.log(`serving . on http://127.0.0.1:${PORT}  (no-store)`)
