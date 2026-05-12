import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_2_3 = VersionInfo.of({
  version: '0.9.2:3',
  releaseNotes: {
    en_US: `**Fixes**

- Health check no longer flips green before the web interface is actually serving requests.`,
    es_ES: `**Correcciones**

- El indicador de salud ya no se vuelve verde antes de que la interfaz web esté realmente atendiendo solicitudes.`,
    de_DE: `**Fehlerbehebungen**

- Der Health-Check wird nicht mehr grün, bevor die Weboberfläche tatsächlich Anfragen beantwortet.`,
    pl_PL: `**Poprawki**

- Wskaźnik kondycji nie zmienia już koloru na zielony, zanim interfejs webowy faktycznie zacznie obsługiwać żądania.`,
    fr_FR: `**Correctifs**

- Le contrôle de santé ne passe plus au vert avant que l'interface web ne traite réellement les requêtes.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
