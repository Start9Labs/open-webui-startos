# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The install-time bootstrap boot is what creates `webui.db` and its schema.** Doing it once during init is what lets every later write assume the config table exists — which is why neither `setupMain` nor Configure Backends carries first-run branching. Failing it fails the install, and that is correct.
- **Seed `openai.api_base_urls`/`api_keys` as empty arrays, not absent.** With no `OPENAI_API_BASE_URL(S)` set, upstream splits an empty string and rewrites the blank entry to its own hosted endpoint, so `seed_defaults` stores that URL. It then reads back as a user-added provider, and Configure Backends derives `openai.enable` from the URL count — so any later run would enable the OpenAI API against a keyless endpoint.
- **Backend URL ownership is per array entry.** Several backends share the `10.0.3.1` bridge host and differ only by assigned port, so nothing in the URL itself attributes it; only the recorded value does. Rewrite in place so `openai.api_keys` stays index-aligned with `openai.api_base_urls`.
- **The model cache must be seeded before the daemon starts.** The image bakes ~265 MB into `/app/backend/data/cache`, which the volume mount hides entirely — without the copy, Whisper and tiktoken are re-fetched from HuggingFace on first use. `cp -an` is what makes it safe to re-run.
- **The health check must be `/health`, not a port probe.** uvicorn binds the socket before FastAPI finishes its lifespan startup, so a port check reports ready while the app is still coming up.
- **`KNOWN_BACKENDS` in `backends.ts` is the single source of truth.** Adding a compatible service is one entry there plus a manifest dependency; the action, the dependency wiring, and the state sync all derive from it.
