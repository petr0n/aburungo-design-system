/**
 * Shared plumbing for the scripts that render this repo headlessly.
 *
 * `shots`, `measure-strip-contrast` and `serve` each grew their own copy of a
 * static file server, and the first two their own copy of the Chrome lookup.
 * Three copies meant three places to get path containment wrong, and two of
 * them did. One module, fixed once.
 */
import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve, relative, isAbsolute } from 'node:path'
import { homedir } from 'node:os'

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jsx': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.md': 'text/plain', '.txt': 'text/plain',
}

/**
 * Resolve a URL path under `root`, or null if it escapes.
 *
 * `resolved.startsWith(root)` is NOT enough: with a root of `/srv/app` it also
 * accepts `/srv/app-backup/secrets`, because that is a string prefix without
 * being a subdirectory. `relative()` answers the question actually being
 * asked — is this below root — and returns a `..` segment when it is not.
 */
export function safeResolve(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  const full = resolve(root, '.' + (decoded.endsWith('/') ? decoded + 'index.html' : decoded))
  const rel = relative(root, full)
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) return null
  return full
}

/**
 * A read-only static server rooted at `root`, listening on `port`.
 *
 * `cache: false` (the default) sends no-store. A design harness is read by
 * reloading it, and a cached bundle has twice made a shipped fix look absent.
 * Returns the server so callers can close it.
 */
export async function serveRepo({ root = process.cwd(), port, cache = false } = {}) {
  const base = resolve(root)
  const server = createServer(async (req, res) => {
    const full = safeResolve(base, req.url)
    if (full === null) { res.writeHead(403).end('forbidden'); return }
    try {
      const body = await readFile(full)
      const headers = { 'Content-Type': MIME[extname(full)] ?? 'application/octet-stream' }
      if (!cache) headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
      res.writeHead(200, headers)
      res.end(body)
    } catch { res.writeHead(404).end('not found') }
  })
  await new Promise((r) => server.listen(port, r))
  return server
}

/**
 * Locate a Chrome binary for puppeteer-core.
 *
 * Order: PUPPETEER_EXECUTABLE_PATH, then puppeteer's own cache. The platform
 * folder is discovered rather than assumed — this used to hard-code
 * `chrome-headless-shell-mac-arm64`, which crashes on every other platform and
 * on a mac clone that has not run the installer yet, before it can say why.
 */
export async function findChrome() {
  const override = process.env.PUPPETEER_EXECUTABLE_PATH
  if (override !== undefined && override !== '') {
    if (!existsSync(override)) {
      throw new Error(`PUPPETEER_EXECUTABLE_PATH is set but not found: ${override}`)
    }
    return override
  }

  const hint = 'Run:  npx puppeteer browsers install chrome-headless-shell\n' +
    'or set PUPPETEER_EXECUTABLE_PATH to a Chrome binary.'
  const cache = join(homedir(), '.cache/puppeteer/chrome-headless-shell')
  if (!existsSync(cache)) throw new Error(`No cached Chrome at ${cache}.\n${hint}`)

  const versions = (await readdir(cache)).sort()
  for (const version of versions.reverse()) {
    const versionDir = join(cache, version)
    let platforms = []
    try { platforms = await readdir(versionDir) } catch { continue }
    for (const platform of platforms) {
      for (const name of ['chrome-headless-shell', 'chrome-headless-shell.exe']) {
        const bin = join(versionDir, platform, name)
        if (existsSync(bin)) return bin
      }
    }
  }
  throw new Error(`Cached Chrome at ${cache} has no usable binary.\n${hint}`)
}
