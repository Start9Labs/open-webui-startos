# TODO

## Remove the stranded-endpoint repair, and `searxng.startos` with it

`startos/managedConfig.ts`'s `isStranded`, `aimedAtUs`, and `hostnameOf` exist
only to repair installs predating `0.11.0:1`'s ownership bookkeeping — the ones
the blank-address bug could leave with a hand-typed SearXNG endpoint. The
`searxng.startos` hostname inside `aimedAtUs` is the most transitional part of
it: it is a guess at what someone typed into the admin form, and it names the
overlay DNS address this package otherwise tells you never to use.

The repair is self-limiting. It claims the key on the way through, so it fires
at most once per install, and it becomes dead code once every pre-`0.11.0:1`
install has started at least once under a version carrying it.

**When:** a couple of releases after `0.11.0:2` has been in prod, with no
further reports of web search stuck on a hand-edited address.

**What to remove:** `isStranded`, `hostnameOf`, the `aimedAtUs` field on
`Reconciled` and its SearXNG implementation, and the second condition in
`reconcileManagedConfig`'s decline branch — leaving `isOurs` the sole ownership
test, and every non-matching value declined.

**What to keep:** the Reconnect SearXNG action and the task `setupMain` raises
for it. Those are the permanent recovery for a deliberate hand edit, not part
of this migration — `isOurs` stays one-way whatever happens here.

Update the reconciled-policy exception paragraph in `README.md` and the
no-ownership-record bullet in `AGENTS.md` in the same change.
