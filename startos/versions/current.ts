import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.6:1',
  releaseNotes: {
    en_US:
      'Configure Backends now auto-detects the compatible StartOS AI services you have installed — Ollama, vLLM, llama.cpp, and Maple Proxy — and connects them in one step, reading their published API keys automatically. The action also refuses to run until you have created your admin account, fixing a database-corruption issue when it was run too early.',
    es_ES:
      'Configurar Backends ahora detecta automáticamente los servicios de IA de StartOS compatibles que tienes instalados —Ollama, vLLM, llama.cpp y Maple Proxy— y los conecta en un solo paso, leyendo automáticamente sus claves de API publicadas. La acción además se niega a ejecutarse hasta que hayas creado tu cuenta de administrador, corrigiendo un problema de corrupción de la base de datos cuando se ejecutaba demasiado pronto.',
    de_DE:
      'Backends konfigurieren erkennt jetzt automatisch die installierten kompatiblen StartOS-KI-Dienste – Ollama, vLLM, llama.cpp und Maple Proxy – und verbindet sie in einem Schritt, wobei die veröffentlichten API-Schlüssel automatisch gelesen werden. Die Aktion wird zudem erst ausgeführt, nachdem du dein Admin-Konto erstellt hast, was einen Datenbankbeschädigungsfehler bei zu frühem Ausführen behebt.',
    pl_PL:
      'Konfiguruj backendy teraz automatycznie wykrywa zainstalowane, zgodne usługi AI StartOS — Ollama, vLLM, llama.cpp i Maple Proxy — i łączy je w jednym kroku, automatycznie odczytując ich opublikowane klucze API. Akcja odmawia też uruchomienia, dopóki nie utworzysz konta administratora, co naprawia problem uszkodzenia bazy danych przy zbyt wczesnym uruchomieniu.',
    fr_FR:
      'Configurer les backends détecte désormais automatiquement les services d’IA StartOS compatibles que vous avez installés — Ollama, vLLM, llama.cpp et Maple Proxy — et les connecte en une seule étape, en lisant automatiquement leurs clés d’API publiées. L’action refuse également de s’exécuter tant que vous n’avez pas créé votre compte administrateur, corrigeant un problème de corruption de la base de données lorsqu’elle était exécutée trop tôt.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
