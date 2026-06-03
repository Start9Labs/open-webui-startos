import * as fs from 'node:fs/promises'
import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from './sdk'

/**
 * Registry of the StartOS AI-backend packages Open WebUI knows how to wire up
 * automatically, plus the helpers that detect which are installed and read the
 * API keys they publish. This is the single source of truth for backend
 * connection details — the Configure Backends action, dependency wiring, and
 * setupMain's key re-sync all derive from it. Adding a new compatible service
 * is a one-line addition here.
 */

export const OLLAMA_BASE_URL = 'http://ollama.startos:11434'
export const VLLM_BASE_URL = 'http://vllm.startos:8000/v1'
const LLAMA_CPP_BASE_URL = 'http://llama-cpp.startos:8080/v1'
const MAPLE_PROXY_BASE_URL = 'http://maple-proxy.startos:8080/v1'

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
  /** Internal `.startos` base URL (already includes `/v1` for OpenAI backends) */
  baseUrl: string
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
    baseUrl: OLLAMA_BASE_URL,
    versionRange: '>=0.21.0:0',
    healthCheck: 'primary',
    keySource: 'none',
    keyRequired: false,
  },
  {
    id: 'vllm',
    title: 'vLLM',
    protocol: 'openai',
    baseUrl: VLLM_BASE_URL,
    versionRange: '>=0.16.0:0.1',
    healthCheck: 'primary',
    keySource: 'public',
    keyRequired: true,
  },
  {
    id: 'llama-cpp',
    title: 'llama.cpp',
    protocol: 'openai',
    baseUrl: LLAMA_CPP_BASE_URL,
    // First release that publishes its API key on a public volume; older
    // versions are still selectable but fall back to a placeholder key.
    versionRange: '>=1.0.9468:1',
    healthCheck: 'primary',
    keySource: 'public',
    keyRequired: false,
  },
  {
    id: 'maple-proxy',
    title: 'Maple Proxy',
    protocol: 'openai',
    baseUrl: MAPLE_PROXY_BASE_URL,
    versionRange: '>=0.1.8:1',
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

export const KNOWN_BASE_URLS = new Set(KNOWN_BACKENDS.map((b) => b.baseUrl))

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
