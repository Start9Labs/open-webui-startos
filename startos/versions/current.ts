import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.6:2',
  releaseNotes: {
    en_US:
      'llama.cpp is now a keyless backend: it authenticates its own UI/API at the StartOS proxy, and Open WebUI connects to it over the internal network without an API key. Requires llama.cpp 1.0.9544:0 or newer.',
    es_ES:
      'llama.cpp ahora es un backend sin clave: autentica su propia interfaz/API en el proxy de StartOS, y Open WebUI se conecta a él por la red interna sin clave de API. Requiere llama.cpp 1.0.9544:0 o posterior.',
    de_DE:
      'llama.cpp ist jetzt ein schlüsselloses Backend: Es authentifiziert seine eigene UI/API am StartOS-Proxy, und Open WebUI verbindet sich über das interne Netzwerk ohne API-Schlüssel damit. Erfordert llama.cpp 1.0.9544:0 oder neuer.',
    pl_PL:
      'llama.cpp jest teraz backendem bez klucza: uwierzytelnia własny interfejs/API na proxy StartOS, a Open WebUI łączy się z nim przez sieć wewnętrzną bez klucza API. Wymaga llama.cpp 1.0.9544:0 lub nowszego.',
    fr_FR:
      'llama.cpp est désormais un backend sans clé : il authentifie sa propre interface/API au niveau du proxy StartOS, et Open WebUI s’y connecte via le réseau interne sans clé d’API. Nécessite llama.cpp 1.0.9544:0 ou plus récent.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
