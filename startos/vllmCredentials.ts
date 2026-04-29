import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

/**
 * Minimal manifest type for vllm-startos. We don't import the upstream
 * package as a dependency just for types — only the fields needed by
 * `mountDependency` (`id` + `volumes`) need to line up.
 */
type VllmManifest = T.SDKManifest & {
  id: 'vllm'
  volumes: 'public'[]
}

/**
 * Read the API key vllm-startos publishes on its `public` volume in
 * `credentials.json`. Returns null if the file is missing or malformed
 * (e.g. dependency not yet running, or running an old vllm version that
 * predates the public-credentials pattern).
 */
export async function readVllmApiKey(
  effects: T.Effects,
): Promise<string | null> {
  const mounts = sdk.Mounts.of().mountDependency<VllmManifest>({
    dependencyId: 'vllm',
    volumeId: 'public',
    subpath: null,
    mountpoint: '/vllm-public',
    readonly: true,
  })

  try {
    return await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'open-webui' },
      mounts,
      'read-vllm-creds',
      async (sub) => {
        const { stdout } = await sub.execFail([
          'cat',
          '/vllm-public/credentials.json',
        ])
        const text =
          typeof stdout === 'string' ? stdout : stdout.toString('utf8')
        const parsed = JSON.parse(text)
        return typeof parsed?.apiKey === 'string' ? parsed.apiKey : null
      },
    )
  } catch (e) {
    console.warn(
      `[open-webui] could not read vllm credentials.json: ${
        e instanceof Error ? e.message : String(e)
      }`,
    )
    return null
  }
}
