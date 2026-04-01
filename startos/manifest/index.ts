import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

const depOllamaDescription = {
  en_US: 'Can be used for hosting local LLMs',
  es_ES: 'Se puede usar para alojar LLMs locales',
  de_DE: 'Kann zum Hosten lokaler LLMs verwendet werden',
  pl_PL: 'Może być używany do hostowania lokalnych LLM',
  fr_FR: "Peut être utilisé pour héberger des LLM locaux",
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
      optional: false,
      description: depOllamaDescription,
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
        title: 'Ollama',
      },
    },
  },
})
