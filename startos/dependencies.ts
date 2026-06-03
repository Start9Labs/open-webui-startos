import { sdk } from './sdk'
import { KNOWN_BY_ID } from './backends'
import { webuiConfig } from './webuiConfig'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const view = await webuiConfig.read(effects).const()

  const deps: Record<
    string,
    { kind: 'running'; versionRange: string; healthChecks: string[] }
  > = {}

  for (const id of view.connectedIds) {
    const b = KNOWN_BY_ID[id]
    if (!b) continue
    deps[b.id] = {
      kind: 'running',
      versionRange: b.versionRange,
      healthChecks: [b.healthCheck],
    }
  }

  return deps
})
