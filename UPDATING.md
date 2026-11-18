# Updating the upstream version

Open WebUI ships as a prebuilt GHCR image extended by two carried fixes: Python Playwright's private Node and the application's pip. Each retires when the selected upstream image includes its fix.

## Determining the upstream version

- **Open WebUI** — https://github.com/open-webui/open-webui/releases

  ```sh
  gh release list -R open-webui/open-webui --limit 20
  docker buildx imagetools inspect ghcr.io/open-webui/open-webui:<version>
  ```

  Select a stable release and resolve its multi-architecture index digest for amd64 and arm64. Read the bumped range's release notes; database changes need major scrutiny even in a patch release. Both carried fixes target `/usr/local/bin/python`; retarget them if upstream's `backend/start.sh` changes interpreters.

- **Node.js** — https://nodejs.org/dist/index.json

  Select the newest patched release in the major bundled by the new image's Playwright. Upstream's requirements identify Playwright; its driver build identifies Node:

  ```sh
  curl -fsSL "https://raw.githubusercontent.com/open-webui/open-webui/v<version>/backend/requirements.txt" | grep '^playwright=='
  curl -fsSL "https://raw.githubusercontent.com/microsoft/playwright/v<playwright>/utils/build/build-playwright-driver.sh" | grep 'NODE_VERSION='
  ```

  The replacement retires once no newer release of that major marked `"security": true` remains in the Node index. The image build rejects a replacement that changes the major or is not strictly newer than the bundled runtime.

- **pip** — https://pypi.org/project/pip/

  Select the newest pip whose vendored certifi (listed in `src/pip/_vendor/vendor.txt` at its release tag) excludes emSign ECC Root CA - G3. Certifi 2026.10.19 or later does. Retire this override once the new image's own pip vendors fixed trust:

  ```sh
  docker run --rm --entrypoint python ghcr.io/open-webui/open-webui:<version> -c 'import pip; from pip._vendor import certifi; print(pip.__version__, certifi.__version__)'
  ```

## Applying the bump

- Set the final `FROM` in `Dockerfile` to the selected Open WebUI tag and index digest.
- Set the `node` stage to the selected matching-major Node tag and index digest. Its executed version is the replacement authority; the build guard compares both runtimes before copying and verifies the copy.
- Update the `pip==` pin, retaining verified-system-trust bootstrap and the G3 build checks.

Remove each override's steps once it retires. When both retire, remove `Dockerfile` and return `images['open-webui'].source` in `startos/manifest/index.ts` to the upstream `dockerTag`, retaining the selected tag and digest.
