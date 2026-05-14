import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_5_1 = VersionInfo.of({
  version: '0.9.5:1',
  releaseNotes: {
    en_US: `**Bumps**

- Open WebUI → 0.9.5

**Notable upstream changes**

- Outbound 3xx redirects are now blocked by default across web fetch, image loading, OAuth discovery, and tool servers as defense against redirect-based SSRF; re-enable with the upstream \`AIOHTTP_CLIENT_ALLOW_REDIRECTS\` setting if needed.
- The signout endpoint now requires POST instead of GET. Custom clients and integrations may need to update logout calls.
- 0.9.3 ships database schema migrations; the existing volume is migrated on first boot.`,
    es_ES: `**Cambios de versión**

- Open WebUI → 0.9.5

**Cambios destacados de upstream**

- Las redirecciones HTTP 3xx salientes ahora se bloquean por defecto en peticiones web, carga de imágenes, descubrimiento OAuth y servidores de herramientas, como defensa frente a SSRF basados en redirección; reactívalas con la variable upstream \`AIOHTTP_CLIENT_ALLOW_REDIRECTS\` si las necesitas.
- El endpoint de cierre de sesión ahora requiere POST en lugar de GET. Es posible que los clientes e integraciones personalizados deban actualizar sus llamadas de logout.
- La versión 0.9.3 incluye migraciones del esquema de base de datos; el volumen existente se migra en el primer arranque.`,
    de_DE: `**Versionssprünge**

- Open WebUI → 0.9.5

**Wichtige Upstream-Änderungen**

- Ausgehende 3xx-Weiterleitungen werden bei Web-Fetch, Bildladevorgängen, OAuth-Discovery und Tool-Servern jetzt standardmäßig blockiert, um Redirect-basierte SSRF abzuwehren; bei Bedarf über die Upstream-Variable \`AIOHTTP_CLIENT_ALLOW_REDIRECTS\` wieder aktivieren.
- Der Logout-Endpoint erfordert nun POST statt GET. Eigene Clients und Integrationen müssen ihre Logout-Aufrufe gegebenenfalls anpassen.
- 0.9.3 bringt Datenbank-Schema-Migrationen mit, die beim ersten Start auf dem bestehenden Volume ausgeführt werden.`,
    pl_PL: `**Aktualizacje**

- Open WebUI → 0.9.5

**Istotne zmiany w upstream**

- Wychodzące przekierowania 3xx są teraz domyślnie blokowane w pobieraniu treści www, ładowaniu obrazów, odkrywaniu OAuth i serwerach narzędzi w ramach ochrony przed SSRF opartym na przekierowaniach; w razie potrzeby włącz je z powrotem zmienną upstream \`AIOHTTP_CLIENT_ALLOW_REDIRECTS\`.
- Endpoint wylogowania wymaga teraz POST zamiast GET. Niestandardowi klienci i integracje mogą wymagać aktualizacji wywołań logout.
- Wersja 0.9.3 zawiera migracje schematu bazy danych; istniejący wolumen jest migrowany przy pierwszym uruchomieniu.`,
    fr_FR: `**Mises à jour**

- Open WebUI → 0.9.5

**Changements amont notables**

- Les redirections HTTP 3xx sortantes sont désormais bloquées par défaut sur la récupération web, le chargement d'images, la découverte OAuth et les serveurs d'outils, en défense contre les SSRF basés sur redirection ; réactivez-les via la variable amont \`AIOHTTP_CLIENT_ALLOW_REDIRECTS\` si nécessaire.
- Le point de terminaison de déconnexion requiert maintenant POST au lieu de GET. Les clients et intégrations personnalisés devront peut-être adapter leurs appels de logout.
- La version 0.9.3 apporte des migrations de schéma de base de données ; le volume existant est migré au premier démarrage.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
