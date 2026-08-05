import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  WEBUI_SECRET_KEY: z.string(),
  /**
   * Last value this package wrote for each reconciled `webui.db` config key.
   * `managedConfig.ts` compares it against what is stored to tell a value it
   * still owns from one the user has changed since.
   */
  managedConfig: z.record(z.string(), z.string()).optional(),
  /**
   * Backend id → the base URL this package last wrote for it. Same ownership
   * test as `managedConfig`, but per array entry: it is what lets
   * `repointBackendUrls` tell our entry from a user-added provider when a
   * dependency's assigned bridge port moves.
   */
  managedBackendUrls: z.record(z.string(), z.string()).optional(),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: './store.json' },
  shape,
)
