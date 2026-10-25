import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.4:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.12.4, including security fixes, clearer context compaction, bulk chat and file management, and fixes for shared chats and SQLite connection leaks.

The image now uses Python 3.12 on Debian 13. Custom functions, tools and pip-installed packages must support Python 3.12. Upstream now includes fixed CA stores, replacing the temporary StartOS image layer.

If you use tool servers or Open Terminal saved in personal Integrations settings, enable Direct Integrations under Admin Settings > Connections; those connections no longer work while it is off. Sharing is now changed only through each item's Access settings.

[Full upstream release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.4)`,
    es_ES: `Se ha actualizado Open WebUI a 0.12.4, con correcciones de seguridad, compactación del contexto más clara, gestión masiva de chats y archivos y correcciones para chats compartidos y fugas de conexiones SQLite.

La imagen ahora usa Python 3.12 sobre Debian 13. Las funciones, herramientas y paquetes instalados con pip personalizados deben ser compatibles con Python 3.12. La imagen original ya incluye almacenes de certificados corregidos, que sustituyen la capa temporal de StartOS.

Si usas servidores de herramientas u Open Terminal guardados en los ajustes personales de Integraciones, activa Integraciones directas en Configuración de administración > Conexiones; esas conexiones ya no funcionan mientras esté desactivado. El acceso compartido ahora se cambia solo en los ajustes de Acceso de cada elemento.

[Notas completas de la versión original](https://github.com/open-webui/open-webui/releases/tag/v0.12.4)`,
    de_DE: `Open WebUI wurde auf 0.12.4 aktualisiert, mit Sicherheitskorrekturen, übersichtlicherer Kontextkomprimierung, Sammelverwaltung von Chats und Dateien sowie Korrekturen für geteilte Chats und verlorene SQLite-Verbindungen.

Das Image nutzt nun Python 3.12 auf Debian 13. Eigene Funktionen, Tools und mit pip installierte Pakete müssen Python 3.12 unterstützen. Das Upstream-Image enthält korrigierte Zertifikatsspeicher und ersetzt die vorübergehende StartOS-Image-Schicht.

Wer Tool-Server oder Open Terminal in den persönlichen Integrationseinstellungen nutzt, muss Direkte Integrationen unter Admin-Einstellungen > Verbindungen aktivieren; diese Verbindungen funktionieren nicht mehr, solange die Option ausgeschaltet ist. Freigaben werden nun ausschließlich in den Zugriffseinstellungen des jeweiligen Elements geändert.

[Vollständige Versionshinweise des Ursprungsprojekts](https://github.com/open-webui/open-webui/releases/tag/v0.12.4)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.12.4: poprawki bezpieczeństwa, czytelniejsza kompakcja kontekstu, zbiorcze zarządzanie czatami i plikami oraz naprawy współdzielonych czatów i wycieków połączeń SQLite.

Obraz używa teraz Pythona 3.12 na Debianie 13. Własne funkcje, narzędzia i pakiety instalowane przez pip muszą obsługiwać Pythona 3.12. Obraz źródłowy zawiera poprawione magazyny certyfikatów, zastępując tymczasową warstwę obrazu StartOS.

Jeśli używasz serwerów narzędzi lub Open Terminal zapisanych w osobistych ustawieniach Integracji, włącz Integracje bezpośrednie w Ustawieniach administratora > Połączenia; te połączenia nie działają już przy wyłączonej opcji. Udostępnianie zmienia się teraz wyłącznie w ustawieniach Dostępu danego elementu.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/open-webui/open-webui/releases/tag/v0.12.4)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.12.4 : correctifs de sécurité, compactage du contexte plus lisible, gestion groupée des conversations et fichiers, et corrections des conversations partagées et des fuites de connexions SQLite.

L'image utilise désormais Python 3.12 sur Debian 13. Les fonctions, outils et paquets personnalisés installés avec pip doivent prendre en charge Python 3.12. L'image en amont contient des magasins de certificats corrigés, remplaçant la couche temporaire de l'image StartOS.

Si vous utilisez des serveurs d'outils ou Open Terminal enregistrés dans les réglages personnels d'Intégrations, activez les Intégrations directes dans Paramètres d'administration > Connexions ; ces connexions ne fonctionnent plus lorsque cette option est désactivée. Le partage se modifie désormais uniquement dans les réglages d'Accès de chaque élément.

[Notes de version complètes du projet en amont](https://github.com/open-webui/open-webui/releases/tag/v0.12.4)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
