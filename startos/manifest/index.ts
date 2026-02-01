import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'open-webui',
  title: 'Open WebUI',
  license: 'custom',
  wrapperRepo: 'https://github.com/Start9Labs/open-webui-startos/',
  upstreamRepo: 'https://github.com/open-webui/open-webui/',
  supportSite: 'https://docs.openwebui.com/',
  marketingSite: 'https://docs.openwebui.com/',
  donationUrl: null,
  docsUrl: 'https://docs.openwebui.com/',
  description: i18n.description,
  volumes: ['main'],
  images: {
    'open-webui': {
      source: {
        dockerTag: 'ghcr.io/open-webui/open-webui:0.7.2',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    ollama: {
      optional: false,
      description: 'Can be used for hosting local LLMs',
      metadata: {
        icon: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ollama-icon.png',
        title: 'Ollama',
      },
    },
  },
})
