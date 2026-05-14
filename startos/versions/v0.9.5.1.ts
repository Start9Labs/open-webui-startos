import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_5_1 = VersionInfo.of({
  version: '0.9.5:1',
  releaseNotes: {
    en_US: `**Bumps**

- Open WebUI → 0.9.5 (redirect-based SSRF protection, iframe CSP, granular markdown rendering controls, channel streaming with tool support, plus security fixes and assorted UI/performance improvements)
- start-sdk → 1.5.0`,
    es_ES: `**Cambios de versión**

- Open WebUI → 0.9.5 (protección contra SSRF basada en redirecciones, CSP para iframes, controles granulares de renderizado de Markdown, transmisión en canales con compatibilidad de herramientas, además de correcciones de seguridad y diversas mejoras de UI/rendimiento)
- start-sdk → 1.5.0`,
    de_DE: `**Versionsupdates**

- Open WebUI → 0.9.5 (Schutz vor weiterleitungsbasierten SSRF-Angriffen, Iframe-CSP, granulare Steuerung des Markdown-Renderings, Channel-Streaming mit Tool-Unterstützung sowie Sicherheits-Fixes und verschiedene UI-/Performance-Verbesserungen)
- start-sdk → 1.5.0`,
    pl_PL: `**Aktualizacje wersji**

- Open WebUI → 0.9.5 (ochrona przed SSRF opartą o przekierowania, CSP dla iframe’ów, szczegółowa kontrola renderowania Markdown, strumieniowanie kanałów z obsługą narzędzi oraz poprawki bezpieczeństwa i różne usprawnienia UI/wydajności)
- start-sdk → 1.5.0`,
    fr_FR: `**Mises à jour**

- Open WebUI → 0.9.5 (protection contre les SSRF basées sur les redirections, CSP des iframes, contrôles granulaires du rendu Markdown, streaming des canaux avec prise en charge des outils, plus des correctifs de sécurité et diverses améliorations UI/performances)
- start-sdk → 1.5.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
