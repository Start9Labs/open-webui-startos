import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { KNOWN_BY_ID, resolveBaseUrls } from './backends'
import { webuiConfig } from './webuiConfig'

const depOllamaDescription = {
  en_US:
    'Optional: host local LLMs with Ollama. Connect it via the Configure Backends action.',
  es_ES:
    'Opcional: aloja LLMs locales con Ollama. Conéctalo mediante la acción Configurar Backends.',
  de_DE:
    'Optional: lokale LLMs mit Ollama hosten. Über die Aktion „Backends konfigurieren“ verbinden.',
  pl_PL:
    'Opcjonalnie: hostuj lokalne LLM za pomocą Ollama. Połącz w akcji Konfiguruj backendy.',
  fr_FR:
    "Optionnel : hébergez des LLM locaux avec Ollama. Connectez-le via l'action Configurer les backends.",
}

const depVllmDescription = {
  en_US:
    "Optional: serve local LLMs through vLLM's OpenAI-compatible API. Connect it via the Configure Backends action.",
  es_ES:
    'Opcional: sirve LLMs locales a través de la API compatible con OpenAI de vLLM. Conéctalo mediante la acción Configurar Backends.',
  de_DE:
    'Optional: lokale LLMs über die OpenAI-kompatible API von vLLM bereitstellen. Über die Aktion „Backends konfigurieren“ verbinden.',
  pl_PL:
    'Opcjonalnie: serwuj lokalne LLM przez API zgodne z OpenAI z vLLM. Połącz w akcji Konfiguruj backendy.',
  fr_FR:
    "Optionnel : servez des LLM locaux via l'API compatible OpenAI de vLLM. Connectez-le via l'action Configurer les backends.",
}

const depLlamaCppDescription = {
  en_US:
    "Optional: serve local GGUF models through llama.cpp's OpenAI-compatible API. Connect it via the Configure Backends action.",
  es_ES:
    'Opcional: sirve modelos GGUF locales a través de la API compatible con OpenAI de llama.cpp. Conéctalo mediante la acción Configurar Backends.',
  de_DE:
    'Optional: lokale GGUF-Modelle über die OpenAI-kompatible API von llama.cpp bereitstellen. Über die Aktion „Backends konfigurieren“ verbinden.',
  pl_PL:
    'Opcjonalnie: serwuj lokalne modele GGUF przez API zgodne z OpenAI z llama.cpp. Połącz w akcji Konfiguruj backendy.',
  fr_FR:
    "Optionnel : servez des modèles GGUF locaux via l'API compatible OpenAI de llama.cpp. Connectez-le via l'action Configurer les backends.",
}

const depMapleProxyDescription = {
  en_US:
    "Optional: connect to Maple's privacy-preserving, OpenAI-compatible inference through the Maple Proxy package. Connect it via the Configure Backends action.",
  es_ES:
    'Opcional: conéctate a la inferencia compatible con OpenAI y respetuosa con la privacidad de Maple a través del paquete Maple Proxy. Conéctalo mediante la acción Configurar Backends.',
  de_DE:
    'Optional: über das Maple-Proxy-Paket eine datenschutzfreundliche, OpenAI-kompatible Inferenz von Maple anbinden. Über die Aktion „Backends konfigurieren“ verbinden.',
  pl_PL:
    'Opcjonalnie: połącz się z chroniącą prywatność, zgodną z OpenAI inferencją Maple za pośrednictwem pakietu Maple Proxy. Połącz w akcji Konfiguruj backendy.',
  fr_FR:
    "Optionnel : connectez-vous à l'inférence compatible OpenAI et respectueuse de la vie privée de Maple via le paquet Maple Proxy. Connectez-le via l'action Configurer les backends.",
}

const depSearxngDescription = {
  en_US:
    'Privacy-respecting metasearch engine. Install to give Open WebUI a self-hosted web-search backend; enable web search in the Open WebUI admin panel after installing.',
  es_ES:
    'Motor de metabúsqueda respetuoso con la privacidad. Instálalo para proporcionar a Open WebUI un backend de búsqueda web autoalojado; habilita la búsqueda web en el panel de administración de Open WebUI tras instalarlo.',
  de_DE:
    'Datenschutzfreundliche Metasuchmaschine. Installieren, um Open WebUI ein selbst gehostetes Web-Such-Backend bereitzustellen; aktiviere die Websuche anschließend im Admin-Panel von Open WebUI.',
  pl_PL:
    'Wyszukiwarka meta szanująca prywatność. Zainstaluj, aby udostępnić Open WebUI samodzielnie hostowany backend wyszukiwania w sieci; włącz wyszukiwanie w panelu administracyjnym Open WebUI po instalacji.',
  fr_FR:
    "Métamoteur de recherche respectueux de la vie privée. Installez-le pour fournir à Open WebUI un backend de recherche web auto-hébergé ; activez la recherche web dans le panneau d'administration d'Open WebUI après l'installation.",
}

// Enabled while Open WebUI's own config points at the backend's bridge address.
const connected =
  (id: string) =>
  async ({ effects }: { effects: T.Effects }) =>
    (
      await webuiConfig
        .read(effects, await resolveBaseUrls(effects, 'const'))
        .const()
    ).connectedIds.includes(id)

const backend = <const Id extends string>(
  id: Id,
  description: T.LocaleString,
  icon: string,
) =>
  sdk.Dependency.optional(id, {
    description,
    metadata: { title: KNOWN_BY_ID[id].title, icon },
    versionRange: KNOWN_BY_ID[id].versionRange,
    kind: 'running',
    healthChecks: [KNOWN_BY_ID[id].healthCheck],
    enabled: connected(id),
  })

export const dependencies = sdk.Dependencies.of()
  .addDependency(
    backend(
      'ollama',
      depOllamaDescription,
      'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
    ),
  )
  .addDependency(
    backend(
      'vllm',
      depVllmDescription,
      'https://raw.githubusercontent.com/Start9Labs/vllm-startos/master/icon.svg',
    ),
  )
  .addDependency(
    backend(
      'llama-cpp',
      depLlamaCppDescription,
      'https://raw.githubusercontent.com/Start9Labs/llama-cpp-startos/master/icon.png',
    ),
  )
  .addDependency(
    backend(
      'maple-proxy',
      depMapleProxyDescription,
      'https://raw.githubusercontent.com/Start9-Community/maple-proxy-startos/master/icon.png',
    ),
  )
  .addDependency(
    sdk.Dependency.optional('searxng', {
      description: depSearxngDescription,
      metadata: {
        title: 'SearXNG',
        icon: 'https://raw.githubusercontent.com/Start9Labs/searxng-startos/master/icon.svg',
      },
      // First release serving the JSON search results Open WebUI queries.
      versionRange: '>=2026.5.2:1',
      kind: 'exists',
      enabled: async () => false,
    }),
  )
