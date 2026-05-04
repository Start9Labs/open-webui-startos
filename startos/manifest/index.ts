import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

const depOllamaDescription = {
  en_US: 'Optional: host local LLMs with Ollama. Toggle on/off via the Configure Backends action.',
  es_ES: 'Opcional: aloja LLMs locales con Ollama. Actívalo/desactívalo mediante la acción Configurar Backends.',
  de_DE: 'Optional: lokale LLMs mit Ollama hosten. Über die Aktion „Backends konfigurieren“ aktivieren/deaktivieren.',
  pl_PL: 'Opcjonalnie: hostuj lokalne LLM za pomocą Ollama. Włącz/wyłącz w akcji Konfiguruj backendy.',
  fr_FR: "Optionnel : hébergez des LLM locaux avec Ollama. Activez/désactivez via l'action Configurer les backends.",
}

const depVllmDescription = {
  en_US: 'Optional: serve local LLMs through vLLM\'s OpenAI-compatible API. Toggle on/off via the Configure Backends action.',
  es_ES: 'Opcional: sirve LLMs locales a través de la API compatible con OpenAI de vLLM. Actívalo/desactívalo mediante la acción Configurar Backends.',
  de_DE: 'Optional: lokale LLMs über die OpenAI-kompatible API von vLLM bereitstellen. Über die Aktion „Backends konfigurieren“ aktivieren/deaktivieren.',
  pl_PL: 'Opcjonalnie: serwuj lokalne LLM przez API zgodne z OpenAI z vLLM. Włącz/wyłącz w akcji Konfiguruj backendy.',
  fr_FR: "Optionnel : servez des LLM locaux via l'API compatible OpenAI de vLLM. Activez/désactivez via l'action Configurer les backends.",
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

export const manifest = setupManifest({
  id: 'open-webui',
  title: 'Open WebUI',
  license: 'custom',
  packageRepo: 'https://github.com/Start9Labs/open-webui-startos',
  upstreamRepo: 'https://github.com/open-webui/open-webui/',
  marketingUrl: 'https://docs.openwebui.com/',
  donationUrl: null,
  docsUrls: ['https://docs.openwebui.com/'],
  description: i18n.description,
  volumes: ['open-webui', 'startos'],
  images: {
    'open-webui': {
      source: {
        dockerTag: 'ghcr.io/open-webui/open-webui:0.9.2',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    ollama: {
      optional: true,
      description: depOllamaDescription,
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
        title: 'Ollama',
      },
    },
    vllm: {
      optional: true,
      description: depVllmDescription,
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/vllm-startos/master/icon.svg',
        title: 'vLLM',
      },
    },
    searxng: {
      optional: true,
      description: depSearxngDescription,
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/searxng-startos/master/icon.svg',
        title: 'SearXNG',
      },
    },
  },
})
