# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (the package's technical reference — the only one an AI support or administering agent reads) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Adding a backend is a one-line addition to `KNOWN_BACKENDS` in `startos/backends.ts`.** That array is the single source of truth — the Configure Backends action, `setupDependencies`, and `syncBackendState` all derive from it. Don't wire a backend in anywhere else.
- **Never add a `PersistentConfig` variable to `daemonEnv`.** It will appear to work and then silently stop applying after the first launch. Config that Open WebUI persists goes in `startos/managedConfig.ts`; `daemonEnv` is only for variables the app re-reads every start. `README.md` § File Models has the mechanism.
- **`reclaimManagedConfig` is the one caller allowed to bypass `isOurs`, and only because a user explicitly asked.** Don't call it from `setupMain` or `init` — that defeats the ownership rule it exists alongside. It also reclaims _every_ reconciled key while being named for the only one that exists, so adding a second reconciled key means revisiting the action's name, its SearXNG-specific guard, and the task condition in `main.ts` together.
- **`isStranded` is transitional.** It repairs keys with no ownership record, which can only exist on installs predating `0.11.0:1`. Don't widen it to values we _do_ have a record for — that is the ownership rule, not a gap in it. `TODO.md` tracks its removal.
- **Check what an image path already holds before mounting a volume over it.** `mainMounts` covers `/app/backend/data`, which the image ships populated; the mount hides whatever is there, and recovering it costs an install step. Any new mount deserves the same look.
