import * as fs from 'node:fs/promises'
import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { KNOWN_BASE_URLS, KNOWN_OPENAI, OLLAMA_BASE_URL } from './backends'
import { mainMounts, webuiDb } from './utils'

/**
 * Two-way binding to Open WebUI's own config — its `webui.db` is the
 * single source of truth for backend wiring (Ollama URL, OpenAI-compatible
 * providers, enable flags, web-search engine, etc.). All values we manage
 * are PersistentConfig entries: the daemon reads them from the SQLite
 * `config.data` JSON blob at startup, and the in-app admin UI writes
 * back to that same blob.
 *
 * - `read()` returns a Watchable view derived from the JSON blob; the
 *   produce() loop polls webui.db / -wal mtime and refetches when it
 *   moves, so dep evaluation reacts to admin-UI edits.
 * - `merge()` deep-merges a partial JSON object into config.data and
 *   leaves every other key intact (preserves user tweaks elsewhere).
 *
 * All SQLite IO runs through a temp open-webui SubContainer so the
 * client stack matches the daemon's (same sqlite3 library, same WAL).
 */

export type CustomProvider = { baseUrl: string; apiKey: string }

export type BackendsView = {
  /**
   * Known on-instance backends currently wired into the config (matched by
   * base URL), regardless of whether they're still installed.
   */
  connectedIds: string[]
  /**
   * OpenAI entries that don't correspond to a known on-instance backend —
   * i.e. external / manually-added providers.
   */
  customProviders: CustomProvider[]
  /**
   * Raw `openai` arrays, exposed so setupMain can patch a single key slot in
   * place when a public-credential backend (e.g. vLLM) rotates its key.
   */
  openaiBaseUrls: string[]
  openaiApiKeys: string[]
}

const dbHostPath = (): string => sdk.volumes['open-webui'].subpath('webui.db')

const exists = (path: string): Promise<boolean> =>
  fs.access(path).then(
    () => true,
    () => false,
  )

const READ_SCRIPT = `import sqlite3, sys
conn = sqlite3.connect(sys.argv[1])
c = conn.cursor()
try:
    c.execute('SELECT data FROM config ORDER BY id DESC LIMIT 1')
    row = c.fetchone()
finally:
    conn.close()
sys.stdout.write(row[0] if row else '{}')
`

const WRITE_SCRIPT = `import sqlite3, sys
data = sys.stdin.read()
conn = sqlite3.connect(sys.argv[1])
c = conn.cursor()
try:
    c.execute('SELECT id FROM config ORDER BY id DESC LIMIT 1')
    row = c.fetchone()
    if row:
        c.execute('UPDATE config SET data = ? WHERE id = ?', (data, row[0]))
    else:
        c.execute('INSERT INTO config (data, version) VALUES (?, 0)', (data,))
    conn.commit()
finally:
    conn.close()
`

const ADMIN_CHECK_SCRIPT = `import sqlite3, sys
conn = sqlite3.connect(sys.argv[1])
c = conn.cursor()
try:
    c.execute("SELECT 1 FROM user WHERE role = 'admin' LIMIT 1")
    sys.stdout.write('admin' if c.fetchone() else 'none')
except sqlite3.OperationalError:
    sys.stdout.write('none')
finally:
    conn.close()
`

async function readRaw(effects: T.Effects): Promise<Record<string, any>> {
  if (!(await exists(dbHostPath()))) return {}
  const out = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-config-read',
    (subc) => subc.execFail(['python3', '-c', READ_SCRIPT, webuiDb]),
  )
  const stdout =
    typeof out.stdout === 'string'
      ? out.stdout
      : Buffer.from(out.stdout).toString('utf-8')
  try {
    const parsed = JSON.parse(stdout || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

async function writeRaw(
  effects: T.Effects,
  data: Record<string, any>,
): Promise<void> {
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-config-write',
    (subc) =>
      subc.execFail(['python3', '-c', WRITE_SCRIPT, webuiDb], {
        input: JSON.stringify(data),
      }),
  )
}

/**
 * True once Open WebUI has been initialized and a first admin account exists.
 * The daemon creates webui.db and its schema on first launch, and the first
 * registered user becomes the admin. Config writes are gated on this: writing
 * to the `config` table before the schema and admin exist corrupts onboarding
 * (issue #15). File-existence is checked first so this never creates an empty
 * webui.db itself, and a missing `user` table is treated as "no admin yet".
 */
export async function adminExists(effects: T.Effects): Promise<boolean> {
  if (!(await exists(dbHostPath()))) return false
  const out = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-admin-check',
    (subc) => subc.execFail(['python3', '-c', ADMIN_CHECK_SCRIPT, webuiDb]),
  )
  const stdout =
    typeof out.stdout === 'string'
      ? out.stdout
      : Buffer.from(out.stdout).toString('utf-8')
  return stdout.trim() === 'admin'
}

function isPlainObject(x: unknown): x is Record<string, any> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function deepMerge(
  base: Record<string, any>,
  overlay: Record<string, any>,
): Record<string, any> {
  const out: Record<string, any> = { ...base }
  for (const [k, v] of Object.entries(overlay)) {
    if (isPlainObject(v) && isPlainObject(out[k])) {
      out[k] = deepMerge(out[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

function strArr(x: unknown): string[] {
  return Array.isArray(x)
    ? x.filter((s): s is string => typeof s === 'string')
    : []
}

function deriveView(raw: Record<string, any>): BackendsView {
  const ollama = isPlainObject(raw.ollama) ? raw.ollama : {}
  const openai = isPlainObject(raw.openai) ? raw.openai : {}
  const ollamaUrls = strArr(ollama.base_urls)
  const openaiBaseUrls = strArr(openai.api_base_urls)
  const openaiApiKeys: string[] = Array.isArray(openai.api_keys)
    ? openai.api_keys.map((k: unknown) => (typeof k === 'string' ? k : ''))
    : []

  const connectedIds: string[] = []
  if ((ollama.enable ?? true) && ollamaUrls.includes(OLLAMA_BASE_URL)) {
    connectedIds.push('ollama')
  }
  for (const b of KNOWN_OPENAI) {
    if (openaiBaseUrls.includes(b.baseUrl)) connectedIds.push(b.id)
  }

  const customProviders: CustomProvider[] = openaiBaseUrls
    .map((baseUrl, i) => ({ baseUrl, apiKey: openaiApiKeys[i] ?? '' }))
    .filter((p) => !KNOWN_BASE_URLS.has(p.baseUrl))

  return { connectedIds, customProviders, openaiBaseUrls, openaiApiKeys }
}

// Poll cadence for the webui.db change watcher. SQLite WAL writes update
// webui.db-wal on every commit; mtime-stat polling at this interval gives
// us responsive 2-way binding without spawning a SubContainer-backed
// readRaw on every commit (which can be many per second under load).
const POLL_INTERVAL_MS = 3000

class WebuiConfigWatchable extends utils.Watchable<BackendsView> {
  protected readonly label = 'webuiConfig'

  protected async fetch(): Promise<BackendsView> {
    return deriveView(await readRaw(this.effects))
  }

  /**
   * Composite mtime across webui.db, -wal, and -shm. -wal moves on every
   * commit; the main file moves on checkpoint. Taking max() of all three
   * is enough to catch any kind of change without missing checkpoints.
   * Returns 0 when no file is present (first install).
   */
  private async dbMtime(): Promise<number> {
    const base = dbHostPath()
    const candidates = [base, `${base}-wal`, `${base}-shm`]
    let max = 0
    for (const path of candidates) {
      try {
        const st = await fs.stat(path)
        if (st.mtimeMs > max) max = st.mtimeMs
      } catch {
        // missing files are fine
      }
    }
    return max
  }

  protected async *produce(
    abort: AbortSignal,
  ): AsyncGenerator<BackendsView, void> {
    let lastMtime = await this.dbMtime()
    yield await this.fetch()

    while (this.effects.isInContext && !abort.aborted) {
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, POLL_INTERVAL_MS)
        abort.addEventListener('abort', () => {
          clearTimeout(t)
          resolve()
        })
      })
      if (abort.aborted) return

      const mtime = await this.dbMtime()
      if (mtime !== lastMtime) {
        lastMtime = mtime
        yield await this.fetch()
      }
    }
  }
}

export const webuiConfig = {
  read(effects: T.Effects): WebuiConfigWatchable {
    return new WebuiConfigWatchable(effects)
  },

  /**
   * Deep-merge a partial JSON object into the `config` row's `data` blob.
   * Keys we don't pass are left untouched, so admin-UI tweaks elsewhere
   * persist. Creates the row on first write if it doesn't exist.
   */
  async merge(effects: T.Effects, partial: Record<string, any>): Promise<void> {
    const current = await readRaw(effects)
    const next = deepMerge(current, partial)
    await writeRaw(effects, next)
  },

  /**
   * Re-export deriveView for callers that already hold a raw JSON blob.
   */
  deriveView,
}
