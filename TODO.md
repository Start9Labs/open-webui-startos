# TODO

- Consider moving the backend connection keys (`ollama.base_urls`,
  `openai.api_base_urls`, `openai.api_keys`) from the Configure Backends action
  onto `managedConfig.ts`'s `reconciled` policy. They have the same failure mode
  the SearXNG endpoint had — a dependency whose assigned bridge port moves goes
  stale until the user re-runs the action — but they are user-ordered arrays
  mixing managed and custom providers, so the ownership check has to work
  per-entry rather than on a whole scalar value.
