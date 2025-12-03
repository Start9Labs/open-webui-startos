import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

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
  description: {
    short: 'Self-hosted AI platform designed to operate entirely offline',
    long: 'Open WebUI is an extensible, feature-rich, and user-friendly self-hosted AI platform designed to operate entirely offline. It supports various LLM runners like Ollama and OpenAI-compatible APIs, with built-in inference engine for RAG, making it a powerful AI deployment solution.',
  },
  volumes: ['main'],
  images: {
    'open-webui': {
      source: { dockerTag: 'ghcr.io/open-webui/open-webui:0.6.41' },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
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
