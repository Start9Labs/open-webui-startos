import { sdk } from './sdk'

export const uiPort = 8080

export const mainMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'open-webui',
  subpath: null,
  mountpoint: '/app/backend/data',
  readonly: false,
})

/**
 * The same volume, mounted out of the way. `mainMounts` covers the image's own
 * `/app/backend/data`, which is where Open WebUI bakes its model cache —
 * seeding that onto the volume needs both copies visible at once.
 */
export const seedMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'open-webui',
  subpath: null,
  mountpoint: '/mnt/data',
  readonly: false,
})

export const webuiDb = '/app/backend/data/webui.db'

/**
 * Environment Open WebUI re-reads on every launch. PersistentConfig keys are
 * deliberately absent: since 0.10 the environment only seeds those on the very
 * first launch and is ignored from then on, so this package writes them to
 * `webui.db` instead (`managedConfig.ts`). Anything added here must be a value
 * Open WebUI reads from the environment on every start.
 */
export const daemonEnv = (WEBUI_SECRET_KEY: string) => ({
  WEBUI_SECRET_KEY,
  CORS_ALLOW_ORIGIN: '*',
  ENABLE_VERSION_UPDATE_CHECK: 'false',
  ENABLE_ADMIN_ANALYTICS: 'false',
  WEBUI_SESSION_COOKIE_SECURE: 'true',
})
