import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import {
  ensureVllmPublicMounted,
  vllmCredentialsFile,
} from '../vllmCredentials'
import { OLLAMA_BASE_URL, VLLM_BASE_URL, webuiConfig } from '../webuiConfig'

const { InputSpec, Value, List } = sdk

const providerSpec = InputSpec.of({
  baseUrl: Value.text({
    name: i18n('Base URL'),
    description: i18n(
      'The OpenAI-compatible API base URL, e.g. http://vllm.startos:8000/v1 or https://api.openai.com/v1',
    ),
    required: true,
    default: null,
    placeholder: 'https://api.openai.com/v1',
    patterns: [
      {
        regex: '^https?://.+',
        description: 'Must be an http:// or https:// URL',
      },
    ],
  }),
  apiKey: Value.text({
    name: i18n('API Key'),
    description: i18n(
      'API key for this provider. Leave blank if the backend does not require authentication.',
    ),
    required: false,
    default: null,
    masked: true,
  }),
})

const inputSpec = InputSpec.of({
  enableOllama: Value.toggle({
    name: i18n('Enable Ollama Backend'),
    description: i18n(
      'Add Ollama as a dependency and connect Open WebUI to it.',
    ),
    default: true,
  }),
  enableVllm: Value.toggle({
    name: i18n('Enable vLLM Backend'),
    description: i18n(
      'Add vLLM as a dependency and connect Open WebUI to it.',
    ),
    default: false,
  }),
  customProviders: Value.list(
    List.obj(
      {
        name: i18n('OpenAI-Compatible Providers'),
        description: i18n(
          'Add any number of OpenAI-compatible API endpoints (vLLM, llama.cpp server, OpenAI cloud, OpenRouter, etc.). Each entry contributes one base URL and matching API key to Open WebUI.',
        ),
        default: [],
      },
      {
        spec: providerSpec,
        displayAs: '{{baseUrl}}',
        uniqueBy: 'baseUrl',
      },
    ),
  ),
})

export const configureBackends = sdk.Action.withInput(
  'configure-backends',

  {
    name: i18n('Configure Backends'),
    description: i18n(
      'Choose which LLM backends Open WebUI connects to: Ollama and/or any OpenAI-compatible providers (vLLM, OpenAI, etc.)',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  inputSpec,

  async ({ effects }) => {
    const view = await webuiConfig.read(effects).once()
    return {
      enableOllama: view.enableOllama,
      enableVllm: view.enableVllm,
      customProviders: view.customProviders.map((p) => ({
        baseUrl: p.baseUrl,
        apiKey: p.apiKey || null,
      })),
    }
  },

  async ({ effects, input }) => {
    let vllmApiKey: string | null = null
    if (input.enableVllm) {
      await ensureVllmPublicMounted(effects)
      const cred = await vllmCredentialsFile.read((c) => c.apiKey).once()
      if (!cred) {
        throw new Error(
          'vLLM is enabled but its API key could not be read from ' +
            'vllm:public/credentials.json. Make sure vllm is installed and ' +
            'running, and that it is at a version that publishes the public ' +
            'credentials volume (>= 0.16.0:0.1).',
        )
      }
      vllmApiKey = cred
    }

    // Compose the openai lists. The managed vllm slot is always first
    // (when enabled); the rest is whatever the user listed under custom
    // providers. Filter out duplicates of VLLM_BASE_URL so toggling vLLM
    // off via the toggle plus leaving it in the custom list doesn't
    // accidentally re-enable it.
    const baseUrls: string[] = []
    const apiKeys: string[] = []
    if (input.enableVllm) {
      baseUrls.push(VLLM_BASE_URL)
      apiKeys.push(vllmApiKey ?? '')
    }
    for (const p of input.customProviders) {
      if (p.baseUrl === VLLM_BASE_URL) continue
      baseUrls.push(p.baseUrl)
      apiKeys.push(p.apiKey ?? '')
    }

    await webuiConfig.merge(effects, {
      ollama: {
        enable: input.enableOllama,
        base_urls: input.enableOllama ? [OLLAMA_BASE_URL] : [],
      },
      openai: {
        enable: baseUrls.length > 0,
        api_base_urls: baseUrls,
        api_keys: apiKeys,
      },
    })

    await setDependencies(effects)
    await effects.restart()
  },
)
