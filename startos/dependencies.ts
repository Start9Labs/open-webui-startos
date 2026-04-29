import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const store = await storeJson.read().once()
  const enableOllama = store?.enableOllama ?? true
  const enableVllm = store?.enableVllm ?? false

  const deps: Record<
    string,
    { kind: 'running'; versionRange: string; healthChecks: string[] }
  > = {}

  if (enableOllama) {
    deps.ollama = {
      kind: 'running',
      versionRange: '>=0.21.0:0',
      healthChecks: ['primary'],
    }
  }

  if (enableVllm) {
    // 0.16.0:0.5-beta.0 (cpu/rocm) and #nvidia:0.20.0:0.5-beta.0 are the
    // first vllm releases that publish the API key on a `public` volume
    // for dependents to read. Earlier versions kept it private to the
    // main volume.
    deps.vllm = {
      kind: 'running',
      versionRange: '>=0.16.0:0.5-beta.0 || >=#nvidia:0.20.0:0.5-beta.0',
      healthChecks: ['primary'],
    }
  }

  return deps
})
