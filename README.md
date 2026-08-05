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

| Property      | Value                           |
| ------------- | ------------------------------- |
| Image         | `ghcr.io/open-webui/open-webui` |
| Architectures | x86_64, aarch64                 |
| Entrypoint    | Upstream default                |

## Volume and Data Layout

| Volume       | Mount Point         | Purpose                                                        |
| ------------ | ------------------- | -------------------------------------------------------------- |
| `open-webui` | `/app/backend/data` | Application data, user settings, chat history, SQLite database |
| `startos`    | —                   | StartOS-specific files (`store.json`)                          |

## Installation and First-Run Flow

Install runs three steps before the service is ever started normally (`startos/init/bootstrap.ts`):

1. **Seed the model cache.** The image bakes 265 MB of models into `/app/backend/data/cache` — the two text-embedding models used for document search (`all-MiniLM-L6-v2`, `TaylorAI/bge-micro-v2`), Whisper for audio transcription, and the tiktoken vocabularies. That directory is the *only* thing in `/app/backend/data` in the image, and it is exactly where the `open-webui` volume is mounted at runtime, so the mount hides all of it and the models are re-fetched from HuggingFace on demand. The cache is copied onto the volume first, with `cp -n` so nothing the user has since downloaded is overwritten.

   This does not make the box fully independent of HuggingFace. `sentence_transformers` resolves the embedding repo's `main` revision and pulls a 30-file snapshot — more formats than the image bakes — so the **install** boot below completes that download (measured: ~800 MB on top of the copied blobs, ~11 s on a warm link). What the copy buys is that Whisper and tiktoken, which load lazily on first use and are *not* covered by that boot, are already present; and that every start after install resolves all 30 files from cache instantly rather than downloading anything.
2. **Generate `WEBUI_SECRET_KEY`** into `store.json`.
3. **Boot Open WebUI once, to completion, then shut it down** (`runUntilSuccess`). This is the only thing that creates `webui.db` and its schema: Alembic runs at import and the config table is seeded immediately afterwards. Doing it here means every later config write can assume the table exists, so no other code carries first-run branching. If it fails or times out, init fails and StartOS rolls the install back.

Once install finishes, the managed config values are written to `webui.db` and the app is ready to use.

**Order still matters for backends:** open the **Web UI** and register your admin account _before_ running **Configure Backends** — the action refuses to run until an admin exists (issue #15).

## Configuration Management

Open WebUI has two kinds of setting, and this package treats them differently.

### Environment (read on every start)

These are plain environment variables that Open WebUI re-reads each launch, so setting them here is authoritative. They live in `daemonEnv` (`startos/utils.ts`).

| Variable                      | Value          | Purpose                        |
| ----------------------------- | -------------- | ------------------------------ |
| `WEBUI_SECRET_KEY`            | Auto-generated | Session signing key            |
| `CORS_ALLOW_ORIGIN`           | `*`            | Allow cross-origin requests    |
| `ENABLE_VERSION_UPDATE_CHECK` | `false`        | Disable upstream update checks |
| `ENABLE_ADMIN_ANALYTICS`      | `false`        | Disable analytics              |
| `WEBUI_SESSION_COOKIE_SECURE` | `true`         | Secure session cookies         |

### Managed config (written to `webui.db`)

Everything else Open WebUI calls `PersistentConfig` lives in the `config` table of `webui.db`. **Since Open WebUI 0.10 the environment only seeds such a key when it has no row yet** (`Config.seed_defaults` — _"Insert keys that don't yet exist in the DB … Existing DB values take precedence over defaults"_). After a key's first launch the stored row wins for good, whether or not the user ever edited it — so an env var is a one-shot seed, never an override. This package therefore writes these values to the database directly (`startos/managedConfig.ts`), under one of two policies:

| Key                            | Policy     | Value                                                          | Purpose                                                            |
| ------------------------------ | ---------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `ollama.enable`                | seed       | `false`                                                        | Keep Ollama opt-in until Configure Backends turns it on            |
| `openai.enable`                | seed       | `false`                                                        | Keep OpenAI-compatible backends opt-in                             |
| `ui.enable_community_sharing`  | seed       | `false`                                                        | Disable community sharing                                          |
| `web.search.engine`            | seed       | `searxng`                                                      | Default web-search backend (only used if web search is turned on)  |
| `web.search.searxng_query_url` | reconciled | `http://10.0.3.1:<assigned port>/search?q=<query>&format=json` | Endpoint Open WebUI queries when web search is enabled             |

- **seed** — written once, during install, and never asserted again. A starting point the user owns from then on.
- **reconciled** — re-asserted on every start by `setupMain`, before the daemon launches, because the correct value can change under the user: a dependency installed after Open WebUI's first launch, or an assigned bridge port that moves. A value the user has changed is never overwritten — the last value this package wrote is recorded in `store.json`, and anything that doesn't match it (and isn't empty) is left alone permanently.

### Backend connection URLs

`ollama.base_urls` and `openai.api_base_urls` are written by the Configure Backends action, and get the same treatment one level down: they are arrays mixing entries this package wrote with providers the user added by hand, so ownership is decided **per entry**. Configure Backends records the URL it wrote for each backend in `store.json`, and `setupMain` repoints an entry whose assigned bridge port has since moved — in place, so `openai.api_keys` stays aligned by index.

Several backends share the `10.0.3.1` bridge host and differ only by port, so nothing about a URL identifies which backend it belongs to; the recorded value is what makes the attribution. An entry with no record is claimed only when it already equals the resolved address, so an install predating this bookkeeping starts healing from its next Configure Backends run rather than having a guess imposed on it. A backend that is uninstalled is left alone — its entry is the user's to remove.

### Enabling Web Search (SearXNG)

Web search is **off by default**. To turn it on:

1. Install the optional [SearXNG](https://github.com/Start9Labs/searxng-startos) package on the same StartOS server.
2. In Open WebUI, open **Settings → Web Search** (under the **Admin** section) and toggle web search on. The engine (`searxng`) and query URL are already filled in.

This works in either install order. Installing SearXNG re-runs `setupMain` (its bridge address is resolved with `.const()`), and the reconcile pass writes the endpoint before the daemon starts. Seeding alone would not: install Open WebUI first and the endpoint is pinned at `""`, which no restart, update or environment variable can dislodge.

The query URL hits SearXNG's JSON API directly over the local StartOS service bridge (`10.0.3.1:<assigned port>`, resolved reactively from SearXNG's binding). No public exposure is required.

### User-Configurable Settings

All other configuration is done through the Open WebUI web interface:

- User accounts and authentication
- Model selection and parameters
- RAG (Retrieval Augmented Generation) settings
- API connections (OpenAI-compatible, etc.)
- System prompts and presets

## Network Access and Interfaces

| Interface | Type | Port | Description               |
| --------- | ---- | ---- | ------------------------- |
| Web UI    | ui   | 8080 | Main Open WebUI interface |

## Actions (StartOS UI)

### Configure Backends (`configure-backends`)

- **Purpose:** Connect Open WebUI to LLM backends. Auto-detects the compatible StartOS AI services you have installed (`ollama`, `vllm`, `llama-cpp`, `maple-proxy`) and presents them as a multiselect; selecting one fills in its bridge address (`10.0.3.1:<assigned port>`, resolved from the dependency's binding) and, where available, its API key — read from the dependency's published `public/credentials.json` for vLLM, or a placeholder for keyless backends (llama.cpp, Maple Proxy). A separate list lets you add arbitrary external OpenAI-compatible providers (base URL + optional key).
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

Base URLs are resolved over the local service bridge (`10.0.3.1:<assigned external port>`) from each dependency's exported host-id/port consts via `sdk.host.getBridgeAddress` — the internal ports below are the dependency's own bind ports, not the external bridge ports. Each backend's minimum version is the `versionRange` declared alongside it in `startos/backends.ts`.

| Dependency  | Required | Health Check  | Internal Port        | Notes                                                                                        |
| ----------- | -------- | ------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| Ollama      | Optional | `primary`     | `11434` (native API) | Local-model backend (Ollama native API); no key                                              |
| vLLM        | Optional | `primary`     | `8000` (`/v1`)       | OpenAI-compatible; API key read automatically from `vllm:public`                             |
| llama.cpp   | Optional | `primary`     | `8080` (`/v1`)       | OpenAI-compatible; keyless over the service bridge (UI/API auth is at llama.cpp's own proxy) |
| Maple Proxy | Optional | `maple-proxy` | `8080` (`/v1`)       | OpenAI-compatible privacy proxy; placeholder key (override in admin settings)                |
| SearXNG     | Optional | —             | `80`                 | Self-hosted web search                                                                       |

SearXNG is the exception to the rule above: it is **not** wired through Configure Backends. Install it, then turn web search on from Open WebUI's own **Settings → Web Search**, under the **Admin** section — the engine and query URL are already filled in, in either install order (see [Enabling Web Search](#enabling-web-search-searxng)).

## Backups and Restore

**Included in backup:**

- `open-webui` volume — Application data, chat history, user accounts, SQLite database
- `startos` volume — Secret key

**Restore behavior:**

- All data, accounts, and chat history are restored
- No reconfiguration needed

## Health Checks

| Check         | Method                          | Display         | Grace Period | Messages                                                        |
| ------------- | ------------------------------- | --------------- | ------------ | --------------------------------------------------------------- |
| Web Interface | HTTP `GET /health` on port 8080 | "Web Interface" | 120 seconds  | "The web interface is ready" / "The web interface is not ready" |

The extended grace period accounts for Open WebUI's initialization time.

## Limitations and Differences

1. **A backend is needed to chat**: Open WebUI installs and runs on its own, but you must connect at least one LLM backend (via **Configure Backends** or an external OpenAI-compatible provider) before you can chat.
2. **Configure Backends ordering**: The action refuses to run until you've opened the Web UI and created the first admin account — this prevents a database-corruption failure mode (issue #15).
3. **Maple Proxy API key**: Open WebUI can't read Maple Proxy's key automatically, so it seeds a non-empty placeholder. If your Maple Proxy enforces a key, replace the placeholder in Open WebUI's admin settings.
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

Build and development workflow follow the StartOS packaging guide: <https://docs.start9.com/packaging>. Keep `README.md`, `instructions.md`, and `AGENTS.md` in sync with any change to user-visible behavior or package structure.

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
  # base URLs resolved over the service bridge (10.0.3.1:<assigned port>) from the dep's port const
  - ollama # port 11434 (native; no key)
  - vllm # port 8000 /v1 (key auto-read from vllm:public)
  - llama-cpp # port 8080 /v1 (keyless over the service bridge)
  - maple-proxy # port 8080 /v1 (placeholder key)
  - searxng # port 80 (web search; enabled in Open WebUI's admin settings, not Configure Backends)
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
