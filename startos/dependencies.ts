import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  return {
    ollama: {
      kind: 'running',
      versionRange: '>=0.19.0:0',
      healthChecks: ['primary'],
    },
  }
})
