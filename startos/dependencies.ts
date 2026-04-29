import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const enableOllama = await storeJson
    .read((s) => s.enableOllama)
    .once()

  if (!enableOllama) {
    return {}
  }

  return {
    ollama: {
      kind: 'running',
      versionRange: '>=0.21.0:0',
      healthChecks: ['primary'],
    },
  }
})
