import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { bridgeAddress, mainMounts, uiPort } from './utils'
import {
  ensurePublicMounted,
  KNOWN_OPENAI,
  publicCredentialsFile,
  resolveBaseUrls,
} from './backends'
import { adminExists, webuiConfig } from './webuiConfig'
import { uiPort as searxngUiPort } from 'searxng-startos/startos/utils'
import { mainHostId as searxngHostId } from 'searxng-startos/startos/interfaces'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .const(effects)
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  // Resolve each backend's dial address from its binding's live bridge address
  // via `.const()`: a backend install/uninstall/port-change heals with a single
  // main restart, and a plain dependency update (assigned port unchanged) never
  // restarts. Each entry is null while its backend is absent.
  const resolved = await resolveBaseUrls(effects, 'const')

  // SearXNG web-search endpoint over the bridge, same `.const()` healing. Null
  // when SearXNG isn't installed — SEARXNG_QUERY_URL is then omitted below and
  // web search stays unconfigured until SearXNG installs and main re-runs.
  const searxng = await bridgeAddress(effects, {
    packageId: 'searxng',
    hostId: searxngHostId,
    internalPort: searxngUiPort,
  }).const()

  // Keep public-credential backends' keys in sync with what the dependency
  // publishes. Read each key with `.once()` (a snapshot, not a subscription):
  // setupMain already re-reads on every start, so a rotated key is picked up on
  // the next restart without main subscribing to — and restarting on — every
  // key rotation. (vLLM is currently the only public-credential backend.)
  const view = await webuiConfig.read(effects, resolved).once()
  const urls = [...view.openaiBaseUrls]
  const keys = [...view.openaiApiKeys]
  let changed = false
  for (const b of KNOWN_OPENAI) {
    if (b.keySource !== 'public') continue
    if (!view.connectedIds.includes(b.id)) continue
    const bUrl = resolved[b.id]
    if (!bUrl) continue
    const idx = urls.indexOf(bUrl)
    if (idx < 0) continue
    let freshKey: string | null = null
    try {
      await ensurePublicMounted(effects, b.id)
      freshKey = await publicCredentialsFile(b.id)
        .read((c) => c.apiKey)
        .once()
    } catch {
      freshKey = null
    }
    if (!freshKey && b.keyRequired) {
      throw new Error(
        `${b.title} backend is enabled but its API key could not be read ` +
          `from ${b.id}:public/credentials.json. Make sure ${b.title} is ` +
          `installed, running, and at version ${b.versionRange} or newer.`,
      )
    }
    if (freshKey && keys[idx] !== freshKey) {
      keys[idx] = freshKey
      changed = true
    }
  }
  // Defense-in-depth for issue #15: never write the config table before an
  // admin exists. In practice `changed` can only be true once a backend has
  // been wired (which itself requires an admin), so the skip is effectively
  // unreachable — but it makes the invariant explicit and, unlike a throw,
  // can never block daemon startup or touch a pre-onboarding database.
  if (changed && (await adminExists(effects))) {
    await webuiConfig.merge(effects, {
      openai: { api_base_urls: urls, api_keys: keys },
    })
  }

  // Absent dependency, absent value: omit each dial env var when its bridge
  // address is null (backend not installed) rather than fabricating a dead
  // loopback address. The daemon falls back to its own default / web search
  // stays unconfigured, and the reactive `.const()` above heals with one
  // restart once the backend installs.
  const ollamaUrl = resolved['ollama']

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'open-webui' },
      mainMounts,
      'open-webui-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      // Open WebUI's PersistentConfig keys (ollama.*, openai.*, rag.web.*,
      // etc.) are seeded from these env vars on first launch and ignored
      // thereafter — webui.db is authoritative. The Configure Backends
      // action and Open WebUI's own admin UI both read/write that DB
      // directly, so the values stay in 2-way sync without env-var
      // overrides on every restart.
      env: {
        WEBUI_SECRET_KEY,
        CORS_ALLOW_ORIGIN: '*',
        ENABLE_VERSION_UPDATE_CHECK: 'false',
        ENABLE_COMMUNITY_SHARING: 'false',
        ENABLE_ADMIN_ANALYTICS: 'false',
        WEBUI_SESSION_COOKIE_SECURE: 'true',
        ...(ollamaUrl ? { OLLAMA_BASE_URL: ollamaUrl } : {}),
        // Opt-in: seed ollama disabled so it never auto-connects — or declares
        // a dependency — until the user enables it via Configure Backends, even
        // once ollama is installed. (Open WebUI defaults ENABLE_OLLAMA_API to
        // true, so this must be explicit.)
        ENABLE_OLLAMA_API: 'false',
        ENABLE_OPENAI_API: 'false',
        WEB_SEARCH_ENGINE: 'searxng',
        ...(searxng
          ? {
              SEARXNG_QUERY_URL: `http://${searxng}/search?q=<query>&format=json`,
            }
          : {}),
      },
    },
    ready: {
      display: i18n('Web Interface'),
      gracePeriod: 120000,
      // uvicorn binds the socket before the FastAPI app finishes lifespan startup; /health flips only when the app is actually serving.
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${uiPort}/health`,
          {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          },
        ),
    },
    requires: [],
  })
})
