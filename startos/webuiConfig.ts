import * as fs from 'node:fs/promises'
import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
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

export const VLLM_BASE_URL = 'http://vllm.startos:8000/v1'
export const OLLAMA_BASE_URL = 'http://ollama.startos:11434'

export type CustomProvider = { baseUrl: string; apiKey: string }

export type BackendsView = {
  enableOllama: boolean
  enableVllm: boolean
  vllmApiKey: string | null
  customProviders: CustomProvider[]
}

export const DEFAULT_VIEW: BackendsView = {
  enableOllama: true,
  enableVllm: false,
  vllmApiKey: null,
  customProviders: [],
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

function deriveView(raw: Record<string, any>): BackendsView {
  const ollama = isPlainObject(raw.ollama) ? raw.ollama : {}
  const openai = isPlainObject(raw.openai) ? raw.openai : {}
  const baseUrls: string[] = Array.isArray(openai.api_base_urls)
    ? openai.api_base_urls.filter((u: unknown): u is string => typeof u === 'string')
    : []
  const apiKeys: string[] = Array.isArray(openai.api_keys)
    ? openai.api_keys.map((k: unknown) => (typeof k === 'string' ? k : ''))
    : []

  const vllmIdx = baseUrls.indexOf(VLLM_BASE_URL)
  const enableVllm = vllmIdx >= 0
  const vllmApiKey = enableVllm ? apiKeys[vllmIdx] ?? null : null

  const customProviders: CustomProvider[] = baseUrls
    .map((baseUrl, i) => ({ baseUrl, apiKey: apiKeys[i] ?? '' }))
    .filter((p) => p.baseUrl !== VLLM_BASE_URL)

  return {
    enableOllama: ollama.enable ?? DEFAULT_VIEW.enableOllama,
    enableVllm,
    vllmApiKey,
    customProviders,
  }
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
  async merge(
    effects: T.Effects,
    partial: Record<string, any>,
  ): Promise<void> {
    const current = await readRaw(effects)
    const next = deepMerge(current, partial)
    await writeRaw(effects, next)
  },

  /**
   * Re-export deriveView for callers that already hold a raw JSON blob.
   */
  deriveView,
}
