import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { daemonEnv, mainMounts, uiPort } from './utils'
import {
  ensurePublicMounted,
  KNOWN_OPENAI,
  publicCredentialsFile,
  resolveBaseUrls,
} from './backends'
import { reconcileManagedConfig, resolveManagedContext } from './managedConfig'
import { adminExists, webuiConfig, writeConfig } from './webuiConfig'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Open WebUI!'))

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .const(effects)
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  // Resolve each backend's dial address from its binding's live bridge address
  // via `.const()`: a backend install/uninstall/port-change heals with a single
  // main restart, and a plain dependency update (assigned port unchanged) never
  // restarts. Each entry is null while its backend is absent.
  const resolved = await resolveBaseUrls(effects, 'const')

  // Keep public-credential backends' keys in sync with what the dependency
  // publishes. Read each key with `.once()` (a snapshot, not a subscription):
  // setupMain already re-reads on every start, so a rotated key is picked up on
  // the next restart without main subscribing to — and restarting on — every
  // key rotation. (vLLM is currently the only public-credential backend.)
  const view = await webuiConfig.read(effects, resolved).once()
  const urls = [...view.openaiBaseUrls]
  const keys = [...view.openaiApiKeys]
  let changed = false
  for (const b of KNOWN_OPENAI) {
    if (b.keySource !== 'public') continue
    if (!view.connectedIds.includes(b.id)) continue
    const bUrl = resolved[b.id]
    if (!bUrl) continue
    const idx = urls.indexOf(bUrl)
    if (idx < 0) continue
    let freshKey: string | null = null
    try {
      await ensurePublicMounted(effects, b.id)
      freshKey = await publicCredentialsFile(b.id)
        .read((c) => c.apiKey)
        .once()
    } catch {
      freshKey = null
    }
    if (!freshKey && b.keyRequired) {
      throw new Error(
        `${b.title} backend is enabled but its API key could not be read ` +
          `from ${b.id}:public/credentials.json. Make sure ${b.title} is ` +
          `installed, running, and at version ${b.versionRange} or newer.`,
      )
    }
    if (freshKey && keys[idx] !== freshKey) {
      keys[idx] = freshKey
      changed = true
    }
  }
  // Defense-in-depth for issue #15: never write the config table before an
  // admin exists. In practice `changed` can only be true once a backend has
  // been wired (which itself requires an admin), so the skip is effectively
  // unreachable — but it makes the invariant explicit and, unlike a throw,
  // can never block daemon startup.
  if (changed && (await adminExists(effects))) {
    await writeConfig(effects, {
      'openai.api_base_urls': urls,
      'openai.api_keys': keys,
    })
  }

  // Re-assert the config values whose correct setting can change under the
  // user. `.const()` on the dependency addresses is what makes this reactive:
  // installing SearXNG, or its assigned bridge port moving, re-runs main and
  // this repairs the stored value. Values the user has since changed are left
  // alone — see managedConfig.ts.
  const rewritten = await reconcileManagedConfig(
    effects,
    await resolveManagedContext(effects, 'const'),
  )
  if (rewritten.length) {
    console.info(
      `${i18n('Updated Open WebUI configuration')}: ${rewritten.join(', ')}`,
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
