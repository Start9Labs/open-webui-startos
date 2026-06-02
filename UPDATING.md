# Updating the upstream version

Open WebUI ships as a single prebuilt image from GHCR. There is one upstream pin to track.

## Determining the upstream version

- **Open WebUI** — https://github.com/open-webui/open-webui

  Latest GitHub release (the canonical source — GHCR tags are published from these):

  ```sh
  gh release view -R open-webui/open-webui --json tagName -q .tagName
  ```

  Cross-check against the GHCR-mirrored tags on Docker Hub (image is also published to `ghcr.io/open-webui/open-webui`, which the manifest pulls from):

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/openwebui/open-webui/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  Pin lives in `startos/manifest/index.ts` at `images['open-webui'].source.dockerTag` (currently `ghcr.io/open-webui/open-webui:0.9.6`).

## Applying the bump

- **`startos/manifest/index.ts`** — set `dockerTag` to `ghcr.io/open-webui/open-webui:<new version>` (use the release tag without any leading `v`).
