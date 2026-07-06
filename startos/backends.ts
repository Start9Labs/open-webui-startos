import * as fs from 'node:fs/promises'
import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { bridgeAddress } from './utils'
import {
  apiHostId as ollamaHostId,
  port as ollamaPort,
} from 'ollama-startos/startos/utils'
import {
  apiHostId as vllmHostId,
  apiPort as vllmPort,
} from 'vllm-startos/startos/utils'
import {
  apiHostId as llamaCppHostId,
  apiPort as llamaCppPort,
} from 'llama-cpp-startos/startos/utils'
import {
  apiHostId as mapleHostId,
  apiPort as maplePort,
} from 'maple-proxy-startos/startos/utils'

/**
 * Registry of the StartOS AI-backend packages Open WebUI knows how to wire up
 * automatically, plus the helpers that detect which are installed and read the
 * API keys they publish. This is the single source of truth for backend
 * connection details — the Configure Backends action, dependency wiring, and
 * setupMain's key re-sync all derive from it. Adding a new compatible service
 * is a one-line addition here.
 */

/**
 * Non-empty placeholder for backends that want a key populated but don't
 * enforce one (or whose real key we can't read yet). Open WebUI rejects an
 * empty key field, so we seed this and let the user override it.
 */
export const PLACEHOLDER_API_KEY = 'no-key-required'

/** `ollama` speaks Ollama's native API; `openai` speaks the OpenAI-compatible `/v1` API. */
export type Protocol = 'ollama' | 'openai'

/**
 * How to obtain an OpenAI backend's API key:
 *  - `none`        — Ollama; no key needed
 *  - `public`      — read it from `<pkg>:public/credentials.json`
 *  - `placeholder` — we can't read it; seed PLACEHOLDER_API_KEY, user overrides
 */
export type KeySource = 'none' | 'public' | 'placeholder'

export type KnownBackend = {
  /** StartOS package id (lowercase) */
  id: string
  /** Friendly label shown in the Configure Backends multiselect */
  title: string
  protocol: Protocol
  /** Dependency host id (its `sdk.MultiHost.of` group) carrying the dialed binding. */
  hostId: string
  /** Internal port of the dialed binding (its dep-exported port const). */
  internalPort: number
  /**
   * Suffix appended to the resolved `http://<bridge>:<port>` origin to form the
   * base URL Open WebUI dials — `''` for Ollama's native API, `/v1` for the
   * OpenAI-compatible backends.
   */
  pathSuffix: string
  /** Dependency version requirement */
  versionRange: string
  /** Health-check id on the dependency that must pass (its daemon id) */
  healthCheck: string
  keySource: KeySource
  /**
   * For `public` backends: throw if the key can't be read (`true`, e.g. vLLM),
   * or fall back to a placeholder (`false`, e.g. llama.cpp before it ships the
   * public-credentials release).
   */
  keyRequired: boolean
}

export const KNOWN_BACKENDS: KnownBackend[] = [
  {
    id: 'ollama',
    title: 'Ollama',
    protocol: 'ollama',
    hostId: ollamaHostId,
    internalPort: ollamaPort,
    pathSuffix: '',
    versionRange: '>=0.31.1:1',
    healthCheck: 'primary',
    keySource: 'none',
    keyRequired: false,
  },
  {
    id: 'vllm',
    title: 'vLLM',
    protocol: 'openai',
    hostId: vllmHostId,
    internalPort: vllmPort,
    pathSuffix: '/v1',
    versionRange: '>=0.23.1-rc.0:10',
    healthCheck: 'primary',
    keySource: 'public',
    keyRequired: true,
  },
  {
    id: 'llama-cpp',
    title: 'llama.cpp',
    protocol: 'openai',
    hostId: llamaCppHostId,
    internalPort: llamaCppPort,
    pathSuffix: '/v1',
    // Dependency minimum, enforced by setupDependencies (which reads this
    // versionRange). 1.0.9544:0 is llama.cpp's keyless release: it dropped its
    // API key and now authenticates the UI/API at the StartOS proxy, so we
    // connect keyless over the service bridge. Bump this whenever a llama.cpp
    // change breaks how we connect.
    versionRange: '>=1.0.9837:1',
    healthCheck: 'primary',
    keySource: 'placeholder',
    keyRequired: false,
  },
  {
    id: 'maple-proxy',
    title: 'Maple Proxy',
    protocol: 'openai',
    hostId: mapleHostId,
    internalPort: maplePort,
    pathSuffix: '/v1',
    versionRange: '>=0.1.8:2',
    healthCheck: 'maple-proxy',
    keySource: 'placeholder',
    keyRequired: false,
  },
]

export const KNOWN_BY_ID: Record<string, KnownBackend> = Object.fromEntries(
  KNOWN_BACKENDS.map((b) => [b.id, b]),
)

export const KNOWN_OPENAI = KNOWN_BACKENDS.filter(
  (b) => b.protocol === 'openai',
)

/** `id → base URL | null` (null when the backend isn't installed). */
export type ResolvedBaseUrls = Record<string, string | null>

/**
 * Resolve a known backend's base URL from its binding's live bridge address
 * (`http://10.0.3.1:<assigned external port><pathSuffix>`), or `null` when the
 * backend isn't installed. Use mode `'const'` in reactive contexts (main /
 * setupDependencies) so a backend install/uninstall/port-change heals with a
 * single restart; `'once'` inside an action.
 */
export async function resolveBaseUrl(
  effects: T.Effects,
  b: KnownBackend,
  mode: 'const' | 'once',
): Promise<string | null> {
  const addr = await bridgeAddress(effects, {
    packageId: b.id,
    hostId: b.hostId,
    internalPort: b.internalPort,
  })[mode]()
  return addr === null ? null : `http://${addr}${b.pathSuffix}`
}

/** Resolve every known backend's base URL into an `id → url | null` map. */
export async function resolveBaseUrls(
  effects: T.Effects,
  mode: 'const' | 'once',
): Promise<ResolvedBaseUrls> {
  const out: ResolvedBaseUrls = {}
  for (const b of KNOWN_BACKENDS) {
    out[b.id] = await resolveBaseUrl(effects, b, mode)
  }
  return out
}

/** The allowlisted backends currently installed on this StartOS instance. */
export async function detectInstalled(
  effects: T.Effects,
): Promise<KnownBackend[]> {
  const installed = new Set(await effects.getInstalledPackages())
  return KNOWN_BACKENDS.filter((b) => installed.has(b.id))
}

// --- Reading the API keys a dependency publishes on its `public` volume -----

const credentialsShape = z.object({ apiKey: z.string() })

/**
 * Stable host path where we bind-mount a dependency's `public` volume. Lives
 * under our own `startos` SDK volume so it persists with the package and
 * doesn't pollute the host filesystem.
 */
function publicMountPoint(packageId: string): string {
  return sdk.volumes.startos.subpath(`${packageId}-public`)
}

export function publicCredentialsFile(packageId: string) {
  return FileHelper.json(
    `${publicMountPoint(packageId)}/credentials.json`,
    credentialsShape,
  )
}

/**
 * Idempotently bind-mount `<packageId>:public` read-only so we can read the
 * credentials file it publishes. Safe to call on every run — if the mount is
 * already in place the underlying StartOS call is a no-op.
 */
export async function ensurePublicMounted(
  effects: T.Effects,
  packageId: string,
): Promise<void> {
  const mountPoint = publicMountPoint(packageId)
  await fs.mkdir(mountPoint, { recursive: true })
  await effects.mount({
    location: mountPoint,
    target: {
      packageId,
      volumeId: 'public',
      subpath: null,
      readonly: true,
      idmap: [],
    },
  })
}

/**
 * Read the API key a dependency publishes, or `null` if it isn't available
 * (package too old to publish one, not installed, file missing, etc.).
 */
export async function readPublicApiKey(
  effects: T.Effects,
  packageId: string,
): Promise<string | null> {
  try {
    await ensurePublicMounted(effects, packageId)
    return await publicCredentialsFile(packageId)
      .read((c) => c.apiKey)
      .once()
  } catch {
    return null
  }
}
