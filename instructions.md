# Open WebUI

## Documentation

- [Open WebUI documentation](https://docs.openwebui.com/) — the upstream user and operator guide covering models, RAG, integrations, and the admin panel.

## What you get on StartOS

- A **Web UI** interface for chatting with large language models, managing conversations, uploading documents for RAG, and administering users.
- Pluggable LLM backends: an optional [Ollama](https://github.com/Start9Labs/ollama-startos) sidecar for hosting local models, an optional [vLLM](https://github.com/Start9Labs/vllm-startos) sidecar serving an OpenAI-compatible API, and any number of external OpenAI-compatible endpoints you add yourself (OpenAI, OpenRouter, llama.cpp server, etc.).
- Optional self-hosted web search via [SearXNG](https://github.com/Start9Labs/searxng-startos), pre-wired so Open WebUI's web-search toggle works without manual URL entry.
- An admin password reset action so you can recover the first admin account if you lose the credentials.

## Getting set up

1. Decide which LLM backends you want. If you want to host models locally, install **Ollama** and/or **vLLM** before starting Open WebUI. If you only plan to use external providers (OpenAI, OpenRouter, etc.), no extra installs are required.
2. Start Open WebUI and open the **Web UI** interface. Register the first account — the user who registers first becomes the admin.
3. Run the **Configure Backends** action to point Open WebUI at your chosen backends:
   - Toggle **Enable Ollama Backend** on if you installed Ollama. Open WebUI will connect to it automatically.
   - Toggle **Enable vLLM Backend** on if you installed vLLM. The API key vLLM publishes is wired in for you and rotated automatically if vLLM regenerates it.
   - Under **OpenAI-Compatible Providers**, add a row for each external endpoint. Each row takes a base URL (e.g. `https://api.openai.com/v1`) and an optional API key.
4. (Optional) To enable web search, install **SearXNG**, then in Open WebUI open **Admin Panel -> Settings -> Web Search** and turn web search on. The engine and query URL are pre-filled.

## Using Open WebUI

### Web UI

The **Web UI** is where users sign in, chat with models, upload documents, and where the admin manages users and global settings from the **Admin Panel**. Upstream documentation covers the full feature set; everything you'd configure in a standalone Open WebUI install is configured here the same way.

### Actions

- **Configure Backends** — choose which LLM backends Open WebUI talks to. Re-run any time you add or remove a provider. Open WebUI restarts so the new wiring takes effect.
- **Reset Admin Password** — generate a fresh random password for the first admin user. Useful if you've lost the password. The new password is shown once; copy it before dismissing.
