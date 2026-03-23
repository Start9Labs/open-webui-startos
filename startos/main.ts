import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainMounts, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .once()
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'open-webui' },
      mainMounts,
      'open-webui-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        OLLAMA_BASE_URL: 'http://ollama.startos:11434',
        WEBUI_SECRET_KEY,
        CORS_ALLOW_ORIGIN: '*',
        ENABLE_VERSION_UPDATE_CHECK: 'false',
        ENABLE_COMMUNITY_SHARING: 'false',
        ENABLE_ADMIN_ANALYTICS: 'false',
        WEBUI_SESSION_COOKIE_SECURE: 'true',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      gracePeriod: 120000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
