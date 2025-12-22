import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  return {
    ollama: {
      kind: 'running',
      versionRange: '>=0.13.5:0-alpha.0',
      healthChecks: ['primary'],
    },
  }
})
