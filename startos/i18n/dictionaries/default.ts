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
  Success: 8,
  'The new admin password is below': 9,
  'Configure Backends': 10,
  'Choose which LLM backends Open WebUI connects to: Ollama and/or any OpenAI-compatible providers (vLLM, OpenAI, etc.)': 11,
  'OpenAI-Compatible Providers': 14,
  'Add any number of OpenAI-compatible API endpoints (vLLM, llama.cpp server, OpenAI cloud, OpenRouter, etc.). Each entry contributes one base URL and matching API key to Open WebUI.': 15,
  'Base URL': 18,
  'The OpenAI-compatible API base URL, e.g. https://api.openai.com/v1': 19,
  'API Key': 20,
  'API key for this provider. Leave blank if the backend does not require authentication.': 21,
  'Connect detected services': 24,
  "AI backends installed on this server. Checking one connects Open WebUI to it and fills in its address; unchecking one disconnects it.\n- Ollama: local models, through Ollama's own API\n- vLLM: through its OpenAI-compatible API, with the API key vLLM publishes\n- llama.cpp: through its OpenAI-compatible API; no API key is needed\n- Maple Proxy: through its OpenAI-compatible API, with a placeholder key. It works when your Maple API key is saved in Maple Proxy; otherwise replace it with your key in Open WebUI's admin settings, under Connections\nCreate your admin account in the Web UI before running this.": 25,
  'OpenAI-compatible': 26,
  'local models': 27,
  "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before configuring backends.": 28,
  "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before resetting the password.": 29,
  'Copying bundled models': 30,
  'Preparing the database and models': 38,
  'Updated Open WebUI configuration': 31,
  'Reconnect SearXNG': 32,
  "Point web search back at SearXNG. Use this if the search address was changed by hand and Open WebUI stopped keeping it up to date — it restores the correct address and resumes maintaining it. Doesn't affect your other settings.": 33,
  "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before reconnecting SearXNG.": 34,
  "SearXNG isn't installed on this server, so there is no address to reconnect to. Install SearXNG and start it, then run this action again.": 35,
  'Web search is pointed back at SearXNG, and Open WebUI is restarting. The address below is now managed for you again — leave it alone and it will stay correct.': 36,
  'The web search address is one this server does not manage, so searches may not reach SearXNG. Reconnect SearXNG to restore it.': 37,
  'Must be an http:// or https:// URL': 39,
  "Replaces the web search address in Open WebUI with SearXNG's and restarts Open WebUI.": 40,
  'Replaces the password of the first admin account. Its current password stops working.': 41,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
