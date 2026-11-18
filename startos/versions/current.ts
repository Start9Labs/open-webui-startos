import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.4:1',
  releaseNotes: {
    en_US: `Security update; Open WebUI remains at 0.13.4.

- Updated Python Playwright's bundled Node.js to 24.22.1, fixing CVE-2026-111497 without changing Playwright or browser versions.
- Updated runtime pip to 26.3. Its vendored certifi no longer trusts the compromised emSign ECC Root CA - G3 (CVE-2026-91403) when installing tool/function requirements. This does not update browser certificate stores.`,
    es_ES: `Actualización de seguridad; Open WebUI sigue en 0.13.4.

- Node.js incluido en Playwright para Python actualizado a 24.22.1 para corregir CVE-2026-111497, sin cambiar Playwright ni las versiones del navegador.
- pip actualizado a 26.3. Su certifi integrado ya no confía en la raíz comprometida emSign ECC Root CA - G3 (CVE-2026-91403) al instalar requisitos de herramientas y funciones. No se actualizan los almacenes de certificados del navegador.`,
    de_DE: `Sicherheitsupdate; Open WebUI bleibt auf 0.13.4.

- Das in Python Playwright enthaltene Node.js wurde auf 24.22.1 aktualisiert und behebt CVE-2026-111497, ohne Playwright oder Browserversionen zu ändern.
- pip wurde auf 26.3 aktualisiert. Das enthaltene certifi vertraut beim Installieren von Tool-/Funktionsabhängigkeiten nicht mehr der kompromittierten emSign ECC Root CA - G3 (CVE-2026-91403). Browser-Zertifikatsspeicher bleiben unverändert.`,
    pl_PL: `Aktualizacja zabezpieczeń; Open WebUI pozostaje w wersji 0.13.4.

- Node.js dołączony do Playwright dla Pythona zaktualizowano do 24.22.1, naprawiając CVE-2026-111497 bez zmiany wersji Playwright ani przeglądarki.
- pip zaktualizowano do 26.3. Dołączony certifi nie ufa już przejętemu emSign ECC Root CA - G3 (CVE-2026-91403) podczas instalowania zależności narzędzi i funkcji. Magazyny certyfikatów przeglądarki pozostają bez zmian.`,
    fr_FR: `Mise à jour de sécurité ; Open WebUI reste en version 0.13.4.

- Node.js intégré à Playwright pour Python passe à 24.22.1 pour corriger CVE-2026-111497, sans changer Playwright ni les versions du navigateur.
- pip passe à 26.3. Son certifi intégré ne fait plus confiance à la racine compromise emSign ECC Root CA - G3 (CVE-2026-91403) lors de l'installation des dépendances des outils et fonctions. Les magasins de certificats du navigateur restent inchangés.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
