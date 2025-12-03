import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  return {
    ollama: {
      kind: 'running',
      versionRange: '>=0.13.1:0-alpha.1',
      healthChecks: ['primary'],
    },
  }
})
