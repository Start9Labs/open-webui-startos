import * as fs from 'node:fs/promises'
import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { KNOWN_OPENAI, ResolvedBaseUrls } from './backends'
import { mainMounts, webuiDb } from './utils'

/**
 * Read/write access to Open WebUI's own config. The `config` table in
 * `webui.db` is the single source of truth for every PersistentConfig value:
 * the daemon reads it, the admin UI writes it, and since Open WebUI 0.10 the
 * environment only ever seeds a key that has no row yet
 * (`Config.seed_defaults`). So this package writes the database directly —
 * `managedConfig.ts` decides what to write and when.
 *
 * This module speaks flat dotted keys (`ollama.base_urls`,
 * `web.search.searxng_query_url`) in both directions. The table's physical
 * shape depends on the installed version, and the scripts handle both:
 *   - >= 0.10: one row per dotted key (`config.key` / `config.value`).
 *   - < 0.10: a single JSON blob row (`config.data`), the same keys nested.
 *     setupMain reads and writes before the daemon runs its own Alembic
 *     migration, so an upgrade from a pre-0.10 package still hits this once.
 *
 * Reads and writes touch only the keys the caller names, leaving every other
 * row (`ui.*`, `rag.*`, `api_configs`, …) alone. All SQLite IO runs through a
 * temp open-webui SubContainer so the client stack matches the daemon's (same
 * sqlite3 library, same WAL).
 */

/** Flat dotted key → JSON value, as stored in the `config` table. */
export type ConfigMap = Record<string, unknown>

/** The keys `deriveView` needs to report what backends are wired up. */
const BACKEND_KEYS = [
  'ollama.base_urls',
  'ollama.enable',
  'openai.api_base_urls',
  'openai.api_keys',
  'openai.enable',
]

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

const READ_SCRIPT = `import sqlite3, sys, json

keys = json.loads(sys.argv[2])
conn = sqlite3.connect(sys.argv[1])
c = conn.cursor()
out = {}
try:
    cols = {r[1] for r in c.execute('PRAGMA table_info(config)').fetchall()}
    if 'key' in cols and 'value' in cols:
        q = ','.join(['?'] * len(keys))
        for key, value in c.execute(
            'SELECT key, value FROM config WHERE key IN (' + q + ')', keys
        ).fetchall():
            try:
                out[key] = json.loads(value) if isinstance(value, (str, bytes)) else value
            except (TypeError, ValueError):
                continue
    elif 'data' in cols:
        row = c.execute('SELECT data FROM config ORDER BY id DESC LIMIT 1').fetchone()
        blob = json.loads(row[0]) if row and isinstance(row[0], (str, bytes)) else (row[0] if row else None)
        if isinstance(blob, dict):
            for key in keys:
                node = blob
                for part in key.split('.'):
                    node = node.get(part) if isinstance(node, dict) else None
                    if node is None:
                        break
                if node is not None:
                    out[key] = node
finally:
    conn.close()

sys.stdout.write(json.dumps(out))
`

const WRITE_SCRIPT = `import sqlite3, sys, json, time

data = json.loads(sys.stdin.read() or '{}')
conn = sqlite3.connect(sys.argv[1])
c = conn.cursor()
try:
    cols = {r[1] for r in c.execute('PRAGMA table_info(config)').fetchall()}
    if 'key' in cols and 'value' in cols:
        # Open WebUI >= 0.10: upsert the dotted keys we were given and nothing
        # else. Matches models.config.Config.upsert (JSON value, epoch time).
        now = int(time.time())
        for key, value in data.items():
            vj = json.dumps(value)
            c.execute('SELECT 1 FROM config WHERE key = ?', (key,))
            if c.fetchone():
                c.execute('UPDATE config SET value = ?, updated_at = ? WHERE key = ?', (vj, now, key))
            else:
                c.execute('INSERT INTO config (key, value, updated_at) VALUES (?, ?, ?)', (key, vj, now))
        conn.commit()
    elif 'data' in cols:
        # Open WebUI < 0.10: one JSON blob row, the same keys nested.
        row = c.execute('SELECT id, data FROM config ORDER BY id DESC LIMIT 1').fetchone()
        blob = json.loads(row[1]) if row and isinstance(row[1], (str, bytes)) else (row[1] if row else None)
        if not isinstance(blob, dict):
            blob = {}
        for key, value in data.items():
            parts = key.split('.')
            node = blob
            for part in parts[:-1]:
                nxt = node.get(part)
                if not isinstance(nxt, dict):
                    nxt = {}
                    node[part] = nxt
                node = nxt
            node[parts[-1]] = value
        encoded = json.dumps(blob)
        if row:
            c.execute('UPDATE config SET data = ? WHERE id = ?', (encoded, row[0]))
        else:
            c.execute('INSERT INTO config (data, version) VALUES (?, 0)', (encoded,))
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

const stdoutOf = (out: { stdout: string | Buffer }): string =>
  typeof out.stdout === 'string'
    ? out.stdout
    : Buffer.from(out.stdout).toString('utf-8')

/**
 * Read the named config keys. A key with no row is simply absent from the
 * result — the caller distinguishes "unset" from "set to empty".
 */
export async function readConfig(
  effects: T.Effects,
  keys: string[],
): Promise<ConfigMap> {
  if (!(await exists(dbHostPath()))) return {}
  const out = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-config-read',
    (subc) =>
      subc.execFail([
        'python3',
        '-c',
        READ_SCRIPT,
        webuiDb,
        JSON.stringify(keys),
      ]),
  )
  try {
    const parsed = JSON.parse(stdoutOf(out) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

/**
 * Upsert the given keys, leaving every other key alone.
 *
 * Refuses to act when `webui.db` is absent: `sqlite3.connect` would create an
 * empty file, and Open WebUI's Alembic run then inherits a database it didn't
 * build — the corruption behind issue #15. Init boots the daemon once on
 * install precisely so this can't happen, and this guard keeps that invariant
 * from depending on init having run.
 */
export async function writeConfig(
  effects: T.Effects,
  values: ConfigMap,
): Promise<void> {
  if (!Object.keys(values).length) return
  if (!(await exists(dbHostPath()))) {
    console.warn('webui.db does not exist yet; skipping config write')
    return
  }
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-config-write',
    (subc) =>
      subc.execFail(['python3', '-c', WRITE_SCRIPT, webuiDb], {
        input: JSON.stringify(values),
      }),
  )
}

/**
 * True once Open WebUI has been initialized and a first admin account exists.
 * The first registered user becomes the admin, and the Configure Backends
 * action refuses to run before that (issue #15). File-existence is checked
 * first so this never creates an empty webui.db itself, and a missing `user`
 * table is treated as "no admin yet".
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
  return stdoutOf(out).trim() === 'admin'
}

function strArr(x: unknown): string[] {
  return Array.isArray(x)
    ? x.filter((s): s is string => typeof s === 'string')
    : []
}

function deriveView(
  raw: ConfigMap,
  resolvedBaseUrls: ResolvedBaseUrls,
): BackendsView {
  const ollamaUrls = strArr(raw['ollama.base_urls'])
  const openaiBaseUrls = strArr(raw['openai.api_base_urls'])
  const openaiApiKeys: string[] = Array.isArray(raw['openai.api_keys'])
    ? raw['openai.api_keys'].map((k: unknown) =>
        typeof k === 'string' ? k : '',
      )
    : []

  const connectedIds: string[] = []
  const ollamaUrl = resolvedBaseUrls['ollama']
  if (
    ollamaUrl &&
    (raw['ollama.enable'] ?? true) &&
    ollamaUrls.includes(ollamaUrl)
  ) {
    connectedIds.push('ollama')
  }
  for (const b of KNOWN_OPENAI) {
    const url = resolvedBaseUrls[b.id]
    if (url && openaiBaseUrls.includes(url)) connectedIds.push(b.id)
  }

  const knownBaseUrls = new Set(
    Object.values(resolvedBaseUrls).filter((u): u is string => u !== null),
  )
  const customProviders: CustomProvider[] = openaiBaseUrls
    .map((baseUrl, i) => ({ baseUrl, apiKey: openaiApiKeys[i] ?? '' }))
    .filter((p) => !knownBaseUrls.has(p.baseUrl))

  return { connectedIds, customProviders, openaiBaseUrls, openaiApiKeys }
}

// Poll cadence for the webui.db change watcher. SQLite WAL writes update
// webui.db-wal on every commit; mtime-stat polling at this interval gives
// us responsive 2-way binding without spawning a SubContainer-backed
// read on every commit (which can be many per second under load).
const POLL_INTERVAL_MS = 3000

class WebuiConfigWatchable extends utils.Watchable<BackendsView> {
  protected readonly label = 'webuiConfig'

  constructor(
    effects: T.Effects,
    private readonly resolvedBaseUrls: ResolvedBaseUrls,
  ) {
    super(effects)
  }

  protected async fetch(): Promise<BackendsView> {
    return deriveView(
      await readConfig(this.effects, BACKEND_KEYS),
      this.resolvedBaseUrls,
    )
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
        const onAbort = () => {
          clearTimeout(timer)
          resolve()
        }
        // Drop the listener when the timer fires, and { once } drops it on
        // abort — otherwise a fresh abort listener accumulates every poll for
        // the life of the subscription (MaxListenersExceededWarning after ~10).
        const timer = setTimeout(() => {
          abort.removeEventListener('abort', onAbort)
          resolve()
        }, POLL_INTERVAL_MS)
        abort.addEventListener('abort', onAbort, { once: true })
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
  read(
    effects: T.Effects,
    resolvedBaseUrls: ResolvedBaseUrls,
  ): WebuiConfigWatchable {
    return new WebuiConfigWatchable(effects, resolvedBaseUrls)
  },
}
