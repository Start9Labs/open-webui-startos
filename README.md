<p align="center">
  <img src="icon.svg" alt="Open WebUI Logo" width="21%">
</p>

# Open WebUI on StartOS

> **Upstream docs:** <https://docs.openwebui.com/>
>
> Everything not listed in this document should behave the same as upstream
> Open WebUI. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Open WebUI](https://github.com/open-webui/open-webui) is an extensible, self-hosted AI interface for chatting with large language models. On StartOS it connects to Ollama, vLLM, llama.cpp, Maple Proxy, or any external OpenAI-compatible API. This repository packages it for [StartOS](https://github.com/Start9Labs/start-os).

- **Upstream repo:** <https://github.com/open-webui/open-webui>
- **Wrapper repo:** <https://github.com/Start9Labs/open-webui-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | `ghcr.io/open-webui/open-webui` |
| Architectures | x86_64, aarch64 |
| Entrypoint | Upstream default |

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `open-webui` | `/app/backend/data` | Application data, user settings, chat history, SQLite database |
| `startos` | — | StartOS-specific files (`store.json`) |

## Installation and First-Run Flow

On install, StartOS auto-generates a `WEBUI_SECRET_KEY` and stores it in `store.json`. The app is ready to use immediately.

**Order matters:** open the **Web UI** and register your admin account _before_ running **Configure Backends**. Open WebUI creates its SQLite schema (and the admin user) on first launch; the Configure Backends action refuses to run until an admin exists, because writing backend config into a not-yet-initialized database corrupts it. Once the admin is created, run **Configure Backends** to connect your LLM backends.

## Configuration Management

### Auto-Configured Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `OLLAMA_BASE_URL` | `http://ollama.startos:11434` | Connection to Ollama service |
| `WEBUI_SECRET_KEY` | Auto-generated | Session signing key |
| `CORS_ALLOW_ORIGIN` | `*` | Allow cross-origin requests |
| `ENABLE_VERSION_UPDATE_CHECK` | `false` | Disable upstream update checks |
| `ENABLE_COMMUNITY_SHARING` | `false` | Disable community sharing |
| `ENABLE_ADMIN_ANALYTICS` | `false` | Disable analytics |
| `WEBUI_SESSION_COOKIE_SECURE` | `true` | Secure session cookies |
| `WEB_SEARCH_ENGINE` | `searxng` | Default web-search backend (only used if web search is turned on) |
| `SEARXNG_QUERY_URL` | `http://searxng.startos:80/search?q=<query>&format=json` | Endpoint Open WebUI queries when web search is enabled |

> Open WebUI treats most of these as `PersistentConfig` values: they're read from the env on first install and saved to the internal database. Subsequent edits via the Open WebUI admin panel override the defaults — changing them via env requires a fresh install or clearing the corresponding DB rows.

### Enabling Web Search (SearXNG)

Web search is **off by default**. To turn it on:

1. Install the optional [SearXNG](https://github.com/Start9Labs/searxng-startos) package on the same StartOS server.
2. In Open WebUI, go to **Admin Panel → Settings → Web Search** and toggle web search on. The engine (`searxng`) and query URL are pre-filled.

The pre-filled URL hits SearXNG's JSON API directly via the StartOS internal network. No public exposure is required.

### User-Configurable Settings

All other configuration is done through the Open WebUI web interface:
- User accounts and authentication
- Model selection and parameters
- RAG (Retrieval Augmented Generation) settings
- API connections (OpenAI-compatible, etc.)
- System prompts and presets

## Network Access and Interfaces

| Interface | Type | Port | Description |
|-----------|------|------|-------------|
| Web UI | ui | 8080 | Main Open WebUI interface |

## Actions (StartOS UI)

### Configure Backends (`configure-backends`)

- **Purpose:** Connect Open WebUI to LLM backends. Auto-detects the compatible StartOS AI services you have installed (`ollama`, `vllm`, `llama-cpp`, `maple-proxy`) and presents them as a multiselect; selecting one fills in its internal `.startos` URL and, where available, its API key — read from the dependency's published `public/credentials.json` for vLLM and llama.cpp, or a placeholder for Maple Proxy. A separate list lets you add arbitrary external OpenAI-compatible providers (base URL + optional key).
- **Visibility:** Enabled
- **Availability:** Any status (running or stopped)
- **Guard:** Refuses to run until a first admin account exists (see [Installation and First-Run Flow](#installation-and-first-run-flow)).
- **Effect:** Writes `ollama.*` / `openai.*` into Open WebUI's config DB, updates the package's running-dependency set, and restarts Open WebUI.

### Reset Admin Password (`reset-password`)

- **Purpose:** Generates a new random 22-character password for the first admin user
- **Visibility:** Enabled
- **Availability:** Any status (running or stopped)
- **Inputs:** None
- **Outputs:** Displays the new password (masked, copyable)

## Dependencies

All dependencies are **optional** — Open WebUI installs and runs without any of them (you just can't chat until at least one LLM backend is connected). A backend becomes an active running-dependency only when you select it in **Configure Backends**, which calls `setDependencies` so StartOS keeps it running.

| Dependency | Required | Version Constraint | Health Check | Internal URL | Notes |
|------------|----------|-------------------|--------------|--------------|-------|
| Ollama | Optional | `>=0.21.0:0` | `primary` | `http://ollama.startos:11434` | Local-model backend (Ollama native API); no key |
| vLLM | Optional | `>=0.16.0:0.1` | `primary` | `http://vllm.startos:8000/v1` | OpenAI-compatible; API key read automatically from `vllm:public` |
| llama.cpp | Optional | `>=1.0.9468:1` | `primary` | `http://llama-cpp.startos:8080/v1` | OpenAI-compatible; API key read automatically from `llama-cpp:public` |
| Maple Proxy | Optional | `>=0.1.8:1` | `maple-proxy` | `http://maple-proxy.startos:8080/v1` | OpenAI-compatible privacy proxy; placeholder key (override in admin panel) |
| SearXNG | Optional | — | — | `http://searxng.startos:80` | Self-hosted web search |

SearXNG is the exception to the rule above: it is **not** wired through Configure Backends. Install it, then turn web search on from Open WebUI's own **Admin Panel → Settings → Web Search** (the engine and query URL are pre-filled).

## Backups and Restore

**Included in backup:**

- `open-webui` volume — Application data, chat history, user accounts, SQLite database
- `startos` volume — Secret key

**Restore behavior:**

- All data, accounts, and chat history are restored
- No reconfiguration needed

## Health Checks

| Check | Method | Display | Grace Period | Messages |
|-------|--------|---------|--------------|----------|
| Web Interface | HTTP `GET /health` on port 8080 | "Web Interface" | 120 seconds | "The web interface is ready" / "The web interface is not ready" |

The extended grace period accounts for Open WebUI's initialization time.

## Limitations and Differences

1. **A backend is needed to chat**: Open WebUI installs and runs on its own, but you must connect at least one LLM backend (via **Configure Backends** or an external OpenAI-compatible provider) before you can chat.
2. **Configure Backends ordering**: The action refuses to run until you've opened the Web UI and created the first admin account — this prevents a database-corruption failure mode (issue #15).
3. **Maple Proxy API key**: Open WebUI can't read Maple Proxy's key automatically, so it seeds a non-empty placeholder. If your Maple Proxy enforces a key, replace the placeholder in Open WebUI's admin panel.
4. **No GPU acceleration for Open WebUI itself**: Inference runs in the backend services; large models may be slow depending on hardware.

## What Is Unchanged from Upstream

- Full Open WebUI feature set
- User authentication and multi-user support
- Chat interface and conversation history
- RAG capabilities with document upload
- Model parameter customization
- OpenAI-compatible API configuration (via web UI)
- Plugin/extension support

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: open-webui
image: ghcr.io/open-webui/open-webui
architectures:
  - x86_64
  - aarch64
volumes:
  open-webui: /app/backend/data
  startos: host (store.json)
ports:
  ui: 8080
dependencies: # all optional; registered as running-deps when selected in Configure Backends
  - ollama # http://ollama.startos:11434 (native; no key)
  - vllm # http://vllm.startos:8000/v1 (key auto-read from vllm:public)
  - llama-cpp # http://llama-cpp.startos:8080/v1 (key auto-read from llama-cpp:public)
  - maple-proxy # http://maple-proxy.startos:8080/v1 (placeholder key)
  - searxng # http://searxng.startos:80 (web search; enabled in admin panel, not Configure Backends)
startos_managed_env_vars:
  - OLLAMA_BASE_URL
  - WEBUI_SECRET_KEY
  - CORS_ALLOW_ORIGIN
  - ENABLE_VERSION_UPDATE_CHECK
  - ENABLE_COMMUNITY_SHARING
  - ENABLE_ADMIN_ANALYTICS
  - WEBUI_SESSION_COOKIE_SECURE
actions:
  - configure-backends
  - reset-password
```
