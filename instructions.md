# Open WebUI

## Documentation

- [Open WebUI documentation](https://docs.openwebui.com/) — the upstream user and operator guide covering models, RAG, integrations, and the admin panel.

## What you get on StartOS

- A **Web UI** interface for chatting with large language models, managing conversations, uploading documents for RAG, and administering users.
- Pluggable LLM backends: Open WebUI **auto-detects** compatible StartOS AI services installed alongside it — [Ollama](https://github.com/Start9Labs/ollama-startos), [vLLM](https://github.com/Start9Labs/vllm-startos), [llama.cpp](https://github.com/Start9Labs/llama-cpp-startos), and [Maple Proxy](https://github.com/Start9-Community/maple-proxy-startos) — and wires them up from the **Configure Backends** action, plus any number of external OpenAI-compatible endpoints you add yourself (OpenAI, OpenRouter, etc.).
- Optional self-hosted web search via [SearXNG](https://github.com/Start9Labs/searxng-startos), pre-wired so Open WebUI's web-search toggle works without manual URL entry.
- An admin password reset action so you can recover the first admin account if you lose the credentials.

## Getting set up

1. Decide which LLM backends you want, and install the local ones first. Open WebUI auto-detects these StartOS AI services and connects to them for you — **Ollama** (local models), **vLLM**, **llama.cpp**, and **Maple Proxy** (all OpenAI-compatible). For external providers (OpenAI, OpenRouter, etc.) nothing extra is needed.
2. **Start Open WebUI, open the Web UI interface, and register the first account — whoever registers first becomes the admin. Do this _before_ running Configure Backends: the action refuses to run until an admin exists, because writing backend config before then corrupts the database.**
3. Run the **Configure Backends** action:
   - Under **Connect detected services**, check the StartOS AI services you want to use. Their internal URL is filled in automatically, along with the API key wherever Open WebUI can read it (Ollama and llama.cpp need none over the internal network; vLLM publishes its key). Maple Proxy gets a placeholder key — if you've set a Maple API key, replace it in Open WebUI afterwards.
   - Under **OpenAI-Compatible Providers**, add a row for each external endpoint: a base URL (e.g. `https://api.openai.com/v1`) and an optional API key.
4. (Optional) To enable web search, install **SearXNG**, then in Open WebUI open **Admin Panel → Settings → Web Search** and turn web search on. The engine and query URL are pre-filled.

## Using Open WebUI

### Web UI

The **Web UI** is where users sign in, chat with models, upload documents, and where the admin manages users and global settings from the **Admin Panel**. Upstream documentation covers the full feature set; everything you'd configure in a standalone Open WebUI install is configured here the same way.

### Actions

- **Configure Backends** — choose which LLM backends Open WebUI talks to. Re-run any time you add or remove a provider. Open WebUI restarts so the new wiring takes effect.
- **Reset Admin Password** — generate a fresh random password for the first admin user. Useful if you've lost the password. The new password is shown once; copy it before dismissing.
