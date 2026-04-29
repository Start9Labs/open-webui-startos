import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_8_12_2 = VersionInfo.of({
  version: '0.8.12:2',
  releaseNotes: {
    en_US:
      'Add support for OpenAI-compatible backends (vLLM, llama.cpp, OpenAI cloud, OpenRouter, etc.) alongside Ollama. Ollama is now an optional dependency and can be toggled off via the new "Configure Backends" action.',
    es_ES:
      'Se añade soporte para backends compatibles con OpenAI (vLLM, llama.cpp, OpenAI cloud, OpenRouter, etc.) junto con Ollama. Ollama ahora es una dependencia opcional y se puede desactivar mediante la nueva acción "Configurar backends".',
    de_DE:
      'Unterstützung für OpenAI-kompatible Backends (vLLM, llama.cpp, OpenAI Cloud, OpenRouter usw.) zusätzlich zu Ollama. Ollama ist jetzt eine optionale Abhängigkeit und kann über die neue Aktion „Backends konfigurieren" deaktiviert werden.',
    pl_PL:
      'Dodano obsługę backendów zgodnych z OpenAI (vLLM, llama.cpp, OpenAI cloud, OpenRouter itp.) obok Ollamy. Ollama jest teraz opcjonalną zależnością i można ją wyłączyć za pomocą nowej akcji „Konfiguruj backendy".',
    fr_FR:
      'Prise en charge des backends compatibles OpenAI (vLLM, llama.cpp, OpenAI cloud, OpenRouter, etc.) en plus d\'Ollama. Ollama est désormais une dépendance optionnelle et peut être désactivée via la nouvelle action « Configurer les backends ».',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
