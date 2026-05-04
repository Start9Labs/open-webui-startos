import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

const depOllamaDescription = {
  en_US: 'Can be used for hosting local LLMs',
  es_ES: 'Se puede usar para alojar LLMs locales',
  de_DE: 'Kann zum Hosten lokaler LLMs verwendet werden',
  pl_PL: 'Może być używany do hostowania lokalnych LLM',
  fr_FR: "Peut être utilisé pour héberger des LLM locaux",
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
      optional: false,
      description: depOllamaDescription,
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
        title: 'Ollama',
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
