import { T } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import {
  detectInstalled,
  KnownBackend,
  KNOWN_OPENAI,
  PLACEHOLDER_API_KEY,
  readPublicApiKey,
  resolveBaseUrls,
} from '../backends'
import { adminExists, webuiConfig } from '../webuiConfig'

const { InputSpec, Value, List } = sdk

const providerSpec = InputSpec.of({
  baseUrl: Value.text({
    name: i18n('Base URL'),
    description: i18n(
      'The OpenAI-compatible API base URL, e.g. https://api.openai.com/v1',
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

function labelFor(b: KnownBackend): string {
  const kind =
    b.protocol === 'ollama' ? i18n('local models') : i18n('OpenAI-compatible')
  return `${b.title} (${kind})`
}

const inputSpec = InputSpec.of({
  connectedServices: Value.dynamicMultiselect(async ({ effects, prefill }) => {
    const detected = await detectInstalled(effects)
    const values: Record<string, string> = {}
    for (const b of detected) values[b.id] = labelFor(b)
    const prior =
      (prefill as { connectedServices?: string[] } | null)?.connectedServices ??
      []
    return {
      name: i18n('Connect detected services'),
      description: i18n(
        'AI backends installed on this server that Open WebUI can connect to. Check the ones you want to use — their connection URL (and API key, where it can be read automatically) is filled in for you. Open the Web UI and create your admin account before running this.',
      ),
      values,
      // dynamicMultiselect requires every default to be a key in values.
      default: prior.filter((id) => id in values),
    }
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

/**
 * Resolve the API key to store for a selected OpenAI backend. For `public`
 * backends we read the key the dependency publishes (throwing for vLLM, which
 * requires it; falling back gracefully for llama.cpp). For `placeholder`
 * backends we keep any key the user already set, else seed a non-empty
 * placeholder (Open WebUI rejects an empty key field).
 */
async function resolveKey(
  effects: T.Effects,
  b: KnownBackend,
  currentKey: string,
): Promise<string> {
  if (b.keySource === 'public') {
    const key = await readPublicApiKey(effects, b.id)
    if (key) return key
    if (b.keyRequired) {
      throw new Error(
        `${b.title} is enabled but its API key could not be read from ` +
          `${b.id}:public/credentials.json. Make sure ${b.title} is installed, ` +
          `running, and at a version that publishes its public credentials ` +
          `(${b.versionRange}).`,
      )
    }
    return currentKey || PLACEHOLDER_API_KEY
  }
  if (b.keySource === 'placeholder') return currentKey || PLACEHOLDER_API_KEY
  return ''
}

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
    const resolved = await resolveBaseUrls(effects, 'once')
    const view = await webuiConfig.read(effects, resolved).once()
    return {
      connectedServices: view.connectedIds,
      customProviders: view.customProviders.map((p) => ({
        baseUrl: p.baseUrl,
        apiKey: p.apiKey || null,
      })),
    }
  },

  async ({ effects, input }) => {
    // Issue #15: refuse to write config until Open WebUI has initialized its
    // schema and a first admin exists. Writing the `config` table before then
    // corrupts onboarding. adminExists() is file-existence gated, so this also
    // never creates an empty webui.db.
    if (!(await adminExists(effects))) {
      throw new Error(
        i18n(
          "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before configuring backends.",
        ),
      )
    }

    const selected = new Set(input.connectedServices)
    // `.once()`: an action reads the current bridge addresses, it doesn't
    // subscribe. The selectable services are all installed (detectInstalled),
    // so each resolves to a live address; a backend uninstalled mid-action
    // resolves to null and is simply skipped below (no fabricated dial written).
    const resolved = await resolveBaseUrls(effects, 'once')
    const knownBaseUrls = new Set(
      Object.values(resolved).filter((u): u is string => u !== null),
    )
    const view = await webuiConfig.read(effects, resolved).once()
    const currentKeyFor = (b: KnownBackend): string => {
      const url = resolved[b.id]
      const idx = url ? view.openaiBaseUrls.indexOf(url) : -1
      return idx >= 0 ? (view.openaiApiKeys[idx] ?? '') : ''
    }

    const ollamaOn = selected.has('ollama')
    const ollamaUrl = resolved['ollama']

    // Build the openai lists: selected known OpenAI backends first (in registry
    // order, each with its resolved key), then the user's manual providers.
    // Skip any manual entry whose URL collides with a managed backend.
    const baseUrls: string[] = []
    const apiKeys: string[] = []
    for (const b of KNOWN_OPENAI) {
      if (!selected.has(b.id)) continue
      const url = resolved[b.id]
      if (!url) continue
      baseUrls.push(url)
      apiKeys.push(await resolveKey(effects, b, currentKeyFor(b)))
    }
    for (const p of input.customProviders) {
      if (knownBaseUrls.has(p.baseUrl)) continue
      baseUrls.push(p.baseUrl)
      apiKeys.push(p.apiKey ?? '')
    }

    await webuiConfig.merge(effects, {
      ollama: {
        enable: ollamaOn,
        base_urls: ollamaOn && ollamaUrl ? [ollamaUrl] : [],
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
