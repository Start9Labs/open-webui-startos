import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.4:0',
  releaseNotes: {
    en_US:
      'Updated Open WebUI to 0.11.4, a patch release with reliability and security fixes. Full notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.4',
    es_ES:
      'Open WebUI se actualizó a 0.11.4, una versión de parche con correcciones de fiabilidad y seguridad. Notas completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.4',
    de_DE:
      'Open WebUI wurde auf 0.11.4 aktualisiert, eine Patch-Version mit Zuverlässigkeits- und Sicherheitskorrekturen. Vollständige Hinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.4',
    pl_PL:
      'Zaktualizowano Open WebUI do wersji 0.11.4, wydania poprawkowego z poprawkami niezawodności i bezpieczeństwa. Pełne informacje: https://github.com/open-webui/open-webui/releases/tag/v0.11.4',
    fr_FR:
      'Open WebUI a été mis à jour vers la version 0.11.4, une version corrective comprenant des correctifs de fiabilité et de sécurité. Notes complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
