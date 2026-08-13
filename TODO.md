# TODO

## Remove the stranded-endpoint repair, and `searxng.startos` with it

`managedConfig.ts`'s `isStranded`, `aimedAtUs`, and `hostnameOf` only repair
installs predating `0.11.0:1`'s ownership bookkeeping. The repair claims the key
as it goes, so it fires at most once per install and becomes dead code once
those installs have all started under a version carrying it.

**When:** a couple of releases after `0.11.0:2` is in prod, with no further
reports of web search stuck on a hand-edited address.

**Remove:** `isStranded`, `hostnameOf`, `aimedAtUs` and its SearXNG
implementation, and the second condition in `reconcileManagedConfig`'s decline
branch — leaving `isOurs` the sole ownership test.

**Keep:** the Reconnect SearXNG action and its task. Those are the permanent
recovery for a deliberate hand edit; `isOurs` stays one-way regardless.

Update the reconciled-policy exception in `README.md` and the
no-ownership-record bullet in `AGENTS.md` in the same change.
