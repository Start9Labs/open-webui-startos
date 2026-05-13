import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_9_5_1 = VersionInfo.of({
  version: '0.9.5:1',
  releaseNotes: {
    en_US: `**Bumps**

- Open WebUI 0.9.2 → 0.9.5

**Features**

- Channel mentions now stream model responses in real time with full tool support (web search, image generation, MCP tools, RAG).
- New granular Markdown rendering controls per message role from Interface settings.
- Voice Mode mute toggle, faster prompt-list and chat-history loading, "Scroll to Top" shortcut, and quick-delete from the chat menu.
- Brave LLM Context available as a web-search provider; "{{USER_GROUPS}}" template variable in system and template prompts.

**Fixes**

- Wide-ranging security hardening across web fetch, OAuth, tool execution, code interpreter, and image loading — redirect-based SSRF, profile-image MIME enforcement, parser-confusion bypasses, sharing and ownership permission checks.
- Numerous stability fixes around chat regeneration, code execution, MCP cleanup, OpenAPI tool parsing, voice recording, and config import.

**Internal**

- Update Start SDK to 1.5.0.`,
    es_ES: `**Actualizaciones**

- Open WebUI 0.9.2 → 0.9.5

**Funciones**

- Las menciones a modelos en canales ahora transmiten respuestas en tiempo real con soporte completo para herramientas (búsqueda web, generación de imágenes, herramientas MCP, RAG).
- Nuevos controles granulares de renderizado Markdown por rol de mensaje desde la configuración de Interfaz.
- Alternancia de silencio en Modo Voz, carga más rápida de la lista de prompts y del historial de chat, atajo "Ir arriba" y eliminación rápida desde el menú del chat.
- Brave LLM Context disponible como proveedor de búsqueda web; variable de plantilla "{{USER_GROUPS}}" en prompts del sistema y plantillas.

**Correcciones**

- Refuerzo de seguridad amplio en fetch web, OAuth, ejecución de herramientas, intérprete de código y carga de imágenes — SSRF basado en redirecciones, validación MIME de imágenes de perfil, omisión por confusión del parser, comprobaciones de permisos de propiedad y compartición.
- Numerosas correcciones de estabilidad en regeneración de chats, ejecución de código, limpieza de MCP, análisis de herramientas OpenAPI, grabación de voz e importación de configuración.

**Interno**

- Actualización a Start SDK 1.5.0.`,
    de_DE: `**Upstream-Updates**

- Open WebUI 0.9.2 → 0.9.5

**Funktionen**

- Modell-Erwähnungen in Kanälen streamen Antworten jetzt in Echtzeit mit vollständiger Tool-Unterstützung (Websuche, Bilderzeugung, MCP-Tools, RAG).
- Neue feingranulare Markdown-Rendering-Steuerung pro Nachrichtenrolle in den Oberflächeneinstellungen.
- Stummschaltung im Sprachmodus, schnelleres Laden der Prompt-Liste und des Chatverlaufs, „Nach oben springen"-Shortcut sowie Schnelllöschen aus dem Chat-Menü.
- Brave LLM Context als Websuch-Anbieter verfügbar; Vorlagenvariable „{{USER_GROUPS}}" in System- und Vorlagen-Prompts.

**Korrekturen**

- Umfangreiche Sicherheitsverbesserungen in Web-Fetch, OAuth, Tool-Ausführung, Code-Interpreter und Bildladevorgängen — Redirect-basierte SSRF, MIME-Erzwingung für Profilbilder, Parser-Confusion-Bypässe, Eigentums- und Freigabe-Berechtigungsprüfungen.
- Zahlreiche Stabilitätskorrekturen bei Chat-Regeneration, Code-Ausführung, MCP-Cleanup, OpenAPI-Tool-Parsing, Sprachaufnahme und Konfigurations-Import.

**Intern**

- Aktualisierung auf Start SDK 1.5.0.`,
    pl_PL: `**Aktualizacje**

- Open WebUI 0.9.2 → 0.9.5

**Funkcje**

- Wzmianki o modelach w kanałach strumieniują odpowiedzi w czasie rzeczywistym z pełną obsługą narzędzi (wyszukiwanie w sieci, generowanie obrazów, narzędzia MCP, RAG).
- Nowe szczegółowe kontrolki renderowania Markdown według roli wiadomości w ustawieniach Interfejsu.
- Wyciszanie w trybie głosowym, szybsze ładowanie listy promptów i historii czatu, skrót „Przewiń do góry" oraz szybkie usuwanie z menu czatu.
- Brave LLM Context dostępny jako dostawca wyszukiwania w sieci; zmienna szablonu „{{USER_GROUPS}}" w promptach systemowych i szablonowych.

**Poprawki**

- Szerokie wzmocnienie bezpieczeństwa w pobieraniu sieciowym, OAuth, wykonywaniu narzędzi, interpreterze kodu i ładowaniu obrazów — SSRF oparte na przekierowaniach, wymuszanie typów MIME dla zdjęć profilowych, omijanie przez zamieszanie parsera, kontrole uprawnień własności i udostępniania.
- Liczne poprawki stabilności regeneracji czatu, wykonywania kodu, czyszczenia MCP, parsowania narzędzi OpenAPI, nagrywania głosowego i importu konfiguracji.

**Wewnętrzne**

- Aktualizacja Start SDK do 1.5.0.`,
    fr_FR: `**Mises à jour**

- Open WebUI 0.9.2 → 0.9.5

**Fonctionnalités**

- Les mentions de modèles dans les Canaux diffusent désormais les réponses en temps réel avec un support complet des outils (recherche web, génération d'images, outils MCP, RAG).
- Nouveaux contrôles granulaires de rendu Markdown par rôle de message dans les paramètres d'Interface.
- Bascule de mise en sourdine en Mode Vocal, chargement plus rapide de la liste de prompts et de l'historique de chat, raccourci « Défiler vers le haut » et suppression rapide depuis le menu de chat.
- Brave LLM Context disponible comme fournisseur de recherche web ; variable de modèle « {{USER_GROUPS}} » dans les prompts système et de modèle.

**Correctifs**

- Renforcement de sécurité étendu pour la récupération web, OAuth, l'exécution d'outils, l'interpréteur de code et le chargement d'images — SSRF par redirection, application MIME pour les images de profil, contournements par confusion du parseur, contrôles de permissions de propriété et de partage.
- Nombreuses corrections de stabilité concernant la régénération de chat, l'exécution de code, le nettoyage MCP, l'analyse des outils OpenAPI, l'enregistrement vocal et l'import de configuration.

**Interne**

- Mise à jour vers Start SDK 1.5.0.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
