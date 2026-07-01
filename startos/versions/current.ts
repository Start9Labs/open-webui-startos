import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.2:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.10.2.

- Security and access-control fixes — updating production deployments is recommended.
- Safer SQLite upgrades: the user-table migration no longer crashes or corrupts saved settings, fixing startup and login failures after an upgrade.
- Non-admin users can save their interface settings (default model, theme) again.
- Streamed reasoning display: thinking/reasoning content now renders as it streams.
- Fewer unexpected logouts — a single auth error no longer signs you out mid-session.

Full notes: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    es_ES: `Open WebUI actualizado a 0.10.2.

- Correcciones de seguridad y control de acceso — se recomienda actualizar las instalaciones en producción.
- Actualizaciones de SQLite más seguras: la migración de la tabla de usuarios ya no falla ni corrompe la configuración guardada, corrigiendo fallos de arranque e inicio de sesión tras una actualización.
- Los usuarios no administradores pueden volver a guardar su configuración de interfaz (modelo predeterminado, tema).
- Visualización del razonamiento en streaming: el contenido de pensamiento/razonamiento ahora se muestra a medida que llega.
- Menos cierres de sesión inesperados — un único error de autenticación ya no cierra la sesión a mitad de uso.

Notas completas: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    de_DE: `Open WebUI auf 0.10.2 aktualisiert.

- Sicherheits- und Zugriffskontroll-Korrekturen — ein Update von Produktivsystemen wird empfohlen.
- Sicherere SQLite-Upgrades: Die Migration der Benutzertabelle stürzt nicht mehr ab und beschädigt gespeicherte Einstellungen nicht, wodurch Start- und Anmeldefehler nach einem Upgrade behoben werden.
- Nicht-Administratoren können ihre Oberflächeneinstellungen (Standardmodell, Design) wieder speichern.
- Streaming-Anzeige der Argumentation: Denk-/Argumentationsinhalte werden jetzt beim Streamen dargestellt.
- Weniger unerwartete Abmeldungen — ein einzelner Authentifizierungsfehler meldet dich nicht mehr mitten in der Sitzung ab.

Vollständige Hinweise: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    pl_PL: `Zaktualizowano Open WebUI do 0.10.2.

- Poprawki bezpieczeństwa i kontroli dostępu — zaleca się aktualizację wdrożeń produkcyjnych.
- Bezpieczniejsze aktualizacje SQLite: migracja tabeli użytkowników już nie zawiesza się ani nie uszkadza zapisanych ustawień, naprawiając błędy uruchamiania i logowania po aktualizacji.
- Użytkownicy niebędący administratorami mogą ponownie zapisywać ustawienia interfejsu (domyślny model, motyw).
- Wyświetlanie rozumowania na żywo: treść myślenia/rozumowania renderuje się teraz w miarę strumieniowania.
- Mniej nieoczekiwanych wylogowań — pojedynczy błąd uwierzytelniania nie wylogowuje już w trakcie sesji.

Pełne informacje: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    fr_FR: `Open WebUI mis à jour vers 0.10.2.

- Corrections de sécurité et de contrôle d'accès — la mise à jour des déploiements en production est recommandée.
- Mises à niveau SQLite plus sûres : la migration de la table des utilisateurs ne plante plus et ne corrompt plus les paramètres enregistrés, corrigeant les échecs de démarrage et de connexion après une mise à niveau.
- Les utilisateurs non administrateurs peuvent de nouveau enregistrer leurs paramètres d'interface (modèle par défaut, thème).
- Affichage du raisonnement en streaming : le contenu de réflexion/raisonnement s'affiche désormais au fil du streaming.
- Moins de déconnexions inattendues — une seule erreur d'authentification ne vous déconnecte plus en pleine session.

Notes complètes : https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
