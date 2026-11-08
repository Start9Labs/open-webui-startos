import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.0:2',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.1 or later. New Memory Settings action: turn on background memory review, set how often it runs, and set how much memory goes into each chat.',
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Nueva acción Ajustes de memoria: activa la revisión de memoria en segundo plano, elige cada cuánto se ejecuta y cuánta memoria entra en cada chat.',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Neue Aktion Gedächtnis-Einstellungen: Gedächtnisprüfung im Hintergrund einschalten, festlegen, wie oft sie läuft und wie viel Erinnerung in jeden Chat einfließt.',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Nowa akcja Ustawienia pamięci: włącz przegląd pamięci w tle, ustaw, jak często ma działać i ile pamięci trafia do każdego czatu.',
    fr_FR:
      'Nécessite StartOS 0.4.1 ou une version ultérieure. Nouvelle action Paramètres de mémoire : activez la révision de la mémoire en arrière-plan, choisissez sa fréquence et la quantité de mémoire ajoutée à chaque chat.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
