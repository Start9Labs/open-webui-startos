import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_2_2 = VersionInfo.of({
  version: '0.9.2:2',
  releaseNotes: {
    en_US:
      'Add support for vLLM and other OpenAI-compatible backends (llama.cpp, OpenAI cloud, OpenRouter, etc.) alongside Ollama. Both Ollama and vLLM are now optional dependencies and can be toggled on/off via the new "Configure Backends" action.',
    es_ES:
      'Se añade soporte para vLLM y otros backends compatibles con OpenAI (llama.cpp, OpenAI cloud, OpenRouter, etc.) junto con Ollama. Ollama y vLLM son ahora dependencias opcionales y pueden activarse/desactivarse mediante la nueva acción "Configurar backends".',
    de_DE:
      'Unterstützung für vLLM und weitere OpenAI-kompatible Backends (llama.cpp, OpenAI Cloud, OpenRouter usw.) zusätzlich zu Ollama. Sowohl Ollama als auch vLLM sind jetzt optionale Abhängigkeiten und können über die neue Aktion „Backends konfigurieren" aktiviert oder deaktiviert werden.',
    pl_PL:
      'Dodano obsługę vLLM i innych backendów zgodnych z OpenAI (llama.cpp, OpenAI cloud, OpenRouter itp.) obok Ollamy. Zarówno Ollama, jak i vLLM są teraz opcjonalnymi zależnościami i można je włączać/wyłączać za pomocą nowej akcji „Konfiguruj backendy".',
    fr_FR:
      'Prise en charge de vLLM et d\'autres backends compatibles OpenAI (llama.cpp, OpenAI cloud, OpenRouter, etc.) en plus d\'Ollama. Ollama et vLLM sont désormais des dépendances optionnelles et peuvent être activées/désactivées via la nouvelle action « Configurer les backends ».',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
