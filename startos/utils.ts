import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
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

/** The caller must check `adminExists` before running account recovery. */
export async function runAdminAuthScript(
  effects: T.Effects,
  operation: string,
  input: Record<string, string> = {},
): Promise<string> {
  const secret = await storeJson.read((s) => s.WEBUI_SECRET_KEY).once()
  if (!secret) throw new Error('store.json WEBUI_SECRET_KEY not found')

  const script = `import asyncio, json, sqlite3, sys
from contextlib import redirect_stdout

inputs = json.loads(sys.stdin.read())
conn = sqlite3.connect(sys.argv[1])
try:
    cols = {r[1] for r in conn.execute('PRAGMA table_info(auth)')}
    if not {'mfa', 'session_stamp'}.issubset(cols):
        raise RuntimeError(inputs['schemaError'])
    row = conn.execute("SELECT id, email FROM user WHERE role = 'admin' ORDER BY created_at ASC, id ASC LIMIT 1").fetchone()
    if not row:
        raise RuntimeError('No admin user found')
    admin_id, admin_email = row
finally:
    conn.close()

async def recover():
${operation
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}

with redirect_stdout(sys.stderr):
    result = asyncio.run(recover())
sys.stdout.write(json.dumps(result))
`
  const out = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'open-webui' },
    mainMounts,
    'webui-admin-auth',
    (subc) =>
      subc.execFail(['python3', '-c', script, webuiDb], {
        env: { ...daemonEnv(secret), ENABLE_DB_MIGRATIONS: 'false' },
        input: JSON.stringify({
          ...input,
          schemaError: i18n(
            'Start Open WebUI once after updating before using account recovery.',
          ),
        }),
        timeout: 120_000,
      }),
  )
  const result: unknown = JSON.parse(out.stdout.toString())
  if (typeof result !== 'string') {
    throw new Error('Invalid account recovery result')
  }
  return result
}
