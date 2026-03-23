import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  return {
    ollama: {
      kind: 'running',
      versionRange: '>=0.18.2:0-beta.2',
      healthChecks: ['primary'],
    },
  }
})
