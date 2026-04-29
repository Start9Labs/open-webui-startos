import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

const depOllamaDescription = {
  en_US: 'Optional: host local LLMs with Ollama. Toggle on/off via the Configure Backends action.',
  es_ES: 'Opcional: aloja LLMs locales con Ollama. Actívalo/desactívalo mediante la acción Configurar Backends.',
  de_DE: 'Optional: lokale LLMs mit Ollama hosten. Über die Aktion „Backends konfigurieren“ aktivieren/deaktivieren.',
  pl_PL: 'Opcjonalnie: hostuj lokalne LLM za pomocą Ollama. Włącz/wyłącz w akcji Konfiguruj backendy.',
  fr_FR: "Optionnel : hébergez des LLM locaux avec Ollama. Activez/désactivez via l'action Configurer les backends.",
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
        dockerTag: 'ghcr.io/open-webui/open-webui:0.8.12',
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
  },
})
