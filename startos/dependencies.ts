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
    deps.vllm = {
      kind: 'running',
      versionRange: '*',
      healthChecks: ['primary'],
    }
  }

  return deps
})
