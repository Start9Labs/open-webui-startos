import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { daemonEnv, mainMounts, uiPort } from './utils'
import { resolveBaseUrls } from './backends'
import {
  reconcileManagedConfig,
  resolveManagedContext,
  SEARXNG_QUERY_URL_KEY,
  syncBackendState,
} from './managedConfig'
import { reconnectSearxng } from './actions/reconnectSearxng'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .const(effects)
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  // `.const()` on the dial addresses is what makes this reactive: a backend
  // install/uninstall/port-change heals with a single main restart, and a plain
  // dependency update (assigned port unchanged) never restarts.
  await syncBackendState(effects, await resolveBaseUrls(effects, 'const'))

  // Re-assert the config values whose correct setting can change under the
  // user. `.const()` on the dependency addresses is what makes this reactive:
  // installing SearXNG, or its assigned bridge port moving, re-runs main and
  // this repairs the stored value. Values the user has since changed are left
  // alone — see managedConfig.ts.
  const { rewritten, declined } = await reconcileManagedConfig(
    effects,
    await resolveManagedContext(effects, 'const'),
  )
  if (rewritten.length) {
    console.info(
      `${i18n('Updated Open WebUI configuration')}: ${rewritten.join(', ')}`,
    )
  }

  // StartOS drops a task with no `when` when its action runs, so the clear is
  // only for the other exits: SearXNG uninstalled, or the value put right by
  // hand.
  if (declined.includes(SEARXNG_QUERY_URL_KEY)) {
    await sdk.action.createOwnTask(effects, reconnectSearxng, 'important', {
      reason: i18n(
        'The web search address is one this server does not manage, so searches may not reach SearXNG. Reconnect SearXNG to restore it.',
      ),
    })
  } else {
    await sdk.action.clearTask(
      effects,
      `${sdk.manifest.id}:${reconnectSearxng.id}`,
    )
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'open-webui' },
      mainMounts,
      'open-webui-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      env: daemonEnv(WEBUI_SECRET_KEY),
    },
    ready: {
      display: i18n('Web Interface'),
      gracePeriod: 120000,
      // uvicorn binds the socket before the FastAPI app finishes lifespan startup; /health flips only when the app is actually serving.
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${uiPort}/health`,
          {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          },
        ),
    },
    requires: [],
  })
})
