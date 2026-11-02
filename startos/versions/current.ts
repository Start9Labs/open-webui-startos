import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.5:1',
  releaseNotes: {
    en_US: `Fixes web search when SearXNG on this server has a password set: Open WebUI now signs in to SearXNG automatically. Update SearXNG first.`,
    es_ES: `Corrige la búsqueda web cuando SearXNG en este servidor tiene una contraseña: Open WebUI ahora inicia sesión en SearXNG automáticamente. Actualice SearXNG primero.`,
    de_DE: `Behebt die Websuche, wenn SearXNG auf diesem Server ein Passwort hat: Open WebUI meldet sich jetzt automatisch bei SearXNG an. Aktualisieren Sie zuerst SearXNG.`,
    pl_PL: `Naprawia wyszukiwanie w sieci, gdy SearXNG na tym serwerze ma ustawione hasło: Open WebUI loguje się teraz do SearXNG automatycznie. Najpierw zaktualizuj SearXNG.`,
    fr_FR: `Corrige la recherche web lorsque SearXNG sur ce serveur a un mot de passe : Open WebUI se connecte désormais automatiquement à SearXNG. Mettez d’abord SearXNG à jour.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
