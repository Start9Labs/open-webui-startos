import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_8_10_0_b0 = VersionInfo.of({
  version: '0.8.10:0-beta.0',
  releaseNotes: {
    en_US:
      'Update Open WebUI from 0.8.8 to 0.8.10.\n\nv0.8.9: Open Terminal enhancements, Pyodide file system, significant performance improvements, nested folders, OpenTelemetry metrics, many bug fixes.\n\nv0.8.10: Custom OIDC logout, MariaDB Vector backend, task message truncation, Docker startup fix.',
    es_ES:
      'Actualización de Open WebUI de 0.8.8 a 0.8.10.\n\nv0.8.9: Mejoras del terminal abierto, sistema de archivos Pyodide, mejoras significativas de rendimiento, carpetas anidadas, métricas OpenTelemetry, muchas correcciones de errores.\n\nv0.8.10: Cierre de sesión OIDC personalizado, backend MariaDB Vector, truncamiento de mensajes de tareas, corrección de inicio de Docker.',
    de_DE:
      'Update von Open WebUI von 0.8.8 auf 0.8.10.\n\nv0.8.9: Open Terminal-Verbesserungen, Pyodide-Dateisystem, erhebliche Leistungsverbesserungen, verschachtelte Ordner, OpenTelemetry-Metriken, viele Fehlerbehebungen.\n\nv0.8.10: Benutzerdefiniertes OIDC-Logout, MariaDB Vector-Backend, Aufgabennachrichtenkürzung, Docker-Startkorrektur.',
    pl_PL:
      'Aktualizacja Open WebUI z 0.8.8 do 0.8.10.\n\nv0.8.9: Ulepszenia terminala, system plików Pyodide, znaczne poprawki wydajności, zagnieżdżone foldery, metryki OpenTelemetry, wiele poprawek błędów.\n\nv0.8.10: Niestandardowe wylogowanie OIDC, backend MariaDB Vector, skracanie wiadomości zadań, poprawka uruchamiania Dockera.',
    fr_FR:
      "Mise à jour d'Open WebUI de 0.8.8 à 0.8.10.\n\nv0.8.9 : Améliorations du terminal ouvert, système de fichiers Pyodide, améliorations significatives des performances, dossiers imbriqués, métriques OpenTelemetry, nombreuses corrections de bogues.\n\nv0.8.10 : Déconnexion OIDC personnalisée, backend MariaDB Vector, troncature des messages de tâches, correctif de démarrage Docker.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
