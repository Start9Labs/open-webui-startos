import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.2:1',
  releaseNotes: {
    en_US: `Fixes a startup failure introduced with Open WebUI 0.10: after a restart — or after running Configure Backends — the service could get stuck on “Starting…” and fail to come back. It now reads Open WebUI 0.10's new per-key settings storage (and still handles the pre-0.10 format for upgrades). If your service got stuck after a 0.10 update, installing this version recovers it — no data is lost. New installs also no longer add Ollama as a required dependency — connect Ollama or any OpenAI-compatible backend via the Configure Backends action after installing it.

Updated Open WebUI to 0.10.2.

This is a security and bug-fix release; updating is recommended.

- Security and access-control fixes across the app.
- Streamed reasoning: models that emit thinking now show it live as it streams.
- Folder uploads to knowledge bases now preserve their subfolder structure.
- Safer SQLite upgrades: the user-table migration no longer crashes or corrupts saved settings.
- A single authorization error no longer signs you out while your session is still valid.
- Non-admin users can save their interface settings again, and Python code execution loads reliably.

Full notes: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    es_ES: `Corrige un fallo de inicio introducido con Open WebUI 0.10: tras un reinicio —o después de ejecutar Configurar Backends— el servicio podía quedarse en «Iniciando…» y no volver a arrancar. Ahora lee el nuevo almacenamiento de ajustes por clave de Open WebUI 0.10 (y sigue admitiendo el formato anterior a 0.10 para actualizaciones). Si tu servicio se quedó bloqueado tras una actualización a 0.10, instalar esta versión lo recupera; no se pierde ningún dato. Las nuevas instalaciones tampoco añaden ya Ollama como dependencia obligatoria: conecta Ollama o cualquier proveedor compatible con OpenAI mediante la acción Configurar Backends después de instalarlo.

Open WebUI actualizado a 0.10.2.

Esta es una versión de seguridad y correcciones; se recomienda actualizar.

- Correcciones de seguridad y control de acceso en toda la aplicación.
- Razonamiento en streaming: los modelos que emiten pensamiento ahora lo muestran en vivo mientras se transmite.
- Las cargas de carpetas a bases de conocimiento ahora conservan su estructura de subcarpetas.
- Actualizaciones de SQLite más seguras: la migración de la tabla de usuarios ya no falla ni corrompe la configuración guardada.
- Un único error de autorización ya no cierra tu sesión mientras sigue siendo válida.
- Los usuarios no administradores pueden volver a guardar su configuración de interfaz, y la ejecución de código Python carga de forma fiable.

Notas completas: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    de_DE: `Behebt einen Startfehler, der mit Open WebUI 0.10 auftrat: Nach einem Neustart – oder nach dem Ausführen von „Backends konfigurieren“ – konnte der Dienst bei „Wird gestartet …“ hängen bleiben und nicht mehr hochfahren. Er liest jetzt den neuen schlüsselweisen Einstellungsspeicher von Open WebUI 0.10 (und unterstützt weiterhin das Format vor 0.10 für Upgrades). Falls Ihr Dienst nach einem 0.10-Update hängen geblieben ist, stellt die Installation dieser Version ihn wieder her; es gehen keine Daten verloren. Neuinstallationen fügen Ollama außerdem nicht mehr als erforderliche Abhängigkeit hinzu — verbinden Sie Ollama oder einen OpenAI-kompatiblen Anbieter nach der Installation über die Aktion „Backends konfigurieren“.

Open WebUI auf 0.10.2 aktualisiert.

Dies ist eine Sicherheits- und Fehlerbehebungsversion; ein Update wird empfohlen.

- Sicherheits- und Zugriffskontroll-Korrekturen in der gesamten App.
- Streaming-Reasoning: Modelle, die Denkprozesse ausgeben, zeigen diese jetzt live während des Streamings an.
- Ordner-Uploads in Wissensdatenbanken behalten jetzt ihre Unterordnerstruktur bei.
- Sicherere SQLite-Upgrades: Die Migration der Benutzertabelle stürzt nicht mehr ab und beschädigt keine gespeicherten Einstellungen.
- Ein einzelner Autorisierungsfehler meldet dich nicht mehr ab, während deine Sitzung noch gültig ist.
- Nicht-Administratoren können ihre Oberflächeneinstellungen wieder speichern, und die Python-Codeausführung lädt zuverlässig.

Vollständige Hinweise: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    pl_PL: `Naprawia błąd uruchamiania wprowadzony w Open WebUI 0.10: po ponownym uruchomieniu — lub po użyciu „Konfiguruj backendy” — usługa mogła zawiesić się na „Uruchamianie…” i nie wstać ponownie. Teraz odczytuje nowy magazyn ustawień „klucz na wiersz” z Open WebUI 0.10 (i nadal obsługuje format sprzed 0.10 przy aktualizacjach). Jeśli Twoja usługa zawiesiła się po aktualizacji do 0.10, zainstalowanie tej wersji ją przywraca; żadne dane nie zostają utracone. Nowe instalacje nie dodają już również Ollamy jako wymaganej zależności — połącz Ollamę lub dowolnego dostawcę zgodnego z OpenAI za pomocą akcji Konfiguruj backendy po jej zainstalowaniu.

Zaktualizowano Open WebUI do 0.10.2.

To wydanie z poprawkami bezpieczeństwa i błędów; zalecana jest aktualizacja.

- Poprawki bezpieczeństwa i kontroli dostępu w całej aplikacji.
- Strumieniowe rozumowanie: modele emitujące proces myślenia pokazują go teraz na żywo podczas strumieniowania.
- Przesyłanie folderów do baz wiedzy zachowuje teraz ich strukturę podfolderów.
- Bezpieczniejsze aktualizacje SQLite: migracja tabeli użytkowników nie powoduje już awarii ani uszkodzenia zapisanych ustawień.
- Pojedynczy błąd autoryzacji nie wylogowuje już użytkownika, gdy sesja jest nadal ważna.
- Użytkownicy bez uprawnień administratora mogą ponownie zapisywać ustawienia interfejsu, a wykonywanie kodu Python ładuje się niezawodnie.

Pełne informacje: https://github.com/open-webui/open-webui/releases/tag/v0.10.2`,
    fr_FR: `Corrige un échec de démarrage apparu avec Open WebUI 0.10 : après un redémarrage — ou après avoir lancé « Configurer les backends » — le service pouvait rester bloqué sur « Démarrage… » et ne plus repartir. Il lit désormais le nouveau stockage des paramètres par clé d'Open WebUI 0.10 (et prend toujours en charge le format antérieur à 0.10 pour les mises à niveau). Si votre service est resté bloqué après une mise à jour 0.10, installer cette version le rétablit ; aucune donnée n'est perdue. Les nouvelles installations n'ajoutent plus non plus Ollama comme dépendance requise — connectez Ollama ou tout fournisseur compatible OpenAI via l'action « Configurer les backends » après l'avoir installé.

Open WebUI mis à jour vers 0.10.2.

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
