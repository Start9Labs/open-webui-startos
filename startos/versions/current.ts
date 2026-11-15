import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.3:1',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.2 or later. Configure Backends can now connect Strata, a local model server for NVIDIA GPUs. A backend whose API key hasn't been generated yet is now reported with a message naming its API Key action.",
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Configurar Backends ahora puede conectar Strata, un servidor de modelos locales para GPU NVIDIA. Un backend cuya clave API aún no se ha generado ahora se notifica con un mensaje que menciona su acción Clave de API.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. „Backends konfigurieren“ kann jetzt Strata verbinden, einen lokalen Modellserver für NVIDIA-GPUs. Ein Backend, dessen API-Schlüssel noch nicht erzeugt wurde, wird jetzt mit einem Hinweis auf seine Aktion „API-Schlüssel“ gemeldet.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Konfiguruj backendy może teraz połączyć Strata, lokalny serwer modeli dla kart NVIDIA. Backend, którego klucz API nie został jeszcze wygenerowany, jest teraz zgłaszany z komunikatem wskazującym jego akcję Klucz API.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Configurer les backends peut désormais connecter Strata, un serveur de modèles local pour GPU NVIDIA. Un backend dont la clé API n'a pas encore été générée est désormais signalé par un message indiquant son action Clé d’API.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
