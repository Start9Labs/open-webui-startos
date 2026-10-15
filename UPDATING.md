# Updating the upstream version

Open WebUI ships as a single prebuilt image from GHCR. There is one upstream pin to track.

## Determining the upstream version

- **Open WebUI** — https://github.com/open-webui/open-webui

  List GitHub tags and select the newest stable version, not the release marked Latest:

  ```sh
  gh api 'repos/open-webui/open-webui/tags?per_page=100' --jq '.[].name'
  ```

  Read the release notes for the bumped range. Database schema changes require major scrutiny even for a patch release; upstream runs its own migrations.

  Verify the exact GHCR image tag resolves for both amd64 and arm64 before pinning it (replace `<version>` with the selected tag without its leading `v`):

  ```sh
  docker manifest inspect ghcr.io/open-webui/open-webui:<version>
  ```

  Docker Hub also mirrors these images:

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/openwebui/open-webui/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  Pin lives in `startos/manifest/index.ts` at `images['open-webui'].source.dockerTag`.

## Applying the bump

- **`startos/manifest/index.ts`** — set `dockerTag` to `ghcr.io/open-webui/open-webui:<new version>` (use the release tag without any leading `v`).
