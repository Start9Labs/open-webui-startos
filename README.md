<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Open WebUI for StartOS

This repository packages [Open WebUI](https://github.com/open-webui/open-webui) for StartOS. This document describes what makes this package different from a default Open WebUI deployment.

For general Open WebUI usage and features, see the [upstream documentation](https://docs.openwebui.com/).

## How This Differs from Upstream

This package pre-configures Open WebUI to connect to the Ollama service on StartOS. Ollama is a required dependency and must be running for Open WebUI to function. All other configuration is done through the Open WebUI interface.

## Container Runtime

This package runs **1 container**:

| Container | Image | Purpose |
|-----------|-------|---------|
| open-webui | `ghcr.io/open-webui/open-webui:0.7.2` | Web UI and AI platform |

## Volumes

| Volume | Contents | Backed Up |
|--------|----------|-----------|
| `main` | Application data, user settings, chat history | Yes |

Mounted at `/app/backend/data` inside the container.

## Configuration Management

### Auto-Configured Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `OLLAMA_BASE_URL` | `ollama.startos` | Connection to Ollama service |

### User-Configurable Settings

All other configuration is done through the Open WebUI web interface:
- User accounts and authentication
- Model selection and parameters
- RAG (Retrieval Augmented Generation) settings
- API connections (OpenAI-compatible, etc.)
- System prompts and presets

## Network Interfaces

| Interface | Type | Port | Description |
|-----------|------|------|-------------|
| Web UI | ui | 8080 | Main Open WebUI interface |

## Actions

None. All configuration is done through the web interface.

## Dependencies

| Dependency | Requirement | Health Checks | Description |
|------------|-------------|---------------|-------------|
| Ollama | Running, >=0.13.5 | primary | Required LLM backend |

Ollama must be installed and running. Open WebUI automatically connects to it at `ollama.startos`.

## Backups

All data is backed up:
- `main` volume - user data, chat history, settings, uploaded documents

## Health Checks

| Check | Method | Success Condition | Grace Period |
|-------|--------|-------------------|--------------|
| Web Interface | Port listening | Port 8080 responds | 2 minutes |

The extended grace period accounts for Open WebUI's initialization time.

## Limitations

1. **Ollama required**: Cannot run without Ollama; external OpenAI-compatible APIs can be configured through the UI but Ollama dependency is mandatory
2. **No GPU acceleration**: Performance depends on StartOS hardware; large models may be slow
3. **Model downloads**: Must download models through Ollama, not directly in Open WebUI

## What's Unchanged

- Full Open WebUI feature set
- User authentication and multi-user support
- Chat interface and conversation history
- RAG capabilities with document upload
- Model parameter customization
- OpenAI-compatible API configuration (via web UI)
- Plugin/extension support

---

## Quick Reference (YAML)

```yaml
package_id: open-webui
upstream_version: 0.7.2
containers:
  - name: open-webui
    image: ghcr.io/open-webui/open-webui:0.7.2

volumes:
  main:
    backup: true
    mountpoint: /app/backend/data

interfaces:
  ui:
    type: ui
    port: 8080

actions: []

dependencies:
  ollama:
    required: true
    kind: running
    version: ">=0.13.5"
    health_checks:
      - primary

auto_configure:
  - OLLAMA_BASE_URL: ollama.startos

health_checks:
  - name: Web Interface
    method: port_listening
    port: 8080
    grace_period: 120000
```
