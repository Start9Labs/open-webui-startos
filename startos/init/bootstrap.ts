import { T } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { resolveManagedContext, seedManagedConfig } from '../managedConfig'
import { sdk } from '../sdk'
import { daemonEnv, mainMounts, seedMounts, uiPort } from '../utils'

/**
 * Generous: this boot runs Alembic against an empty database and loads the
 * embedding model, and a slow disk on first install is not a failure. Reaching
 * it fails init, which rolls the install back — the right outcome, since
 * everything downstream assumes this boot happened.
 */
const BOOTSTRAP_TIMEOUT = 600_000

export const bootstrap = sdk.setupOnInit(async (effects, kind, progress) => {
  if (kind === null) return

  await seedModelCache(effects)

  if (kind !== 'install') return

  // Open WebUI's first launch is the only thing that creates webui.db and its
  // schema — Alembic runs at import, and the config table is seeded from the
  // environment right after. Doing that here, once, is what lets every later
  // config write assume the table exists, so neither setupMain nor the
  // Configure Backends action carries any first-run branching.
  const phase = progress.addPhase(i18n('Preparing Open WebUI'))
  phase.start()

  const WEBUI_SECRET_KEY = await storeJson
    .read((s) => s.WEBUI_SECRET_KEY)
    .once()
  if (!WEBUI_SECRET_KEY) {
    throw new Error('store.json WEBUI_SECRET_KEY not found')
  }

  await sdk.Daemons.of(effects)
    .addDaemon('bootstrap', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'open-webui' },
        mainMounts,
        'open-webui-bootstrap',
      ),
      exec: {
        command: sdk.useEntrypoint(),
        env: daemonEnv(WEBUI_SECRET_KEY),
      },
      ready: {
        display: null,
        // uvicorn binds the socket before the FastAPI app finishes lifespan
        // startup; /health flips only when the app is actually serving, which
        // is also when the schema and the config rows are in place.
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
    .runUntilSuccess(BOOTSTRAP_TIMEOUT)

  phase.complete()

  await seedManagedConfig(effects, await resolveManagedContext(effects, 'once'))
})

/**
 * Copy the 265 MB model cache the image bakes into `/app/backend/data/cache`
 * (embedding models, Whisper, tiktoken vocabularies) onto the volume that
 * covers that path at runtime. `cache` is the only thing in `/app/backend/data`
 * in the image, so `mainMounts` hides all of it and every one of those models
 * is otherwise re-fetched from HuggingFace on demand.
 *
 * It does not remove the HuggingFace dependency outright: `sentence_transformers`
 * resolves the embedding repo's `main` revision and pulls a 30-file snapshot,
 * more formats than the image bakes, which the bootstrap boot below then
 * completes. What this buys is Whisper and tiktoken — loaded lazily on first
 * use, so never covered by that boot — plus the blobs the snapshot fetch can
 * then skip.
 *
 * `cp -n` never overwrites, so a model the user has since downloaded is left
 * alone and re-running this on later updates is a no-op.
 */
async function seedModelCache(effects: T.Effects): Promise<void> {
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    seedMounts,
    'webui-model-seed',
    (subc) =>
      subc.execFail([
        'sh',
        '-c',
        'set -e; [ -d /app/backend/data/cache ] || exit 0; ' +
          'mkdir -p /mnt/data/cache; cp -an /app/backend/data/cache/. /mnt/data/cache/',
      ]),
  )
}
