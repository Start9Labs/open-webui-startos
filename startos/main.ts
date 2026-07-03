import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainMounts, uiPort } from './utils'
import {
  ensurePublicMounted,
  KNOWN_OPENAI,
  OLLAMA_BASE_URL,
  publicCredentialsFile,
} from './backends'
import { adminExists, webuiConfig } from './webuiConfig'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .const(effects)
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  // Reactively keep public-credential backends' keys fresh. .const(effects)
  // registers this setupMain run as a dependent of each connected backend's
  // published credentials file — when one (e.g. vLLM) rotates its key,
  // setupMain re-runs and we patch the matching openai.api_keys slot in place
  // *before* the daemon starts back up, so it picks up the new key from its
  // own DB. (vLLM is currently the only public-credential backend.)
  const view = await webuiConfig.read(effects).once()
  const urls = [...view.openaiBaseUrls]
  const keys = [...view.openaiApiKeys]
  let changed = false
  for (const b of KNOWN_OPENAI) {
    if (b.keySource !== 'public') continue
    if (!view.connectedIds.includes(b.id)) continue
    const idx = urls.indexOf(b.baseUrl)
    if (idx < 0) continue
    let freshKey: string | null = null
    try {
      await ensurePublicMounted(effects, b.id)
      freshKey = await publicCredentialsFile(b.id)
        .read((c) => c.apiKey)
        .const(effects)
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
        OLLAMA_BASE_URL,
        // Optional backend: disabled on first launch so a fresh install never
        // declares ollama a required (running) dependency when it isn't even
        // installed. Users opt in via the Configure Backends action, which
        // enables it and wires base_urls to the resolved address. (Open WebUI
        // itself defaults ENABLE_OLLAMA_API to true, so this must be explicit.)
        ENABLE_OLLAMA_API: 'false',
        ENABLE_OPENAI_API: 'false',
        WEB_SEARCH_ENGINE: 'searxng',
        SEARXNG_QUERY_URL:
          'http://searxng.startos:80/search?q=<query>&format=json',
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
