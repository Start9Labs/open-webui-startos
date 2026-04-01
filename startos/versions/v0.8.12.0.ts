import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_8_12_0 = VersionInfo.of({
  version: '0.8.12:0',
  releaseNotes: {
    en_US: 'Update Open WebUI to 0.8.12',
    es_ES: 'Actualización de Open WebUI a 0.8.12',
    de_DE: 'Update von Open WebUI auf 0.8.12',
    pl_PL: 'Aktualizacja Open WebUI do 0.8.12',
    fr_FR: 'Mise à jour de Open WebUI vers 0.8.12',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
