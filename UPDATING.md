# Updating the upstream version

Open WebUI ships as a thin security wrapper around the prebuilt GHCR image. Production pins live in `Dockerfile`; the manifest uses `dockerBuild`.

## Determining the upstream version

- **Open WebUI** — https://github.com/open-webui/open-webui

  List GitHub tags and select the newest stable version, not the release marked Latest:

  ```sh
  gh api 'repos/open-webui/open-webui/tags?per_page=100' --jq '.[].name'
  ```

  Read the release notes for the bumped range. Database schema changes require major scrutiny even for a patch release; upstream runs its own migrations.

  Verify the exact GHCR tag and its index digest resolve for both amd64 and arm64 before updating the final `FROM` in `Dockerfile`:

  ```sh
  docker buildx imagetools inspect ghcr.io/open-webui/open-webui:<version>
  ```

## Security runtime pins

- **Node.js** — the first `FROM` selects the official matching-architecture Node binary. Keep a supported Node 24 release at least 24.22.1 for CVE-2026-111497, and update its digest and test expectations. The build check enforces the security floor. Do not replace only system Node or the upstream frontend build stage: Python Playwright invokes its bundled `driver/node`. Retain Playwright and its browser protocol unless deliberately testing an upstream upgrade.
- **pip** — the runtime interpreter `/usr/local/bin/python` must match upstream `start.sh`'s `python3`; plugin requirements use `sys.executable -m pip`. Keep its pip vendored certifi at least 2026.10.19 for CVE-2026-91403, not merely the separately installed application certifi. Current pip 26.3 vendors certifi 2026.10.23. Bootstrap pip through verified system trust, and preserve build checks for the exact compromised G3 fingerprint. This wrapper makes no browser-root-store remediation claim.

Inspect the new image's actual interpreter/driver paths and runtime versions, including pip trust, before adjusting these pins. Update `startos/versions/current.ts`, relevant README details and focused regression expectations. Run `make test-security` for amd64 and arm64 through `helix-build`; browser installation in this recipe is disposable and follows Playwright's pinned revision. Full package builds remain in CI.
