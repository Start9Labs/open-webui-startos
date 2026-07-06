# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `open-webui`.** One `ui` interface on port 8080 (the `ui-multi` MultiHost); nothing is exported for dependents.
- **AI backends are optional dependencies wired through the app's own DB, not env overrides.** `startos/backends.ts` is the single source of truth for the compatible backends (Ollama, vLLM, llama.cpp, Maple Proxy) — the Configure Backends action, `setupDependencies`, and `setupMain`'s key re-sync all derive from it. Adding a backend is a one-line addition there.
- **Backends are reached over the local service bridge** (`10.0.3.1:<assigned external port>`), resolved reactively through the `bridgeAddress` helper in `startos/utils.ts` — never `<pkg>.startos` overlay DNS. `startos/backends.ts`'s `resolveBaseUrls` builds an `id → base URL` map from each dependency's exported host-id/port consts (imported via the `github:…#next` pins in `package.json`); `main.ts` and `setDependencies` resolve with `.const()` (a backend install/uninstall/port-change heals with one restart, a dep update causes none), the Configure Backends action with `.once()`. The resolved URL doubles as the match key written to `webui.db`, so `deriveView` matches against the freshly resolved address — a backend that is uninstalled or lands on a new port stops matching until reconnected via Configure Backends.
- **`webui.db` is the config source of truth, read/written via a temp `open-webui` SubContainer running `python3`** (`startos/webuiConfig.ts`): Open WebUI's PersistentConfig keys live in the SQLite `config` blob, and its admin UI writes back to the same blob, so values stay in 2-way sync without env-var overrides. Config writes are gated on an admin account already existing (`adminExists`, issue #15) — writing the `config` table before onboarding corrupts it.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach open-webui -n open-webui-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `open-webui-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
