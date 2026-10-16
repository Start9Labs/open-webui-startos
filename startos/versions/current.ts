import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.3:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.12.3.

- Adds workspace-wide search, live collaborators in shared chats, and revision comparison options with undo.
- Adds optional temporary end-to-end encrypted channel chats, enabled in admin settings; requires HTTPS, WebSockets, and WebSocket server logging disabled.
- Fixes sharing settings being lost on save, long PDF exports, OAuth token refresh, and tool and chat reliability.

Skills attached to models or selected in chat now send their full instructions with each message when the Skills built-in tool is enabled. Remove skills attached only for discovery to avoid longer prompts; readable skills remain discoverable.

[Full upstream release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.3)`,
    es_ES: `Se ha actualizado Open WebUI a 0.12.3.

- Añade búsqueda en todo el espacio de trabajo, colaboradores en directo en chats compartidos y opciones de comparación de revisiones con deshacer.
- Añade chats temporales opcionales en canales con cifrado de extremo a extremo, activables en los ajustes de administración; requieren HTTPS, WebSockets y el registro del servidor WebSocket desactivado.
- Corrige la pérdida de ajustes de uso compartido al guardar, la exportación de PDF largos, la renovación de tokens OAuth y la fiabilidad de herramientas y chats.

Las habilidades asociadas a modelos o seleccionadas en el chat ahora envían sus instrucciones completas con cada mensaje cuando la herramienta integrada Skills está activada. Elimina las habilidades asociadas solo para facilitar su descubrimiento y evitar mensajes más largos; las habilidades legibles siguen siendo detectables.

[Notas completas de la versión original](https://github.com/open-webui/open-webui/releases/tag/v0.12.3)`,
    de_DE: `Open WebUI wurde auf 0.12.3 aktualisiert.

- Ergänzt eine arbeitsbereichsweite Suche, Live-Mitarbeiteranzeigen in geteilten Chats und Optionen zum Revisionsvergleich mit Rückgängig-Funktion.
- Ergänzt optionale temporäre Ende-zu-Ende-verschlüsselte Kanalchats, aktivierbar in den Administrationseinstellungen; erfordert HTTPS, WebSockets und deaktivierte WebSocket-Serverprotokollierung.
- Behebt beim Speichern verlorene Freigabeeinstellungen, den Export langer PDFs, die Erneuerung von OAuth-Tokens und Zuverlässigkeitsprobleme bei Tools und Chats.

An Modelle angehängte oder im Chat ausgewählte Skills senden nun bei jeder Nachricht ihre vollständigen Anweisungen, wenn das integrierte Skills-Tool aktiviert ist. Entferne Skills, die nur zur Auffindbarkeit angehängt wurden, um längere Prompts zu vermeiden; lesbare Skills bleiben auffindbar.

[Vollständige Versionshinweise des Ursprungsprojekts](https://github.com/open-webui/open-webui/releases/tag/v0.12.3)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.12.3.

- Dodaje wyszukiwanie w całej przestrzeni roboczej, podgląd aktywnych współpracowników we współdzielonych czatach oraz opcje porównywania wersji z cofaniem zmian.
- Dodaje opcjonalne tymczasowe czaty w kanałach z szyfrowaniem end-to-end, włączane w ustawieniach administratora; wymagają HTTPS, WebSockets i wyłączonego rejestrowania serwera WebSocket.
- Naprawia utratę ustawień udostępniania przy zapisie, eksport długich plików PDF, odświeżanie tokenów OAuth oraz niezawodność narzędzi i czatów.

Umiejętności przypisane do modeli lub wybrane w czacie wysyłają teraz pełne instrukcje z każdą wiadomością, gdy włączone jest wbudowane narzędzie Skills. Usuń umiejętności przypisane wyłącznie w celu ich odkrywania, aby uniknąć dłuższych poleceń; umiejętności z prawem odczytu nadal można odkrywać.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/open-webui/open-webui/releases/tag/v0.12.3)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.12.3.

- Ajoute la recherche dans tout l’espace de travail, l’affichage des collaborateurs présents dans les chats partagés et des options de comparaison de révisions avec annulation.
- Ajoute des chats temporaires optionnels dans les canaux avec chiffrement de bout en bout, activables dans les réglages d’administration ; nécessite HTTPS, WebSockets et la désactivation de la journalisation du serveur WebSocket.
- Corrige la perte des réglages de partage à l’enregistrement, l’export de longs PDF, le renouvellement des jetons OAuth et la fiabilité des outils et des chats.

Les compétences associées aux modèles ou sélectionnées dans le chat envoient désormais leurs instructions complètes avec chaque message lorsque l’outil intégré Skills est activé. Retirez celles associées uniquement pour les rendre découvrables afin d’éviter des requêtes plus longues ; les compétences accessibles en lecture restent découvrables.

[Notes de version complètes du projet en amont](https://github.com/open-webui/open-webui/releases/tag/v0.12.3)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
