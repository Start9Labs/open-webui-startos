import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.4:1',
  releaseNotes: {
    en_US:
      'Fixes security flaws in the Playwright web loader. Installing requirements for tools and functions no longer trusts the compromised emSign ECC Root CA - G3 (CVE-2026-91403).',
    es_ES:
      'Corrige fallos de seguridad en el cargador web Playwright. La instalación de requisitos de herramientas y funciones ya no confía en la raíz comprometida emSign ECC Root CA - G3 (CVE-2026-91403).',
    de_DE:
      'Behebt Sicherheitslücken im Playwright-Web-Loader. Beim Installieren von Tool- und Funktionsabhängigkeiten wird der kompromittierten emSign ECC Root CA - G3 nicht mehr vertraut (CVE-2026-91403).',
    pl_PL:
      'Naprawia luki bezpieczeństwa w module ładowania stron Playwright. Instalowanie zależności narzędzi i funkcji nie ufa już skompromitowanemu emSign ECC Root CA - G3 (CVE-2026-91403).',
    fr_FR:
      "Corrige des failles de sécurité du chargeur web Playwright. L'installation des dépendances des outils et fonctions ne fait plus confiance à la racine compromise emSign ECC Root CA - G3 (CVE-2026-91403).",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
