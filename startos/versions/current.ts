import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.4:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.13.4.

- New: video generation, several image models, interactive visualizations in chat, and chat statuses, boards, automations and knowledge on folder pages
- New: Tether, a desktop app that brings models, tool servers and terminals from your own computer into Open WebUI
- Changed: Direct Connections in user settings are gone; add personal models and tool servers in Tether instead
- Changed: existing image generation settings are converted to image connections on first start
- Fixes for MCP tools, OAuth sign-ins, context compaction and many chat issues

[Full release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)`,
    es_ES: `Open WebUI actualizado a 0.13.4.

- Nuevo: generación de video, varios modelos de imagen, visualizaciones interactivas en el chat, y estados, tableros, automatizaciones y conocimiento en las páginas de carpetas
- Nuevo: Tether, una aplicación de escritorio que lleva a Open WebUI los modelos, servidores de herramientas y terminales de tu propio ordenador
- Cambio: las Conexiones Directas de la configuración de usuario desaparecen; añade los modelos y servidores de herramientas personales en Tether
- Cambio: la configuración de generación de imágenes existente se convierte en conexiones de imagen en el primer inicio
- Correcciones en herramientas MCP, inicios de sesión OAuth, compactación de contexto y muchos problemas del chat

[Notas completas](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)`,
    de_DE: `Open WebUI auf 0.13.4 aktualisiert.

- Neu: Videogenerierung, mehrere Bildmodelle, interaktive Visualisierungen im Chat sowie Chat-Status, Boards, Automatisierungen und Wissen auf Ordnerseiten
- Neu: Tether, eine Desktop-App, die Modelle, Tool-Server und Terminals deines eigenen Computers in Open WebUI bringt
- Geändert: Direktverbindungen in den Benutzereinstellungen entfallen; persönliche Modelle und Tool-Server werden jetzt in Tether hinzugefügt
- Geändert: bestehende Einstellungen zur Bildgenerierung werden beim ersten Start in Bildverbindungen umgewandelt
- Korrekturen für MCP-Tools, OAuth-Anmeldungen, Kontextverdichtung und viele Chat-Probleme

[Vollständige Versionshinweise](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.13.4.

- Nowość: generowanie wideo, wiele modeli obrazów, interaktywne wizualizacje w czacie oraz statusy, tablice, automatyzacje i wiedza na stronach folderów
- Nowość: Tether, aplikacja desktopowa, która udostępnia w Open WebUI modele, serwery narzędzi i terminale z twojego komputera
- Zmiana: Połączenia bezpośrednie w ustawieniach użytkownika zostały usunięte; osobiste modele i serwery narzędzi dodaje się teraz w Tether
- Zmiana: istniejące ustawienia generowania obrazów są przy pierwszym uruchomieniu zamieniane na połączenia obrazów
- Poprawki narzędzi MCP, logowania OAuth, kompaktowania kontekstu i wielu problemów czatu

[Pełne informacje o wydaniu](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)`,
    fr_FR: `Open WebUI mis à jour vers 0.13.4.

- Nouveau : génération de vidéos, plusieurs modèles d'image, visualisations interactives dans le chat, ainsi que statuts, tableaux, automatisations et connaissances sur les pages de dossiers
- Nouveau : Tether, une application de bureau qui apporte à Open WebUI les modèles, serveurs d'outils et terminaux de votre propre ordinateur
- Modifié : les Connexions directes des paramètres utilisateur disparaissent ; ajoutez désormais vos modèles et serveurs d'outils personnels dans Tether
- Modifié : les paramètres de génération d'images existants sont convertis en connexions d'image au premier démarrage
- Corrections pour les outils MCP, les connexions OAuth, la compaction du contexte et de nombreux problèmes de chat

[Notes de version complètes](https://github.com/open-webui/open-webui/releases/tag/v0.13.4)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
