<p align="center">
  <img src="icon.svg" alt="Open WebUI Logo" width="21%">
</p>

# Open WebUI on StartOS

> Everything not listed in this document should behave the same as upstream
> Open WebUI. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Open WebUI](https://github.com/open-webui/open-webui/) is a chat interface for large language models. This package wires it to the LLM backends already on your server, keeps those connections pointing at the right addresses as they move, and closes off the parts of upstream that reach out to the internet by default.

- **Upstream repo:** <https://github.com/open-webui/open-webui/>
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
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, unmodified.

| Property      | Value                           |
| ------------- | ------------------------------- |
| Image         | `ghcr.io/open-webui/open-webui` |
| Architectures | x86_64, aarch64                 |
| Entrypoint    | Upstream's                      |

| Subcontainer           | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `open-webui-sub`       | The `primary` daemon — the one to `attach` to           |
| `open-webui-bootstrap` | Temporary; the install-time first boot                  |
| `webui-model-seed`     | Temporary; copies the baked model cache onto the volume |

## Volume and Data Layout

Two volumes, and one of them never enters a container.

| Volume       | Mount Point         | Purpose                                                               |
| ------------ | ------------------- | --------------------------------------------------------------------- |
| `open-webui` | `/app/backend/data` | `webui.db`, uploaded documents, the vector store, and the model cache |
| `startos`    | — (host side)       | `store.json`; never mounted into a container                          |

**Mounting the volume hides something the image ships.** Open WebUI bakes a 265 MB model cache into `/app/backend/data/cache` — embedding models, Whisper, and tiktoken vocabularies — and the volume covers exactly that path, so on a fresh install all of it is invisible and every model would be re-fetched from HuggingFace on demand. A temporary container therefore mounts the same volume a second time out of the way and copies the cache across before anything else runs. It copies without overwriting, so a model you have since downloaded is left alone and later updates are a no-op.

## File Models

One model, on the `startos` volume. **Open WebUI's own configuration is not a file** — it lives in `webui.db`, and the package writes to that database directly.

| File         | Format | Modelled                | Written by                            |
| ------------ | ------ | ----------------------- | ------------------------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | Install, every start, and the actions |

| Key                  | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `WEBUI_SECRET_KEY`   | A 64-character secret signing every session, generated at install     |
| `managedConfig`      | The last value this package wrote for each database key it reconciles |
| `managedBackendUrls` | The last URL it wrote for each backend, per backend                   |

The last two are ownership bookkeeping, and they are what make the reconciliation safe: they let the package tell a value it still owns from one you have changed since.

### Why configuration goes into the database, not the environment

Since 0.10, Open WebUI reads a PersistentConfig key from the environment **only when no row exists for it yet**. After the first launch the stored row wins for good. An environment variable is therefore a one-shot seed and never an override — so anything this package has to be able to change later has to be written into `webui.db` instead.

That splits the settings into three groups:

**Environment, re-read every launch** — the session secret, permissive CORS, and three switches held off: the version-update check, admin analytics, and insecure session cookies.

**Seeded once at install** and yours from then on: both backend types start disabled, the OpenAI provider arrays start empty, community sharing is off, and the search engine is set to SearXNG. Upstream defaults both backend types to enabled, which would have Open WebUI dialling backends nobody selected. The empty arrays matter for a subtler reason: with no OpenAI base URL in the environment, upstream substitutes its own hosted endpoint and stores that, which would then show up as a pre-filled provider on every fresh install.

**Reconciled on every start** — currently the SearXNG web-search endpoint. Its correct value changes under you when SearXNG is installed, or when its assigned bridge port moves, so the package re-asserts it. **A value you have changed by hand is never overwritten**; instead the package raises a task rather than fighting you for the key.

## Dependencies

Five optional packages, and **which ones are declared follows what is actually wired up** rather than what is installed.

| Dependency    | Role                                                   |
| ------------- | ------------------------------------------------------ |
| `ollama`      | Local LLMs over Ollama's native API                    |
| `vllm`        | Local LLMs over an OpenAI-compatible API               |
| `llama-cpp`   | Local GGUF models over an OpenAI-compatible API        |
| `maple-proxy` | Maple's privacy-preserving OpenAI-compatible inference |
| `searxng`     | A self-hosted web-search backend                       |

A backend becomes a `running` dependency the moment you select it in Configure Backends, and stops being one when you deselect it. Nothing here is required, and Open WebUI runs perfectly well pointed only at a remote provider you configure yourself.

**Addresses are resolved over the LXC bridge and repaired when they move.** A backend install, uninstall, or port change re-runs the package's setup and heals the stored URL with a single restart; a routine dependency update, where the assigned port does not change, restarts nothing.

**Ownership is decided per array entry, not per setting.** Open WebUI keeps all OpenAI-compatible providers in one list, mixing this package's entries with any you add by hand — and several backends share the same bridge host, differing only by port, so nothing about a URL identifies it. `managedBackendUrls` is what attributes each one. An entry the package has no record for is claimed only if it already matches the resolved address, so an older install starts healing from the next Configure Backends run rather than having a guess imposed on it.

## Network Access and Interfaces

One interface, serving the chat UI and Open WebUI's API.

| Interface | Id   | Type | Port | Description                     |
| --------- | ---- | ---- | ---- | ------------------------------- |
| Web UI    | `ui` | ui   | 8080 | The web interface of Open WebUI |

The port is bound on the `ui-multi` MultiHost and is not masked.

## Installation and First-Run Flow

**Install runs Open WebUI once, to completion, before the service ever starts.** Only that first launch creates `webui.db` and its schema — the migrations run at import and the config table is seeded straight after — so doing it during install is what lets every later write assume the table is there, with no first-run branching anywhere else in the package.

It is allowed ten minutes: a fresh database plus the embedding model load is slow on a slow disk. Failing that fails the install and rolls it back, which is the right outcome, because everything downstream assumes this boot happened.

No credential is shown. **The first account created in the web UI becomes the administrator**, and nothing else is required — though a fresh install has no LLM backend connected, so the first thing to do is run Configure Backends.

## Actions

Three actions, all available whether or not the service is running.

### Configure Backends

Selects which LLM backends Open WebUI connects to — the installed StartOS ones, and any OpenAI-compatible provider you add by hand.

- **What it changes:** the backend URL and key arrays in `webui.db`, the enable flags derived from them, the package's dependencies, and the ownership records in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent. Deselecting a backend removes this package's entry for it; providers you added yourself are left alone.
- **Keys are handled per backend.** Some publish a credential the package can read; others get a non-empty placeholder, because Open WebUI rejects an empty key field — replace it if the provider needs a real one.

### Reconnect SearXNG

Points web search back at SearXNG and resumes maintaining the address.

- **When to run it:** the search address was changed by hand and Open WebUI stopped keeping it current. This is what the task below asks for.
- **What it changes:** the search endpoint in `webui.db`, and the ownership record that makes the package own it again.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent, and it touches nothing else.

### Reset Admin Password

Generates a new password for the admin account. Run it when locked out.

- **Cost:** seconds.
- **Repeat safety:** safe to re-run; each run generates a fresh password.
- **Outputs:** the new password. It is not recoverable afterwards.

## Tasks

One task, and it is raised by a condition rather than at install.

| Task              | Severity    | Raised when                                                  | Cleared when                                                               |
| ----------------- | ----------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Reconnect SearXNG | `important` | The stored search address is one this server does not manage | The action runs, SearXNG is uninstalled, or the value is corrected by hand |

This is the visible half of the never-overwrite rule: rather than reclaim a key you have edited, the package tells you the address may not reach SearXNG and offers to restore it. It clears itself on every exit, not only through the action.

## Health Checks

One check, on the only daemon.

| Check     | Displayed       | Method                          | Grace |
| --------- | --------------- | ------------------------------- | ----- |
| `primary` | "Web Interface" | `GET /health` on the local port | 2 min |

**It is a request rather than a port probe, deliberately.** uvicorn binds the socket well before the FastAPI app finishes starting, so a port check would report ready while the app is still coming up. `/health` flips only when it is actually serving.

The two minutes of grace covers the model load. A failure after that is the app — most often a backend it cannot reach or a configuration value it rejects, both named in the service logs.

## Backups and Restore

Both volumes are copied wholesale — `sdk.Backups.ofVolumes('open-webui', 'startos')`. No dump step and nothing excluded.

- **Included:** `webui.db` with every account, chat, and setting; uploaded documents and the vector store; the model cache; and `store.json` with the session secret and the ownership records.
- **Size:** the model cache alone is a few hundred megabytes, and grows with each model Open WebUI downloads.
- **Restore:** complete, and sessions survive because the secret does. Backend addresses are re-resolved on the first start, so a backend that now sits on a different port is repaired rather than left broken.

## Limitations and Differences

1. **Environment variables cannot change a setting after the first launch.** Upstream reads PersistentConfig keys from the environment only while no row exists, which is why this package writes to `webui.db`.
2. **Both backend types start disabled** and the provider list starts empty, unlike upstream.
3. **A setting you change by hand is never overwritten** — the package raises a task instead.
4. **Community sharing, the version-update check, and admin analytics are off.**
5. **The first account created is the administrator**, and no credential is generated for you.
6. **Web search requires SearXNG installed and enabled** in Open WebUI's own admin panel; installing it is not enough on its own.
7. **No riscv64 build.** x86_64 and aarch64 only.

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
  - open-webui-bootstrap # temporary; install-time first boot
  - webui-model-seed # temporary; seeds the baked model cache onto the volume
volumes:
  open-webui: /app/backend/data
  startos: host side (store.json)
file_models:
  - store.json # Open WebUI's own config lives in webui.db, not a file
startos_managed_env_vars:
  - WEBUI_SECRET_KEY
  - CORS_ALLOW_ORIGIN
  - ENABLE_VERSION_UPDATE_CHECK
  - ENABLE_ADMIN_ANALYTICS
  - WEBUI_SESSION_COOKIE_SECURE
dependencies: # all optional; declared only while selected in Configure Backends
  - ollama
  - vllm
  - llama-cpp
  - maple-proxy
  - searxng
interfaces:
  ui: { type: ui, port: 8080 }
actions:
  - configure-backends
  - reconnect-searxng
  - reset-password
tasks:
  - { action: reconnect-searxng, severity: important } # conditional, not install-time
health_checks:
  - primary # displayed "Web Interface"; GET /health
```
