import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.2:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.10.2.

This is a security and bug-fix release; updating is recommended.

- Security and access-control fixes across the app.
- Streamed reasoning: models that emit thinking now show it live as it streams.
- Folder uploads to knowledge bases now preserve their subfolder structure.
- Safer SQLite upgrades: the user-table migration no longer crashes or corrupts saved settings.
- A single authorization error no longer signs you out while your session is still valid.
- Non-admin users can save their interface settings again, and Python code execution loads reliably.

Full notes: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    es_ES: `Open WebUI actualizado a 0.10.2.

Esta es una versión de seguridad y correcciones; se recomienda actualizar.

- Correcciones de seguridad y control de acceso en toda la aplicación.
- Razonamiento en streaming: los modelos que emiten pensamiento ahora lo muestran en vivo mientras se transmite.
- Las cargas de carpetas a bases de conocimiento ahora conservan su estructura de subcarpetas.
- Actualizaciones de SQLite más seguras: la migración de la tabla de usuarios ya no falla ni corrompe la configuración guardada.
- Un único error de autorización ya no cierra tu sesión mientras sigue siendo válida.
- Los usuarios no administradores pueden volver a guardar su configuración de interfaz, y la ejecución de código Python carga de forma fiable.

Notas completas: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    de_DE: `Open WebUI auf 0.10.2 aktualisiert.

Dies ist eine Sicherheits- und Fehlerbehebungsversion; ein Update wird empfohlen.

- Sicherheits- und Zugriffskontroll-Korrekturen in der gesamten App.
- Streaming-Reasoning: Modelle, die Denkprozesse ausgeben, zeigen diese jetzt live während des Streamings an.
- Ordner-Uploads in Wissensdatenbanken behalten jetzt ihre Unterordnerstruktur bei.
- Sicherere SQLite-Upgrades: Die Migration der Benutzertabelle stürzt nicht mehr ab und beschädigt keine gespeicherten Einstellungen.
- Ein einzelner Autorisierungsfehler meldet dich nicht mehr ab, während deine Sitzung noch gültig ist.
- Nicht-Administratoren können ihre Oberflächeneinstellungen wieder speichern, und die Python-Codeausführung lädt zuverlässig.

Vollständige Hinweise: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    pl_PL: `Zaktualizowano Open WebUI do 0.10.2.

To wydanie z poprawkami bezpieczeństwa i błędów; zalecana jest aktualizacja.

- Poprawki bezpieczeństwa i kontroli dostępu w całej aplikacji.
- Strumieniowe rozumowanie: modele emitujące proces myślenia pokazują go teraz na żywo podczas strumieniowania.
- Przesyłanie folderów do baz wiedzy zachowuje teraz ich strukturę podfolderów.
- Bezpieczniejsze aktualizacje SQLite: migracja tabeli użytkowników nie powoduje już awarii ani uszkodzenia zapisanych ustawień.
- Pojedynczy błąd autoryzacji nie wylogowuje już użytkownika, gdy sesja jest nadal ważna.
- Użytkownicy bez uprawnień administratora mogą ponownie zapisywać ustawienia interfejsu, a wykonywanie kodu Python ładuje się niezawodnie.

Pełne informacje: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    fr_FR: `Open WebUI mis à jour vers 0.10.2.

Il s'agit d'une version de sécurité et de correction de bogues ; la mise à jour est recommandée.

- Corrections de sécurité et de contrôle d'accès dans toute l'application.
- Raisonnement en streaming : les modèles qui émettent une réflexion l'affichent désormais en direct pendant la diffusion.
- Les téléversements de dossiers vers les bases de connaissances conservent désormais leur structure de sous-dossiers.
- Mises à niveau SQLite plus sûres : la migration de la table des utilisateurs ne plante plus et ne corrompt plus les paramètres enregistrés.
- Une seule erreur d'autorisation ne vous déconnecte plus tant que votre session est encore valide.
- Les utilisateurs non administrateurs peuvent à nouveau enregistrer leurs paramètres d'interface, et l'exécution de code Python se charge de manière fiable.

Notes complètes : https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
