import { sdk } from './sdk'
import { KNOWN_BY_ID, resolveBaseUrls } from './backends'
import { webuiConfig } from './webuiConfig'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // Resolve backend bridge addresses reactively (`.const()`): a backend
  // install/uninstall/port-change re-runs setupDependencies so the declared
  // deps track what's actually wired in webui.db.
  const resolved = await resolveBaseUrls(effects, 'const')
  const view = await webuiConfig.read(effects, resolved).const()

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
