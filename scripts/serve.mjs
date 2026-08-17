#!/usr/bin/env node
/**
 * serve — the repo over http, with caching switched off.
 *
 * `python3 -m http.server` honours the browser cache, which cost two rounds of
 * "the change isn't there" during design review: the file on disk was correct,
 * the bundle in the tab was not. A design harness is read by reloading, so a
 * cached asset is never the behaviour you want here.
 *
 *   node scripts/serve.mjs [port]     # default 6006
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve, normalize } from 'node:path'

const PORT = Number(process.argv[2] ?? 6006)
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jsx': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.md': 'text/plain',
}

createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  // Keep the read inside the repo: a path is untrusted input even locally.
  const full = resolve('.' + normalize(p))
  if (!full.startsWith(resolve('.'))) { res.writeHead(403).end('forbidden'); return }
  try {
    const body = await readFile(full)
    res.writeHead(200, {
      'Content-Type': MIME[extname(p)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    })
    res.end(body)
  } catch { res.writeHead(404).end('not found') }
}).listen(PORT, () => console.log(`serving . on http://127.0.0.1:${PORT}  (no-store)`))
