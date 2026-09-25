import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.4:1',
  releaseNotes: {
    en_US:
      'Fixed installs failing with "sh terminated with signal SIGKILL" on servers with slower disks.',
    es_ES:
      'Se corrigió un fallo de instalación con "sh terminated with signal SIGKILL" en servidores con discos más lentos.',
    de_DE:
      'Behoben: Installationen schlugen auf Servern mit langsameren Datenträgern mit „sh terminated with signal SIGKILL“ fehl.',
    pl_PL:
      'Naprawiono niepowodzenie instalacji z błędem „sh terminated with signal SIGKILL” na serwerach z wolniejszymi dyskami.',
    fr_FR:
      'Correction des installations qui échouaient avec « sh terminated with signal SIGKILL » sur les serveurs dotés de disques plus lents.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
