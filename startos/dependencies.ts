import { sdk } from './sdk'
import { webuiConfig } from './webuiConfig'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const view = await webuiConfig.read(effects).const()

  const deps: Record<
    string,
    { kind: 'running'; versionRange: string; healthChecks: string[] }
  > = {}

  if (view.enableOllama) {
    deps.ollama = {
      kind: 'running',
      versionRange: '>=0.21.0:0',
      healthChecks: ['primary'],
    }
  }

  if (view.enableVllm) {
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
