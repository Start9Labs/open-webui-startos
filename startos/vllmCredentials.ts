import * as fs from 'node:fs/promises'
import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from './sdk'

/**
 * Where on the host we bind-mount vllm-startos's `public` volume so that
 * we can reactively watch its `credentials.json`. Lives under our own
 * `startos` SDK volume so it persists with the package and we don't
 * pollute the host filesystem.
 */
const VLLM_PUBLIC_MOUNT = sdk.volumes.startos.subpath('vllm-public')
const CREDENTIALS_PATH = `${VLLM_PUBLIC_MOUNT}/credentials.json`

const credentialsShape = z.object({
  apiKey: z.string(),
})

/**
 * Reactive view of vllm-startos's published API key.
 *
 * vllm-startos writes `{ apiKey }` to its `public` volume's
 * `credentials.json` and keeps it in sync via a reactive init script
 * (see vllm's `init/syncCredentials.ts`). We bind-mount that volume
 * read-only at a stable host path and expose it as a FileHelper so
 * setupMain can `.const()` on the key — when vllm rotates it, our
 * setupMain re-runs and the daemon restarts with the new key.
 */
export const vllmCredentialsFile = FileHelper.json(
  CREDENTIALS_PATH,
  credentialsShape,
)

/**
 * Idempotently bind-mount vllm:public read-only at the host path that
 * `vllmCredentialsFile` reads from. Safe to call on every setupMain
 * run — if the mount is already in place, the underlying StartOS mount
 * call is a no-op.
 */
export async function ensureVllmPublicMounted(
  effects: T.Effects,
): Promise<void> {
  await fs.mkdir(VLLM_PUBLIC_MOUNT, { recursive: true })
  await effects.mount({
    location: VLLM_PUBLIC_MOUNT,
    target: {
      packageId: 'vllm',
      volumeId: 'public',
      subpath: null,
      readonly: true,
      idmap: [],
    },
  })
}
