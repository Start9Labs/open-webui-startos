import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_2_1 = VersionInfo.of({
  version: '0.9.2:1',
  releaseNotes: {
    en_US:
      'Update to upstream Open WebUI 0.9.2 (adds desktop app support, scheduled chat automations, calendar workspace, async backend performance work, and database schema migrations). Pre-configure SearXNG as the default web-search backend; SearXNG is now listed as an optional dependency. Enable web search in the Open WebUI admin panel after installing SearXNG. Note: if you previously relied on the OpenAI catch-all proxy, you must now opt in to it via ENABLE_OPENAI_API_PASSTHROUGH (upstream change).',
    es_ES:
      'Actualización a Open WebUI 0.9.2 (añade compatibilidad con aplicación de escritorio, automatizaciones de chat programadas, espacio de calendario, mejoras asíncronas de rendimiento y migraciones de esquema de base de datos). Preconfigura SearXNG como backend predeterminado de búsqueda web; SearXNG figura ahora como dependencia opcional. Habilita la búsqueda web en el panel de administración de Open WebUI tras instalar SearXNG. Nota: si dependías del proxy OpenAI «catch-all», ahora debes activarlo explícitamente mediante ENABLE_OPENAI_API_PASSTHROUGH (cambio en upstream).',
    de_DE:
      'Aktualisierung auf Open WebUI 0.9.2 (Desktop-App-Unterstützung, geplante Chat-Automatisierungen, Kalender-Workspace, asynchrone Backend-Optimierungen und Datenbank-Schema-Migrationen). SearXNG ist nun als Standard-Backend für die Websuche vorkonfiguriert und als optionale Abhängigkeit gelistet. Aktiviere die Websuche nach der Installation von SearXNG im Open-WebUI-Admin-Panel. Hinweis: Wer den OpenAI-Catch-all-Proxy genutzt hat, muss ihn jetzt mit ENABLE_OPENAI_API_PASSTHROUGH explizit aktivieren (Upstream-Änderung).',
    pl_PL:
      'Aktualizacja do Open WebUI 0.9.2 (obsługa aplikacji desktopowej, zaplanowane automatyzacje czatu, przestrzeń kalendarza, asynchroniczne usprawnienia backendu oraz migracje schematu bazy danych). Wstępne skonfigurowanie SearXNG jako domyślnego zaplecza wyszukiwania internetowego; SearXNG jest teraz zależnością opcjonalną. Po zainstalowaniu SearXNG włącz wyszukiwanie w panelu administracyjnym Open WebUI. Uwaga: jeśli korzystałeś z uniwersalnego proxy OpenAI, musisz go teraz włączyć ręcznie zmienną ENABLE_OPENAI_API_PASSTHROUGH (zmiana w upstream).',
    fr_FR:
      "Mise à jour vers Open WebUI 0.9.2 (prise en charge de l'application bureau, automatisations de chat planifiées, espace calendrier, optimisations asynchrones du backend et migrations de schéma de base de données). Pré-configuration de SearXNG comme backend de recherche web par défaut ; SearXNG est désormais listé comme dépendance optionnelle. Activez la recherche web dans le panneau d'administration d'Open WebUI après l'installation de SearXNG. Note : si vous utilisiez le proxy OpenAI catch-all, vous devez désormais l'activer explicitement via ENABLE_OPENAI_API_PASSTHROUGH (changement amont).",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
