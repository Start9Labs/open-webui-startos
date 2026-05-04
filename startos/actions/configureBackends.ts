import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value, List } = sdk

const providerSpec = InputSpec.of({
  name: Value.text({
    name: i18n('Display Name'),
    description: i18n(
      'A friendly name for this provider (shown in the Open WebUI model picker)',
    ),
    required: true,
    default: null,
    placeholder: 'vLLM',
  }),
  baseUrl: Value.text({
    name: i18n('Base URL'),
    description: i18n(
      'The OpenAI-compatible API base URL, e.g. http://vllm.startos:8000/v1 or https://api.openai.com/v1',
    ),
    required: true,
    default: null,
    placeholder: 'http://vllm.startos:8000/v1',
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
  openaiProviders: Value.list(
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
        displayAs: '{{name}}',
        uniqueBy: 'name',
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
    const store = await storeJson.read().once()
    return {
      enableOllama: store?.enableOllama ?? true,
      enableVllm: store?.enableVllm ?? false,
      openaiProviders: store?.openaiProviders ?? [],
    }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      enableOllama: input.enableOllama,
      enableVllm: input.enableVllm,
      openaiProviders: input.openaiProviders,
    })
  },
)
