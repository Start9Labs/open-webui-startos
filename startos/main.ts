import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainMounts, uiPort } from './utils'
import { ensureVllmPublicMounted, vllmCredentialsFile } from './vllmCredentials'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const store = await storeJson.read().const(effects)

  const WEBUI_SECRET_KEY = store?.WEBUI_SECRET_KEY
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  const enableOllama = store?.enableOllama ?? true
  const enableVllm = store?.enableVllm ?? false
  const customProviders = store?.openaiProviders ?? []

  // vLLM is exposed as an additional OpenAI-compatible provider when
  // enabled. The /v1 suffix is required by vLLM's OpenAI-compatible
  // router. The API key is read reactively from vllm's `public` volume
  // (credentials.json) which it publishes for dependent services —
  // .const(effects) registers the apiKey as a dependency of setupMain,
  // so a vllm-side rotation triggers a daemon restart with the new key.
  let vllmProvider: { name: string; baseUrl: string; apiKey: string }[] = []
  if (enableVllm) {
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
    vllmProvider = [
      {
        name: 'vLLM',
        baseUrl: 'http://vllm.startos:8000/v1',
        apiKey,
      },
    ]
  }

  const openaiProviders = [...vllmProvider, ...customProviders]
  const enableOpenAi = openaiProviders.length > 0

  const env: Record<string, string> = {
    WEBUI_SECRET_KEY,
    CORS_ALLOW_ORIGIN: '*',
    ENABLE_VERSION_UPDATE_CHECK: 'false',
    ENABLE_COMMUNITY_SHARING: 'false',
    ENABLE_ADMIN_ANALYTICS: 'false',
    WEBUI_SESSION_COOKIE_SECURE: 'true',
    // The Configure Backends action is the source of truth for backend
    // wiring (Ollama URL, OpenAI-compatible providers, enable flags).
    // Open WebUI's PersistentConfig otherwise loads these from its own
    // DB after first launch and silently ignores env changes — toggling
    // a backend here would never reach the dashboard.
    ENABLE_PERSISTENT_CONFIG: 'false',
    ENABLE_OLLAMA_API: enableOllama ? 'true' : 'false',
    ENABLE_OPENAI_API: enableOpenAi ? 'true' : 'false',
    WEB_SEARCH_ENGINE: 'searxng',
    SEARXNG_QUERY_URL:
      'http://searxng.startos:80/search?q=<query>&format=json',
  }

  if (enableOllama) {
    env.OLLAMA_BASE_URL = 'http://ollama.startos:11434'
  }

  if (enableOpenAi) {
    // Open WebUI accepts semicolon-separated lists of base URLs and matching
    // API keys. The Nth URL is paired with the Nth key.
    env.OPENAI_API_BASE_URLS = openaiProviders
      .map((p) => p.baseUrl)
      .join(';')
    // null/empty apiKey is sent as an empty entry; Open WebUI tolerates
    // unauthenticated providers when the matching key slot is blank.
    env.OPENAI_API_KEYS = openaiProviders
      .map((p) => p.apiKey ?? '')
      .join(';')
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
      env,
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
