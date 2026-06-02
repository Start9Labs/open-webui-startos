import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_6_0 = VersionInfo.of({
  version: '0.9.6:0',
  releaseNotes: {
    en_US:
      'Open WebUI → 0.9.6 (knowledge base directory sync, nested folders and filesystem tools, plus a large batch of security and access-control fixes and performance improvements).',
    es_ES:
      'Open WebUI → 0.9.6 (sincronización de directorios para bases de conocimiento, carpetas anidadas y herramientas de sistema de archivos, además de un amplio conjunto de correcciones de seguridad y control de acceso y mejoras de rendimiento).',
    de_DE:
      'Open WebUI → 0.9.6 (Verzeichnis-Synchronisierung für Wissensdatenbanken, verschachtelte Ordner und Dateisystem-Tools sowie zahlreiche Sicherheits- und Zugriffskontroll-Fixes und Performance-Verbesserungen).',
    pl_PL:
      'Open WebUI → 0.9.6 (synchronizacja katalogów dla baz wiedzy, zagnieżdżone foldery i narzędzia systemu plików oraz obszerny zestaw poprawek bezpieczeństwa i kontroli dostępu i usprawnień wydajności).',
    fr_FR:
      'Open WebUI → 0.9.6 (synchronisation de répertoires pour les bases de connaissances, dossiers imbriqués et outils de système de fichiers, ainsi qu’un large ensemble de correctifs de sécurité et de contrôle d’accès et d’améliorations des performances).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
