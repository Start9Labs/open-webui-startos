<p align="center">
  <img src="icon.svg" alt="Project Logo" width="21%">
</p>

# Open WebUI for StartOS

> **Upstream docs:** <https://docs.openwebui.com/>
>
> Everything not listed in this document should behave the same as upstream
> Open WebUI. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Open WebUI](https://github.com/open-webui/open-webui) is an extensible, self-hosted AI interface that connects to Ollama for running local LLMs. This repository packages it for [StartOS](https://github.com/Start9Labs/start-os).

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

On install, StartOS auto-generates a `WEBUI_SECRET_KEY` and stores it in `store.json`. The app is ready to use immediately — open the web UI and register your admin account.

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

| Action | Description |
|--------|-------------|
| Reset Admin Password | Generates a new random password for the admin user |

## Dependencies

| Dependency | Requirement | Health Checks | Description |
|------------|-------------|---------------|-------------|
| Ollama | Running (`>=0.18.0`) | primary | Required LLM backend |

Ollama must be installed and running. Open WebUI automatically connects to it at `http://ollama.startos:11434`.

## Backups and Restore

**Included in backup:**

- `open-webui` volume — Application data, chat history, user accounts, SQLite database
- `startos` volume — Secret key

**Restore behavior:**

- All data, accounts, and chat history are restored
- No reconfiguration needed

## Health Checks

| Check | Method | Success Condition | Grace Period |
|-------|--------|-------------------|--------------|
| Web Interface | Port listening | Port 8080 responds | 2 minutes |

The extended grace period accounts for Open WebUI's initialization time.

## Limitations and Differences

1. **Ollama required**: Cannot run without Ollama; external OpenAI-compatible APIs can be configured through the UI but Ollama dependency is mandatory
2. **No GPU acceleration**: Performance depends on StartOS hardware; large models may be slow
3. **Model downloads**: Must download models through Ollama, not directly in Open WebUI

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

## Quick Reference (YAML)

```yaml
package_id: open-webui
containers:
  - name: open-webui
    image: ghcr.io/open-webui/open-webui

volumes:
  open-webui:
    mountpoint: /app/backend/data
    purpose: app data, chat history, SQLite database
  startos:
    purpose: store.json (WEBUI_SECRET_KEY)

interfaces:
  ui:
    type: ui
    port: 8080

actions:
  - reset-password: Reset Admin Password

dependencies:
  ollama:
    required: true
    kind: running
    version: ">=0.18.0"
    health_checks:
      - primary

auto_configure:
  - OLLAMA_BASE_URL: http://ollama.startos:11434
  - WEBUI_SECRET_KEY: auto-generated
  - CORS_ALLOW_ORIGIN: "*"
  - ENABLE_VERSION_UPDATE_CHECK: false
  - ENABLE_COMMUNITY_SHARING: false
  - ENABLE_ADMIN_ANALYTICS: false
  - WEBUI_SESSION_COOKIE_SECURE: true

health_checks:
  - name: Web Interface
    method: port_listening
    port: 8080
    grace_period: 120000

backup_volumes: [open-webui, startos]
```
