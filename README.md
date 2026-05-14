<p align="center">
  <img src="icon.svg" alt="Open WebUI Logo" width="21%">
</p>

# Open WebUI on StartOS

> **Upstream docs:** <https://docs.openwebui.com/>
>
> Everything not listed in this document should behave the same as upstream
> Open WebUI. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Open WebUI](https://github.com/open-webui/open-webui) is an extensible, self-hosted AI interface for running and interacting with LLMs. This repository packages it for [StartOS](https://github.com/Start9Labs/start-os), with built-in toggles for Ollama, vLLM, and any OpenAI-compatible provider.

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

On install, StartOS auto-generates a `WEBUI_SECRET_KEY` and stores it in `store.json`. By default Open WebUI launches with Ollama enabled — install the [Ollama](https://github.com/Start9Labs/ollama-startos) package if you want the default to work out of the box, or use the **Configure Backends** action to switch to vLLM or any OpenAI-compatible provider instead. Then open the web UI and register your admin account.

## Configuration Management

Open WebUI's own SQLite database (`webui.db`) is the single source of truth for backend wiring (Ollama URL, OpenAI-compatible providers, the enable flags, web-search engine, etc.). The StartOS **Configure Backends** action and Open WebUI's admin UI both read and write that same database, so changes made in one show up in the other without restarts.

### Seeded on First Install

The values below are only seeded into `webui.db` on first install; subsequent edits in the Open WebUI admin UI or via the **Configure Backends** action win.

| Setting | Value | Purpose |
|---------|-------|---------|
| `OLLAMA_BASE_URL` | `http://ollama.startos:11434` | Default Ollama connection (when enabled) |
| `WEBUI_SECRET_KEY` | Auto-generated | Session signing key |
| `CORS_ALLOW_ORIGIN` | `*` | Allow cross-origin requests |
| `ENABLE_VERSION_UPDATE_CHECK` | `false` | Disable upstream update checks |
| `ENABLE_COMMUNITY_SHARING` | `false` | Disable community sharing |
| `ENABLE_ADMIN_ANALYTICS` | `false` | Disable analytics |
| `WEBUI_SESSION_COOKIE_SECURE` | `true` | Secure session cookies |
| `ENABLE_OLLAMA_API` | `true` | Enable the Ollama backend (matches the default Configure Backends setting) |
| `ENABLE_OPENAI_API` | `false` | Disable OpenAI-compatible backends (Configure Backends turns this on when needed) |
| `WEB_SEARCH_ENGINE` | `searxng` | Default web-search backend (only used if web search is turned on) |
| `SEARXNG_QUERY_URL` | `http://searxng.startos:80/search?q=<query>&format=json` | Endpoint Open WebUI queries when web search is enabled |

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

- **Purpose:** Choose which LLM backends Open WebUI connects to.
- **Inputs:**
  - `enableOllama` — toggle the Ollama dependency on/off (default: on, connects to `http://ollama.startos:11434`).
  - `enableVllm` — toggle the vLLM dependency on/off. When on, the vLLM API key is reactively mirrored from `vllm:public/credentials.json` into the matching `openai.api_keys` slot in `webui.db`, so key rotations propagate without a manual edit.
  - `customProviders` — list of `{ baseUrl, apiKey }` entries for any additional OpenAI-compatible endpoints (llama.cpp server, OpenAI cloud, OpenRouter, etc.).
- **Effect:** Writes the chosen flags, URLs, and keys directly into `webui.db` and recalculates the StartOS dependency set so Ollama and/or vLLM become required only when enabled.

### Reset Admin Password (`reset-password`)

- **Purpose:** Generates a new random 22-character password for the first admin user.
- **Visibility:** Enabled.
- **Availability:** Any status (running or stopped).
- **Inputs:** None.
- **Outputs:** Displays the new password (masked, copyable).

## Dependencies

All three dependencies are **optional**. They become required only when enabled — either implicitly (Ollama is on by default) or explicitly through the **Configure Backends** action / SearXNG admin setup.

| Dependency | Default | Version Constraint | Health Checks | Purpose |
|------------|---------|--------------------|---------------|---------|
| [Ollama](https://github.com/Start9Labs/ollama-startos) | Enabled | `>=0.21.0:0` | `primary` | Local LLM backend, connected at `http://ollama.startos:11434`. |
| [vLLM](https://github.com/Start9Labs/vllm-startos) | Disabled | `>=0.16.0:0.1` | `primary` | Local OpenAI-compatible LLM backend, connected at `http://vllm.startos:8000/v1`. Requires ≥ `0.16.0:0.1` because earlier vLLM releases did not publish the API key on a `public` volume for dependents to read. |
| [SearXNG](https://github.com/Start9Labs/searxng-startos) | Disabled | any | — | Self-hosted web-search backend. Install it and enable web search in the Open WebUI admin panel; the engine and query URL are pre-filled. |

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
| Web Interface | Port listening (8080) | "Web Interface" | 120 seconds | "The web interface is ready" / "The web interface is not ready" |

The extended grace period accounts for Open WebUI's initialization time.

## Limitations and Differences

1. **At least one backend must be reachable**: Open WebUI itself ships no models. Either keep Ollama enabled (default), enable vLLM, or add a `customProviders` entry through Configure Backends. With every backend disabled the UI loads but model lists are empty.
2. **No GPU acceleration**: Performance depends on StartOS hardware; large models may be slow.
3. **Model downloads**: Ollama models are pulled through the Ollama package; vLLM models are loaded through vLLM's package config; Open WebUI itself does not download model weights.

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
dependencies_optional:
  - ollama   # default enabled
  - vllm     # default disabled
  - searxng  # default disabled
startos_seeded_env_vars:
  - OLLAMA_BASE_URL
  - WEBUI_SECRET_KEY
  - CORS_ALLOW_ORIGIN
  - ENABLE_VERSION_UPDATE_CHECK
  - ENABLE_COMMUNITY_SHARING
  - ENABLE_ADMIN_ANALYTICS
  - WEBUI_SESSION_COOKIE_SECURE
  - ENABLE_OLLAMA_API
  - ENABLE_OPENAI_API
  - WEB_SEARCH_ENGINE
  - SEARXNG_QUERY_URL
config_source_of_truth: webui.db
actions:
  - configure-backends
  - reset-password
```
