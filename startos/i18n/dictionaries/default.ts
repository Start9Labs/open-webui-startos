export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Open WebUI!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  'Web UI': 4,
  'The web interface of Open WebUI': 5,
  'Reset Admin Password': 6,
  'Reset the admin user password in case you forget it': 7,
  'Success': 8,
  'The new admin password is below': 9,
  'Configure Backends': 10,
  'Choose which LLM backends Open WebUI connects to: Ollama and/or any OpenAI-compatible providers (vLLM, OpenAI, etc.)': 11,
  'Enable Ollama Backend': 12,
  'When enabled, Ollama is declared as a running dependency and Open WebUI is wired to http://ollama.startos:11434.': 13,
  'OpenAI-Compatible Providers': 14,
  'Add any number of OpenAI-compatible API endpoints (vLLM, llama.cpp server, OpenAI cloud, OpenRouter, etc.). Each entry contributes one base URL and matching API key to Open WebUI.': 15,
  'Display Name': 16,
  'A friendly name for this provider (shown in the Open WebUI model picker)': 17,
  'Base URL': 18,
  'The OpenAI-compatible API base URL, e.g. http://vllm.startos:8000/v1 or https://api.openai.com/v1': 19,
  'API Key': 20,
  'API key for this provider. Use a placeholder like "none" if the backend does not require authentication.': 21,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
