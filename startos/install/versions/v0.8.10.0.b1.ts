import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_8_10_0_b1 = VersionInfo.of({
  version: '0.8.10:0-beta.1',
  releaseNotes: {
    en_US: 'Update Open WebUI to 0.8.10',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
