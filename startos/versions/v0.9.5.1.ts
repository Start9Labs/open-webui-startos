import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_5_1 = VersionInfo.of({
  version: '0.9.5:1',
  releaseNotes: {
    en_US: `**Bumps**

- Open WebUI → 0.9.5

**Features**

- Redirect-based SSRF protection: outbound HTTP requests now block 3xx redirects by default across web fetch, image loading, OAuth discovery, tool servers, and the code interpreter.
- Configurable Content-Security-Policy for srcdoc iframes (Artifacts, tool embeds, file previews, citations) via the \`IFRAME_CSP\` environment variable.
- Granular Markdown rendering toggles for user and assistant messages in Interface settings.
- Channel mentions now stream responses in real time and support the full chat-completion pipeline (tools, filters, RAG, web search).
- Voice Mode mute toggle with auto-unmute after assistant playback.
- Delete-from-conversation menu, Scroll-to-Top shortcut, and \`{{USER_GROUPS}}\` prompt variable.
- Faster prompt-list and chat-history loading; lighter model-list API responses.

**Fixes**

- Tighter permission enforcement for skill, calendar, and channel sharing; feedback user attribution can no longer be spoofed.
- Note creation and opening no longer fail with a TypeError on \`is_pinned\`.
- Async DB driver migrated from asyncpg to psycopg v3 for cleaner libpq SSL handling.
- ARM64 Docker images no longer ship 0-byte Python dependencies.`,
    es_ES: `**Cambios de versión**

- Open WebUI → 0.9.5

**Funciones**

- Protección contra SSRF basado en redirecciones: las peticiones HTTP salientes bloquean por defecto las redirecciones 3xx en web fetch, carga de imágenes, descubrimiento OAuth, servidores de herramientas e intérprete de código.
- Content-Security-Policy configurable para iframes srcdoc (Artifacts, herramientas, vista previa de archivos, citas) mediante la variable de entorno \`IFRAME_CSP\`.
- Controles independientes para activar/desactivar el renderizado Markdown en mensajes de usuario y respuestas del asistente.
- Las menciones en canales ahora transmiten respuestas en tiempo real y admiten toda la canalización de chat (herramientas, filtros, RAG, búsqueda web).
- Modo Voz con silencio temporal y reactivación automática tras la respuesta del asistente.
- Eliminar conversación desde el menú de chat, acceso directo «Volver arriba» y variable de prompt \`{{USER_GROUPS}}\`.
- Carga más rápida de listas de prompts y de historial de chat; respuestas más ligeras de la API de modelos.

**Correcciones**

- Refuerzo de permisos para compartir habilidades, calendarios y canales; ya no es posible falsificar el autor de un feedback.
- Crear y abrir notas ya no falla con TypeError por \`is_pinned\`.
- Migración del controlador async de base de datos de asyncpg a psycopg v3 para gestionar SSL libpq con mayor limpieza.
- Las imágenes Docker ARM64 ya no incluyen dependencias Python de 0 bytes.`,
    de_DE: `**Updates**

- Open WebUI → 0.9.5

**Funktionen**

- Schutz vor Redirect-basierter SSRF: ausgehende HTTP-Anfragen blockieren 3xx-Weiterleitungen standardmäßig in Web-Fetch, Bild-Loading, OAuth-Discovery, Tool-Servern und im Code-Interpreter.
- Konfigurierbare Content-Security-Policy für srcdoc-Iframes (Artifacts, Tool-Einbettungen, Dateivorschauen, Zitate) über die Umgebungsvariable \`IFRAME_CSP\`.
- Eigenständige Markdown-Render-Schalter für Benutzer- und Assistentennachrichten in den Oberflächeneinstellungen.
- Channel-Erwähnungen streamen Antworten jetzt in Echtzeit und unterstützen die vollständige Chat-Pipeline (Tools, Filter, RAG, Websuche).
- Mute-Schalter im Sprachmodus mit automatischer Aufhebung nach der Antwort.
- Konversation aus dem Chat-Menü löschen, „Nach oben scrollen"-Verknüpfung und Prompt-Variable \`{{USER_GROUPS}}\`.
- Schnelleres Laden von Prompt-Listen und Chat-Verläufen; schlankere Antworten der Models-API.

**Fixes**

- Strengere Berechtigungsprüfungen für das Teilen von Skills, Kalendern und Kanälen; Feedback-Autorenfeld lässt sich nicht mehr fälschen.
- Notizen lassen sich wieder ohne TypeError zu \`is_pinned\` anlegen und öffnen.
- Async-DB-Treiber von asyncpg auf psycopg v3 migriert für sauberes libpq-SSL-Handling.
- ARM64-Docker-Images enthalten keine 0-Byte-Python-Abhängigkeiten mehr.`,
    pl_PL: `**Aktualizacje**

- Open WebUI → 0.9.5

**Funkcje**

- Ochrona przed SSRF opartym na przekierowaniach: wychodzące żądania HTTP domyślnie blokują przekierowania 3xx w pobieraniu stron, ładowaniu obrazów, wykrywaniu OAuth, serwerach narzędzi i interpreterze kodu.
- Konfigurowalna polityka Content-Security-Policy dla iframe'ów srcdoc (Artifacts, narzędzia, podglądy plików, cytaty) poprzez zmienną środowiskową \`IFRAME_CSP\`.
- Osobne przełączniki renderowania Markdown dla wiadomości użytkownika i odpowiedzi asystenta w ustawieniach interfejsu.
- Wzmianki w kanałach strumieniują odpowiedzi w czasie rzeczywistym i obsługują pełny pipeline czatu (narzędzia, filtry, RAG, wyszukiwanie w sieci).
- Tryb głosowy z wyciszeniem i automatycznym wznowieniem po odpowiedzi asystenta.
- Usuwanie rozmowy z menu czatu, skrót „Przewiń na górę" i zmienna promptu \`{{USER_GROUPS}}\`.
- Szybsze ładowanie list promptów i historii czatu; lżejsze odpowiedzi API listy modeli.

**Poprawki**

- Surowsza kontrola uprawnień przy udostępnianiu umiejętności, kalendarzy i kanałów; nie można już sfałszować autora oceny.
- Tworzenie i otwieranie notatek nie kończy się już TypeError z powodu \`is_pinned\`.
- Migracja asynchronicznego sterownika DB z asyncpg na psycopg v3 dla czystszej obsługi SSL libpq.
- Obrazy Docker ARM64 nie zawierają już zerobajtowych zależności Pythona.`,
    fr_FR: `**Mises à jour**

- Open WebUI → 0.9.5

**Fonctionnalités**

- Protection SSRF par redirection : les requêtes HTTP sortantes bloquent désormais par défaut les redirections 3xx pour la récupération web, le chargement d'images, la découverte OAuth, les serveurs d'outils et l'interpréteur de code.
- Content-Security-Policy configurable pour les iframes srcdoc (Artifacts, intégrations d'outils, prévisualisations de fichiers, citations) via la variable d'environnement \`IFRAME_CSP\`.
- Bascules indépendantes pour le rendu Markdown des messages utilisateur et des réponses de l'assistant dans les réglages d'interface.
- Les mentions dans les canaux diffusent maintenant les réponses en temps réel et prennent en charge l'intégralité du pipeline de chat (outils, filtres, RAG, recherche web).
- Mode Voix avec coupure micro et réactivation automatique après la réponse de l'assistant.
- Suppression d'une conversation depuis le menu du chat, raccourci « Remonter en haut » et variable de prompt \`{{USER_GROUPS}}\`.
- Chargement plus rapide des listes de prompts et de l'historique de chat ; réponses plus légères de l'API des modèles.

**Corrections**

- Contrôles d'autorisation renforcés pour le partage de compétences, calendriers et canaux ; l'auteur d'un retour ne peut plus être usurpé.
- La création et l'ouverture de notes ne plantent plus avec une TypeError due à \`is_pinned\`.
- Migration du pilote async de base de données de asyncpg vers psycopg v3 pour une gestion SSL libpq plus propre.
- Les images Docker ARM64 n'embarquent plus de dépendances Python à 0 octet.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
