import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const store = await storeJson.read().const(effects)
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
    // 0.16.0:0.1 is the first vllm release that publishes the API key
    // on a `public` volume for dependents to read. Earlier versions
    // kept it private to the main volume.
    deps.vllm = {
      kind: 'running',
      versionRange: '>=0.16.0:0.1',
      healthChecks: ['primary'],
    }
  }

  return deps
})
