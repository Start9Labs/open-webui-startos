import hashlib
import http.server
import importlib.metadata
import re
import ssl
import subprocess
import sys
import threading
import unittest
from pathlib import Path
from unittest.mock import patch

from pip._internal.commands import create_command
from pip._vendor import certifi
from playwright._impl._driver import compute_driver_executable
from playwright.sync_api import sync_playwright


G3 = '86a1ecba089c4a8d3bbe2734c612ba341d813e043cf9e8a862cd5c57a36bbe6b'


def fingerprints(bundle):
    certs = re.findall(
        r'-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----',
        Path(bundle).read_text(),
        re.S,
    )
    return {hashlib.sha256(ssl.PEM_cert_to_DER_cert(cert)).hexdigest() for cert in certs}


class RuntimeSecurity(unittest.TestCase):
    def test_runtime_interpreter_and_driver(self):
        self.assertEqual(Path(sys.executable).resolve(), Path('/usr/local/bin/python3').resolve())
        self.assertEqual(importlib.metadata.version('playwright'), '1.60.0')
        node, cli = compute_driver_executable()
        self.assertEqual(Path(node).parent, Path(cli).parent.parent)
        self.assertEqual(subprocess.check_output([node, '--version'], text=True).strip(), 'v24.22.1')
        print(f'Python: {sys.executable} {sys.version}; Playwright: 1.60.0; driver: {node} v24.22.1')

    def test_runtime_pip_trust(self):
        self.assertEqual(importlib.metadata.version('pip'), '26.3')
        self.assertEqual(certifi.__version__, '2026.10.23')
        command = create_command('install')
        options, _ = command.parse_args([])
        self.assertFalse(options.trusted_hosts)
        with patch('pip._internal.cli.index_command.certifi.where', wraps=certifi.where) as selected_bundle:
            with command._build_session(options) as session:
                self.assertIs(session.verify, True)
                settings = session.merge_environment_settings('https://pypi.org', {}, None, None, None)
                self.assertIs(settings['verify'], True)
                context = session.adapters['https://'].poolmanager.connection_pool_kw['ssl_context']
                self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
                self.assertTrue(context.check_hostname)
            selected_bundle.assert_called_once_with()
        for bundle in (certifi.where(), ssl.get_default_verify_paths().cafile):
            roots = fingerprints(bundle)
            self.assertGreater(len(roots), 100)
            self.assertNotIn(G3, roots)
            self.assertIn('40f6af0346a99aa1cd1d555a4e9cce62c7f9634603ee406615833dc8c8d00367', roots)
            print(f'pip trust: {bundle}; {len(roots)} roots; G3 absent')
        print(subprocess.check_output([sys.executable, '-m', 'pip', '--version'], text=True).strip())

    def test_driver_brotli_and_browser(self):
        node, _ = compute_driver_executable()
        body = b'<title>security-runtime</title><script>document.title += "-ok"</script>'
        compressed = subprocess.check_output(
            [node, '-e', 'process.stdout.write(require("node:zlib").brotliCompressSync(Buffer.from(process.argv[1])))', body.decode()],
        )

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.send_header('Content-Encoding', 'br')
                self.end_headers()
                self.wfile.write(compressed)

            def log_message(self, *_):
                pass

        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever)
        thread.start()
        try:
            with sync_playwright() as playwright:
                request = playwright.request.new_context()
                response = request.get(f'http://127.0.0.1:{server.server_port}')
                self.assertEqual(response.body(), body)
                request.dispose()
                with playwright.chromium.launch(args=['--no-sandbox']) as browser:
                    page = browser.new_page()
                    page.goto(f'http://127.0.0.1:{server.server_port}')
                    self.assertEqual(page.title(), 'security-runtime-ok')
                    print(f'Browser: Chromium {browser.version}; launch, navigation and JavaScript passed; driver Brotli decode passed')
        finally:
            server.shutdown()
            server.server_close()
            thread.join()


if __name__ == '__main__':
    unittest.main(verbosity=2)
