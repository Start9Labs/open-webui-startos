import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.2:3',
  releaseNotes: {
    en_US:
      'Internal updates (start-sdk 2.0.x). AI backends and web search now connect over the local service bridge instead of internal DNS; if a previously connected backend shows as disconnected after updating, re-run Configure Backends.',
    es_ES:
      'Actualizaciones internas (start-sdk 2.0.x). Los backends de IA y la búsqueda web ahora se conectan a través del puente de servicios local en lugar del DNS interno; si un backend conectado anteriormente aparece como desconectado tras la actualización, vuelve a ejecutar Configurar Backends.',
    de_DE:
      'Interne Aktualisierungen (start-sdk 2.0.x). KI-Backends und die Websuche verbinden sich jetzt über die lokale Dienst-Bridge statt über internes DNS; falls ein zuvor verbundenes Backend nach dem Update als getrennt angezeigt wird, führen Sie „Backends konfigurieren“ erneut aus.',
    pl_PL:
      'Aktualizacje wewnętrzne (start-sdk 2.0.x). Backendy AI i wyszukiwanie w sieci łączą się teraz przez lokalny mostek usług zamiast wewnętrznego DNS; jeśli po aktualizacji wcześniej połączony backend jest wyświetlany jako rozłączony, uruchom ponownie Konfiguruj backendy.',
    fr_FR:
      'Mises à jour internes (start-sdk 2.0.x). Les backends IA et la recherche web se connectent désormais via le pont de services local au lieu du DNS interne ; si un backend précédemment connecté apparaît déconnecté après la mise à jour, relancez « Configurer les backends ».',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
