FROM node:24.22.1-bookworm-slim@sha256:be8204d4bd327363357f532187b752ff62759c31bedf98e9e18fc08c9cbd605c AS node
FROM ghcr.io/open-webui/open-webui:0.13.4@sha256:d5168bfbc28609eff5bea1b438dd864cf64d185cf6582c02244865e18385b901

# Patch Python Playwright's bundled executable, not system or frontend Node.
RUN --mount=from=node,source=/usr/local/bin/node,target=/tmp/playwright-node \
    /usr/local/bin/python - <<'PY'
import shutil
import subprocess
from playwright._impl._driver import compute_driver_executable

node, _ = compute_driver_executable()
shutil.copy('/tmp/playwright-node', node)
version = subprocess.check_output([node, '--version'], text=True).strip()
assert tuple(map(int, version.removeprefix('v').split('.'))) >= (24, 22, 1), version
PY

# Plugin requirements use this interpreter's pip, including its vendored certifi.
# Bootstrap through system trust without pip's stale vendored roots.
RUN /usr/local/bin/python -m pip --isolated install --no-cache-dir --upgrade \
    --use-deprecated=legacy-certs --cert /etc/ssl/certs/ca-certificates.crt 'pip==26.3'

RUN /usr/local/bin/python - <<'PY'
import hashlib
import re
import ssl
from pip._vendor import certifi

for bundle in (certifi.where(), ssl.get_default_verify_paths().cafile):
    certs = re.findall(r'-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----', open(bundle).read(), re.S)
    assert certs
    assert all(hashlib.sha256(ssl.PEM_cert_to_DER_cert(cert)).hexdigest() !=
               '86a1ecba089c4a8d3bbe2734c612ba341d813e043cf9e8a862cd5c57a36bbe6b' for cert in certs), bundle
PY
