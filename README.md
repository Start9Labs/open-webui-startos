<p align="center">
  <img src="icon.svg" alt="Open WebUI Logo" width="21%">
</p>

# Open WebUI on StartOS

> Everything not listed in this document should behave the same as upstream
> Open WebUI. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Open WebUI](https://github.com/open-webui/open-webui) is an extensible, self-hosted AI interface for chatting with large language models. On StartOS it connects to Ollama, vLLM, llama.cpp, Maple Proxy, or any external OpenAI-compatible API. This repository packages it for [StartOS](https://github.com/Start9Labs/start-os).

- **Upstream repo:** <https://github.com/open-webui/open-webui>
- **Wrapper repo:** <https://github.com/Start9Labs/open-webui-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Troubleshooting](#troubleshooting)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The upstream image is used unmodified, with the stock entrypoint. One long-running subcontainer serves the app; the rest exist only for the length of an install or a single config read.

| Property      | Value                           |
| ------------- | ------------------------------- |
| Image         | `ghcr.io/open-webui/open-webui` |
| Architectures | x86_64, aarch64                 |
| Entrypoint    | Upstream default                |

| Subcontainer            | Lifetime            | Purpose                                                |
| ----------------------- | ------------------- | ------------------------------------------------------ |
| `open-webui-sub`        | The running service | The `primary` daemon — this is the one to `attach` to  |
| `open-webui-bootstrap`  | Install only        | Boots the app once to create `webui.db` and its schema |
| _(unnamed temporaries)_ | Seconds             | Seed the model cache; run `python3` against `webui.db` |

## Volume and Data Layout

Two volumes. Everything Open WebUI itself writes lives in one; the package's own bookkeeping is kept out of it in the other.

| Volume       | Mount Point         | Purpose                                                   |
| ------------ | ------------------- | --------------------------------------------------------- |
| `open-webui` | `/app/backend/data` | Application data, user settings, chat history, `webui.db` |
| `startos`    | — (host side)       | `store.json`; never mounted into the container            |

The `open-webui` volume is also mounted at `/mnt/data` during install only, so the image's baked model cache and the volume are both visible while the cache is copied across.

## File Models

Open WebUI keeps almost all of its configuration inside its own SQLite database rather than in a config file, which decides how this package writes settings and what happens to yours.

| File         | Format | Modelled                              | Written by                                                  |
| ------------ | ------ | ------------------------------------- | ----------------------------------------------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json`               | Install, `setupMain`, and the actions                       |
| `webui.db`   | SQLite | No — `python3` in a temp subcontainer | Install, `setupMain`, Configure Backends, Reconnect SearXNG |

**`store.json`** holds `WEBUI_SECRET_KEY` plus the package's ownership records: `managedConfig` (the last value written for each reconciled `webui.db` key) and `managedBackendUrls` (backend id → the base URL last written for it). Those records are the whole ownership mechanism — without them the package cannot tell a value it set from one you changed, so they are on a backed-up volume and survive restore.

**`webui.db` is not a file model.** It is the application's own SQLite database, read and written by a short-lived subcontainer running `python3` from the same image, so the client stack always matches the daemon's. Writes refuse to act when the file is absent rather than creating one — an empty database is inherited by Alembic and corrupts the install (issue #15).

### Environment versus database

An environment variable is a **one-shot seed here, never an override.** Since Open WebUI 0.10, `Config.seed_defaults` writes each `PersistentConfig` key into the `config` table on the first launch that finds it missing, and the stored row wins from then on whether or not you ever edited it.

So the environment carries only variables Open WebUI re-reads on every launch — `WEBUI_SECRET_KEY`, `CORS_ALLOW_ORIGIN`, `WEBUI_SESSION_COOKIE_SECURE`, `ENABLE_VERSION_UPDATE_CHECK`, `ENABLE_ADMIN_ANALYTICS`. Adding a `PersistentConfig` variable there would silently do nothing after first launch. Everything else is written to `webui.db` under one of two policies:

| Key                            | Policy     | Value                                             |
| ------------------------------ | ---------- | ------------------------------------------------- |
| `ollama.enable`                | seed       | `false` — keeps Ollama opt-in                     |
| `openai.enable`                | seed       | `false` — keeps OpenAI-compatible backends opt-in |
| `ui.enable_community_sharing`  | seed       | `false`                                           |
| `web.search.engine`            | seed       | `searxng`                                         |
| `openai.api_base_urls`         | seed       | `[]` — clears an entry upstream adds on its own   |
| `openai.api_keys`              | seed       | `[]` — keeps the key array aligned with the above |
| `web.search.searxng_query_url` | reconciled | SearXNG's resolved bridge address                 |

- **seed** — written once during install, never asserted again. A starting point you own from then on.

  The two empty `openai.*` arrays are a seed that clears rather than sets. With no `OPENAI_API_BASE_URL(S)` in the environment, upstream splits an empty string and rewrites the blank entry to `https://api.openai.com/v1`, so `seed_defaults` writes that URL into `webui.db` on the install boot and `deriveView` reports it as a provider you added. It is not merely a stray row: Configure Backends derives `openai.enable` from the number of base URLs, so running it for any other reason — connecting Ollama — would enable the OpenAI API against a keyless endpoint. Seeding `[]` starts the list genuinely empty, and `[]` is a state Configure Backends already writes when nothing is selected.

- **reconciled** — re-asserted by `setupMain` before the daemon starts, because the correct value can change underneath you: SearXNG installed after first launch, or its assigned bridge port moving.

**A reconciled value you have changed is never overwritten.** The package compares what is stored against what it last wrote (`managedConfig`); anything else non-empty is left alone permanently. One transitional exception: a key with no ownership record at all — only possible on an install predating `0.11.0:1`, since every write path since then records its key — is taken back once if the stored value names this server's own SearXNG, by bridge host or by `searxng.startos`.

Because that decision is one-way, [Reconnect SearXNG](#actions) exists to hand the key back.

### Backend URLs

`ollama.base_urls` and `openai.api_base_urls` are arrays mixing entries this package wrote with providers you added by hand, so ownership is decided **per entry** against `managedBackendUrls`. Several backends share the `10.0.3.1` bridge host and differ only by port, so nothing in a URL identifies which backend it belongs to — the recorded value is what makes the attribution.

`setupMain` repoints an entry whose assigned bridge port has moved, in place, so `openai.api_keys` stays aligned by index. An entry with no record is claimed only when it already equals the resolved address, so an install predating this bookkeeping heals from its next Configure Backends run rather than having a guess imposed on it. An uninstalled backend keeps its entry until you remove it.

## Dependencies

Every dependency is **optional** — Open WebUI installs and runs without any of them, though you cannot chat until at least one LLM backend is connected. A backend becomes an active running-dependency only when selected in Configure Backends, which calls `setDependencies` so StartOS keeps it running.

Base URLs are resolved over the local service bridge (`10.0.3.1:<assigned external port>`) from each dependency's exported host-id and port constants via `sdk.host.getBridgeAddress`. The ports below are the dependency's own internal bind ports, not the external bridge ports. Each backend's minimum version is the `versionRange` declared alongside it in `startos/backends.ts`.

| Dependency  | Health Check  | Internal Port        | Notes                                                                 |
| ----------- | ------------- | -------------------- | --------------------------------------------------------------------- |
| Ollama      | `primary`     | `11434` (native API) | Ollama native API; no key                                             |
| vLLM        | `primary`     | `8000` (`/v1`)       | OpenAI-compatible; API key read automatically from `vllm:public`      |
| llama.cpp   | `primary`     | `8080` (`/v1`)       | OpenAI-compatible; keyless over the bridge (auth is at its own proxy) |
| Maple Proxy | `maple-proxy` | `8080` (`/v1`)       | OpenAI-compatible privacy proxy; placeholder key                      |
| SearXNG     | —             | `80`                 | Self-hosted web search                                                |

SearXNG is the exception to the mechanism above: it is **not** wired through Configure Backends. Install it, then enable web search in Open WebUI's own **Settings → Web Search** under **Admin** — the engine and query URL are already filled in, in either install order.

## Network Access and Interfaces

One interface, serving the web UI. Nothing is exported for dependent services.

| Interface | Id   | Type | Port | Description               |
| --------- | ---- | ---- | ---- | ------------------------- |
| Web UI    | `ui` | ui   | 8080 | Main Open WebUI interface |

The port is bound on the `ui-multi` MultiHost and is not masked.

## Installation and First-Run Flow

Install does three things before the service ever starts normally, and the last of them is what lets every other code path assume a working database.

1. **Seed the model cache.** The image bakes a 265 MB cache into `/app/backend/data/cache` — two text-embedding models used for document search, Whisper for audio transcription, and the tiktoken vocabularies. That directory is the only thing in `/app/backend/data` in the image, and it is exactly where the `open-webui` volume mounts at runtime, so the mount would hide all of it. The cache is copied onto the volume with `cp -an`, which never overwrites a model you have since downloaded.

2. **Generate `WEBUI_SECRET_KEY`** into `store.json`.

3. **Boot Open WebUI once to completion, then shut it down.** This is the only thing that creates `webui.db` and its schema: Alembic runs at import and the config table is seeded immediately after. Doing it here is why no other code path carries first-run branching. If it fails or times out, init fails and StartOS rolls the install back.

**Install needs network.** Step 1 does not make the server independent of HuggingFace: `sentence_transformers` resolves the embedding repo's `main` revision and pulls a 30-file snapshot — more formats than the image bakes — which the step-3 boot completes. What the cache copy buys is that Whisper and tiktoken, which load lazily on first use and are not covered by that boot, are already present, and that every later start resolves all 30 files from cache instantly.

**Order matters for backends.** Open the Web UI and register your admin account _before_ running Configure Backends; the action refuses to run until an admin exists.

## Actions

All three actions are user-facing and runnable whether the service is running or stopped.

### Configure Backends

Connects Open WebUI to LLM backends. Run it after installing a backend service, or when you want to add an external OpenAI-compatible provider.

- **What it changes:** `ollama.*` and `openai.*` keys in `webui.db`, the recorded URLs in `store.json`, and the package's running-dependency set.
- **Cost:** seconds, then a restart of Open WebUI.
- **Repeat safety:** safe to re-run; it rewrites the full selection each time, so deselecting a backend removes it.
- **What happens next:** the service restarts and the newly selected backends appear as model sources.
- **Guard:** refuses to run until a first admin account exists — see [Installation and First-Run Flow](#installation-and-first-run-flow).

It auto-detects which compatible AI services are installed and presents them as a multiselect, filling in each one's bridge address and, where available, its API key — read from the dependency's published `public/credentials.json` for vLLM, or a placeholder for the keyless backends. A separate list takes arbitrary external providers.

### Reconnect SearXNG

Takes `web.search.searxng_query_url` back under management after you have edited it in Open WebUI's admin settings. Run it when the [Reconnect SearXNG task](#tasks) appears.

- **What it changes:** the reconciled key in `webui.db`, and its ownership record in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent.
- **Outputs:** the restored address, copyable.
- **Guards:** refuses before a first admin account exists, and when SearXNG is not installed — there is no address to restore, and fabricating one would be worse than saying so.

**Why it has to exist.** Reconciliation only rewrites a value that is absent, empty, or byte-identical to what the package last wrote — a deliberate rule so your own endpoint is never clobbered. But that decision is one-way: the only state that would release the key back is empty, and Open WebUI's admin form will not save it, because the Searxng Query URL input is marked `required` upstream and sits in a form with native validation. Editing the field once therefore ended the automatic address handling permanently, with a `sqlite3` command over SSH or a reinstall as the only recoveries. This action is the supported recovery, and the only caller allowed to bypass the ownership test — it runs solely on an explicit request. It deliberately does **not** rewrite the seeded values, which are one-time starting points you own; doing so would silently reset your backend choices.

It reclaims every reconciled key, and the SearXNG URL is currently the only one — a second would mean revisiting this action's name, its SearXNG-specific guard, and the task condition together.

### Reset Admin Password

Generates a new random password for the first admin user. Run it when locked out.

- **What it changes:** the first admin user's password hash in `webui.db`.
- **Repeat safety:** safe to re-run; each run generates a fresh password and invalidates the previous one.
- **Outputs:** the new password, masked and copyable. It is not recoverable afterwards.

## Tasks

The package raises one task, and only in a situation you cannot otherwise detect: web search silently not reaching your SearXNG.

| Task              | Severity    | Raised when                                                                  | Cleared when                                                               |
| ----------------- | ----------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Reconnect SearXNG | `important` | The reconcile pass declines the SearXNG query URL because it was hand-edited | The action runs, SearXNG is uninstalled, or the value is corrected by hand |

`important` rather than `critical` deliberately: a wrong search endpoint should not block the service from starting. StartOS drops a task with no `when` as soon as its action runs, so the package's explicit clear covers only the other two exits.

## Health Checks

One check, on the primary daemon.

| Check                     | Method                          | Grace Period |
| ------------------------- | ------------------------------- | ------------ |
| `primary` "Web Interface" | HTTP `GET /health` on port 8080 | 120 seconds  |

The long grace period is not padding: `uvicorn` binds the socket before the FastAPI app finishes its lifespan startup, so a port check would report ready well before the app serves. `/health` flips only when it actually is.

**Failing after the grace period** means the app is not serving — check the service logs for an Alembic migration error or a corrupt `webui.db`, not for a networking fault. **Failing on a first start after restore** is usually still the migration running against a large database; give it time before intervening.

## Backups and Restore

Both volumes are copied wholesale — `sdk.Backups.ofVolumes('open-webui', 'startos')`. There is no database dump step: `webui.db` is captured as a file along with the rest of the volume.

- **Included:** all application data, chat history, user accounts, and the model cache (`open-webui`); the secret key and ownership records (`startos`).
- **Restore:** everything comes back, including logins, and no reconfiguration is needed. Because `store.json` is included, the package still knows which config values and backend URLs are its own, so reconciliation resumes rather than restarting from a guess.

## Limitations and Differences

1. **A backend is required to chat.** Open WebUI installs and runs on its own, but you must connect at least one LLM backend before you can hold a conversation.
2. **Configure Backends is ordered after admin registration.** The action refuses to run until you have opened the Web UI and created the first admin account, which prevents a database-corruption failure mode.
3. **Maple Proxy's API key cannot be read automatically**, so a non-empty placeholder is seeded. If your Maple Proxy enforces a key, replace the placeholder in Open WebUI's admin settings.
4. **No GPU acceleration for Open WebUI itself.** Inference runs in the backend services.
5. **Install requires internet access** to complete the embedding-model download — see [Installation and First-Run Flow](#installation-and-first-run-flow).

## Troubleshooting

The failure modes specific to this package, most of which trace back to `webui.db` being the real configuration store.

| Symptom                                                    | Check                                                            | Resolution                                                                                 |
| ---------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Configure Backends refuses to run                          | Has an admin account been created in the Web UI?                 | Open the Web UI, register the first admin, then re-run the action                          |
| Web search returns nothing; Reconnect SearXNG task showing | Was the Searxng Query URL edited in Open WebUI's admin settings? | Run [Reconnect SearXNG](#actions)                                                          |
| No models available; cannot start a chat                   | Is any backend selected in Configure Backends?                   | Install a backend service, then select it in Configure Backends                            |
| A setting reverts on every start                           | Is it one of the reconciled keys above?                          | Expected for reconciled keys; the package re-asserts them. Seeded keys are never touched   |
| Install fails or times out                                 | Does the server have internet access to HuggingFace?             | Restore connectivity and reinstall — install cannot complete offline                       |
| A backend stops working after the dependency was updated   | Did its assigned bridge port move?                               | `setupMain` repoints it automatically on the next start; if not, re-run Configure Backends |
| Models re-download from HuggingFace on every start         | Did install complete, or was the volume replaced?                | Reinstall so the bootstrap step reseeds the cache onto the volume                          |

---

## Quick Reference for AI Consumers

```yaml
package_id: open-webui
image: ghcr.io/open-webui/open-webui
architectures:
  - x86_64
  - aarch64
subcontainers:
  - open-webui-sub # the running daemon
  - open-webui-bootstrap # install only
volumes:
  open-webui: /app/backend/data
  startos: host side (store.json)
file_models:
  - store.json # FileHelper.json on the startos volume
startos_managed_env_vars:
  - WEBUI_SECRET_KEY
  - CORS_ALLOW_ORIGIN
  - WEBUI_SESSION_COOKIE_SECURE
  - ENABLE_VERSION_UPDATE_CHECK
  - ENABLE_ADMIN_ANALYTICS
dependencies: # all optional
  - ollama # port 11434 (native; no key)
  - vllm # port 8000 /v1 (key auto-read from vllm:public)
  - llama-cpp # port 8080 /v1 (keyless over the service bridge)
  - maple-proxy # port 8080 /v1 (placeholder key)
  - searxng # port 80 (enabled in Open WebUI's admin settings)
interfaces:
  ui: { type: ui, port: 8080 }
actions:
  - configure-backends
  - reconnect-searxng
  - reset-password
tasks:
  - { action: reconnect-searxng, severity: important }
health_checks:
  - primary # the daemon's ready check, displayed "Web Interface"
```
