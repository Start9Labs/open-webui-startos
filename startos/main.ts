import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainMounts, uiPort } from './utils'
import {
  ensureVllmPublicMounted,
  vllmCredentialsFile,
} from './vllmCredentials'
import { OLLAMA_BASE_URL, VLLM_BASE_URL, webuiConfig } from './webuiConfig'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .const(effects)
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  // Reactively mirror vLLM's published API key into the slot we manage in
  // webui.db. .const(effects) registers this setupMain run as a dependent
  // of the credentials file — when vllm rotates the key, setupMain re-runs
  // and we patch the matching openai.api_keys index *before* the daemon
  // starts back up, so the daemon picks up the new key from its own DB.
  const view = await webuiConfig.read(effects).once()
  if (view.enableVllm) {
    await ensureVllmPublicMounted(effects)
    const apiKey = await vllmCredentialsFile
      .read((c) => c.apiKey)
      .const(effects)
    if (!apiKey) {
      throw new Error(
        'vLLM backend is enabled but its API key could not be read from ' +
          'vllm:public/credentials.json. Make sure vllm is installed and ' +
          'running, and that it is at a version that publishes the public ' +
          'credentials volume (>= 0.16.0:0.1).',
      )
    }
    if (view.vllmApiKey !== apiKey) {
      const baseUrls = [
        VLLM_BASE_URL,
        ...view.customProviders.map((p) => p.baseUrl),
      ]
      const apiKeys = [apiKey, ...view.customProviders.map((p) => p.apiKey)]
      await webuiConfig.merge(effects, {
        openai: { api_base_urls: baseUrls, api_keys: apiKeys },
      })
    }
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
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
        ENABLE_OLLAMA_API: 'true',
        ENABLE_OPENAI_API: 'false',
        WEB_SEARCH_ENGINE: 'searxng',
        SEARXNG_QUERY_URL:
          'http://searxng.startos:80/search?q=<query>&format=json',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      gracePeriod: 120000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
