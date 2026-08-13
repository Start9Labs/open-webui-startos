import { T } from '@start9labs/start-sdk'
import { KNOWN_BACKENDS, ResolvedBaseUrls } from './backends'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { ConfigMap, readConfig, writeConfig } from './webuiConfig'
import { mainHostId as searxngHostId } from 'searxng-startos/startos/interfaces'
import { uiPort as searxngUiPort } from 'searxng-startos/startos/utils'

/**
 * Every `webui.db` config value this package sets, and the policy for each.
 *
 * Open WebUI reads a PersistentConfig key from the environment only when the
 * key has no row yet (`Config.seed_defaults`, since 0.10) — after that the
 * stored row wins for good, edited or not. So an env var is a one-shot seed,
 * never an override, and anything this package has to be able to *change*
 * later has to be written to the database instead.
 *
 * Two policies follow from that:
 *   - **SEED** — written once, during install, and never asserted again.
 *     These are starting points the user owns from then on.
 *   - **RECONCILED** — re-asserted on every start, because the correct value
 *     can change under the user (a dependency's assigned bridge port moves, a
 *     dependency is installed after Open WebUI's first launch). A value the
 *     user has changed is never overwritten; see `isOurs`.
 */

/** What the desired values are derived from. */
export type ManagedContext = {
  /** SearXNG's bridge address (`host:port`), or null when not installed. */
  searxng: string | null
}

/**
 * Resolve the dependency addresses the managed values are built from. Use
 * `'const'` in setupMain so installing SearXNG (or its assigned bridge port
 * moving) re-runs main and heals the stored endpoint on its own; `'once'`
 * during init, which runs to completion and does not subscribe.
 */
export async function resolveManagedContext(
  effects: T.Effects,
  mode: 'const' | 'once',
): Promise<ManagedContext> {
  return {
    searxng: await sdk.host
      .getBridgeAddress(effects, {
        packageId: 'searxng',
        hostId: searxngHostId,
        internalPort: searxngUiPort,
        ssl: false,
      })
      [mode](),
  }
}

/**
 * Written at install only. Open WebUI defaults `ollama.enable` and
 * `openai.enable` to true, so seeding them false is what keeps backends
 * opt-in until the user picks them in Configure Backends.
 */
const SEED: ConfigMap = {
  'ollama.enable': false,
  'openai.enable': false,
  'ui.enable_community_sharing': false,
  'web.search.engine': 'searxng',
}

type Reconciled = {
  key: string
  /** Older spellings of the same key, read but never written. */
  legacyKeys: string[]
  /** The value we want, or null when there is nothing to assert. */
  desired: (ctx: ManagedContext) => string | null
}

/** The reconciled key holding SearXNG's web-search endpoint. */
export const SEARXNG_QUERY_URL_KEY = 'web.search.searxng_query_url'

const RECONCILED: Reconciled[] = [
  {
    key: SEARXNG_QUERY_URL_KEY,
    // 0.11 renames the `rag.web.` key prefix to `web.` at startup, after
    // setupMain has already read, so a database carried over from 0.10.x still
    // spells it the old way. Writing only the new spelling is safe either way:
    // that rename keeps an existing `web.` row and drops the `rag.web.` one.
    legacyKeys: ['rag.web.search.searxng_query_url'],
    // `<query>` is Open WebUI's own substitution placeholder.
    desired: ({ searxng }) =>
      searxng && `http://${searxng}/search?q=<query>&format=json`,
  },
]

/**
 * Repoint the backend entries whose assigned bridge port has moved.
 *
 * The backend arrays are the same problem as a reconciled key, one level down:
 * `ollama.base_urls` and `openai.api_base_urls` mix entries this package wrote
 * with providers the user added by hand, so ownership has to be decided per
 * entry rather than for the whole value. `managedBackendUrls` records the URL
 * we last wrote for each backend, which is what identifies our entry — several
 * backends share the `10.0.3.1` bridge host and differ only by assigned port,
 * so nothing about the URL itself can attribute it.
 *
 * Rewrites in place so the index is preserved and `openai.api_keys` stays
 * aligned with `openai.api_base_urls`. Mutates both arrays; returns which of
 * them changed and the ownership records to save.
 *
 * A backend that isn't installed is skipped rather than removed — its entry is
 * the user's to delete from Configure Backends. An entry we have no record for
 * is claimed only when it already equals the resolved address, so an install
 * predating this bookkeeping starts healing from the next Configure Backends
 * run rather than having a guess imposed on it.
 */
export function repointBackendUrls(
  resolved: ResolvedBaseUrls,
  owned: Record<string, string>,
  ollamaUrls: string[],
  openaiUrls: string[],
): { ollama: boolean; openai: boolean; claims: Record<string, string> } {
  const claims: Record<string, string> = {}
  let ollama = false
  let openai = false

  for (const b of KNOWN_BACKENDS) {
    const url = resolved[b.id]
    if (!url) continue
    const isOllama = b.protocol === 'ollama'
    const arr = isOllama ? ollamaUrls : openaiUrls

    if (arr.includes(url)) {
      if (owned[b.id] !== url) claims[b.id] = url
      continue
    }
    const last = owned[b.id]
    if (last === undefined) continue
    const idx = arr.indexOf(last)
    if (idx < 0) continue

    arr[idx] = url
    claims[b.id] = url
    if (isOllama) ollama = true
    else openai = true
  }

  return { ollama, openai, claims }
}

/**
 * Whether a stored value is ours to replace: unset, empty, or still exactly
 * what we wrote last time. Anything else the user (or the admin UI) has
 * changed, and we leave it alone — permanently, since we then have no record
 * of it and this evaluation repeats unchanged on every start.
 */
const isOurs = (stored: string | undefined, lastWritten: string | undefined) =>
  stored === undefined || stored === '' || stored === lastWritten

const storedValue = (current: ConfigMap, entry: Reconciled) =>
  [entry.key, ...entry.legacyKeys]
    .map((k) => current[k])
    .find((v): v is string => typeof v === 'string')

/**
 * Write every managed value and claim ownership of the reconciled ones.
 *
 * Install only, and only after the daemon has been booted once: the `config`
 * table exists by then, and nothing in it is the user's yet, so this writes
 * unconditionally.
 */
export async function seedManagedConfig(
  effects: T.Effects,
  ctx: ManagedContext,
): Promise<void> {
  const values: ConfigMap = { ...SEED }
  const written: Record<string, string> = {}
  for (const entry of RECONCILED) {
    const desired = entry.desired(ctx)
    if (desired === null) continue
    values[entry.key] = desired
    written[entry.key] = desired
  }

  await writeConfig(effects, values)
  await storeJson.merge(effects, { managedConfig: written })
}

/**
 * Take the reconciled values back under management, ignoring `isOurs`, and
 * return what was written.
 *
 * `reconcileManagedConfig` deliberately never overwrites a value the user
 * changed — but that decision is permanent and has no route back, because the
 * one state that would release it (empty) is one Open WebUI's admin form
 * refuses to save: the Searxng Query URL input is marked `required`. So a user
 * who edits the field once is locked out of the automatic address handling for
 * good, with a database edit as the only remedy.
 *
 * This is that remedy, as an action. It is never called implicitly — only when
 * the user explicitly asks for the address to be re-adopted, which is why it
 * can skip the ownership check the reconcile pass exists to honour.
 *
 * Deliberately does not touch `SEED`: those are one-time starting points the
 * user owns, and rewriting them here would silently reset their backend
 * choices.
 */
export async function reclaimManagedConfig(
  effects: T.Effects,
  ctx: ManagedContext,
): Promise<ConfigMap> {
  const values: ConfigMap = {}
  const claimed: Record<string, string> = {}
  for (const entry of RECONCILED) {
    const desired = entry.desired(ctx)
    if (desired === null) continue
    values[entry.key] = desired
    claimed[entry.key] = desired
  }

  await writeConfig(effects, values)
  if (Object.keys(claimed).length) {
    await storeJson.merge(effects, { managedConfig: claimed })
  }
  return values
}

/**
 * Re-assert the reconciled values against what is stored, and return the keys
 * that had to be rewritten. Call before starting the daemon: no other writer
 * is touching the database then, and a key with no row yet is created before
 * anything reads it.
 */
export async function reconcileManagedConfig(
  effects: T.Effects,
  ctx: ManagedContext,
): Promise<string[]> {
  const lastWritten =
    (await storeJson.read((s) => s.managedConfig).once()) ?? {}
  const current = await readConfig(
    effects,
    RECONCILED.flatMap((e) => [e.key, ...e.legacyKeys]),
  )

  const values: ConfigMap = {}
  const claimed: Record<string, string> = {}
  for (const entry of RECONCILED) {
    const desired = entry.desired(ctx)
    if (desired === null) continue
    const stored = storedValue(current, entry)
    if (stored === desired) {
      // Already correct — claim it anyway, so that when the address moves we
      // can tell our own value from one the user chose.
      if (lastWritten[entry.key] !== desired) claimed[entry.key] = desired
      continue
    }
    if (!isOurs(stored, lastWritten[entry.key])) continue
    values[entry.key] = desired
    claimed[entry.key] = desired
  }

  await writeConfig(effects, values)
  if (Object.keys(claimed).length) {
    await storeJson.merge(effects, { managedConfig: claimed })
  }
  return Object.keys(values)
}
