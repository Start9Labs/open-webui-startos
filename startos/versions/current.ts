import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.12.0.

- Adds authenticator-based two-factor sign-in, replies in shared chats, nested groups, model controls, and version history for models, skills, tools and functions.
- Includes security and access-control fixes, plus improvements to tool calls, document search and chat reliability.
- StartOS adds Reset Admin Two-Factor Authentication, returning a one-time recovery token valid for 30 minutes. Reset Admin Password now also signs the account out on every device without removing its authenticator.
- Internal update to start-sdk 3.0.4.

Back up before updating: upstream migrates the database on first start, which may take longer than usual. Start Open WebUI once after updating before using either account-recovery action.

[Full upstream release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.0)`,
    es_ES: `Se ha actualizado Open WebUI a 0.12.0.

- Añade inicio de sesión de dos factores con autenticador, respuestas en chats compartidos, grupos anidados, controles de modelos e historial de versiones de modelos, habilidades, herramientas y funciones.
- Incluye correcciones de seguridad y control de acceso, además de mejoras en llamadas a herramientas, búsqueda de documentos y fiabilidad del chat.
- StartOS añade Restablecer la autenticación de dos factores del administrador, que devuelve un token de recuperación de un solo uso válido durante 30 minutos. Restablecer contraseña de administrador ahora también cierra las sesiones de la cuenta en todos los dispositivos sin eliminar su autenticador.
- Actualización interna a start-sdk 3.0.4.

Haz una copia de seguridad antes de actualizar: Open WebUI migra la base de datos en el primer arranque, que puede tardar más de lo habitual. Inicia Open WebUI una vez después de actualizar antes de usar cualquiera de las acciones de recuperación de cuentas.

[Notas completas de la versión original](https://github.com/open-webui/open-webui/releases/tag/v0.12.0)`,
    de_DE: `Open WebUI wurde auf 0.12.0 aktualisiert.

- Neu sind Zwei-Faktor-Anmeldung mit Authenticator, Antworten in geteilten Chats, verschachtelte Gruppen, Modell-Steuerelemente und Versionsverläufe für Modelle, Skills, Tools und Funktionen.
- Enthält Sicherheits- und Zugriffskorrekturen sowie Verbesserungen bei Tool-Aufrufen, Dokumentsuche und Chat-Zuverlässigkeit.
- StartOS ergänzt „Zwei-Faktor-Authentifizierung des Admins zurücksetzen“ mit einem einmaligen Wiederherstellungstoken, das 30 Minuten gültig ist. „Admin-Passwort zurücksetzen“ meldet das Konto nun auch auf allen Geräten ab, ohne den Authenticator zu entfernen.
- Internes Update auf start-sdk 3.0.4.

Vor dem Update eine Sicherung erstellen: Open WebUI migriert die Datenbank beim ersten Start, der länger als üblich dauern kann. Starte Open WebUI nach dem Update einmal, bevor du eine der beiden Kontowiederherstellungsaktionen verwendest.

[Vollständige Versionshinweise des Ursprungsprojekts](https://github.com/open-webui/open-webui/releases/tag/v0.12.0)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.12.0.

- Dodaje logowanie dwuskładnikowe z aplikacją uwierzytelniającą, odpowiedzi we współdzielonych czatach, zagnieżdżone grupy, elementy sterujące modelami oraz historię wersji modeli, umiejętności, narzędzi i funkcji.
- Zawiera poprawki bezpieczeństwa i kontroli dostępu oraz usprawnienia wywołań narzędzi, wyszukiwania dokumentów i niezawodności czatu.
- StartOS dodaje akcję Zresetuj uwierzytelnianie dwuskładnikowe administratora, która zwraca jednorazowy token odzyskiwania ważny przez 30 minut. Zresetuj hasło administratora teraz również wylogowuje konto ze wszystkich urządzeń bez usuwania konfiguracji aplikacji uwierzytelniającej.
- Wewnętrzna aktualizacja do start-sdk 3.0.4.

Przed aktualizacją wykonaj kopię zapasową: Open WebUI migruje bazę danych przy pierwszym uruchomieniu, które może potrwać dłużej niż zwykle. Uruchom Open WebUI raz po aktualizacji przed użyciem którejkolwiek z akcji odzyskiwania konta.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/open-webui/open-webui/releases/tag/v0.12.0)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.12.0.

- Ajoute la connexion à deux facteurs avec authentificateur, les réponses dans les chats partagés, les groupes imbriqués, les contrôles de modèles et l’historique des versions des modèles, compétences, outils et fonctions.
- Inclut des correctifs de sécurité et de contrôle d’accès, ainsi que des améliorations des appels d’outils, de la recherche documentaire et de la fiabilité des conversations.
- StartOS ajoute Réinitialiser l’authentification à deux facteurs de l’administrateur, qui fournit un jeton de récupération à usage unique valable 30 minutes. Réinitialiser le mot de passe administrateur déconnecte désormais aussi le compte de tous les appareils sans supprimer son authentificateur.
- Mise à jour interne vers start-sdk 3.0.4.

Sauvegardez avant la mise à jour : Open WebUI migre la base de données au premier démarrage, qui peut prendre plus de temps que d’habitude. Démarrez Open WebUI une fois après la mise à jour avant d’utiliser l’une des deux actions de récupération de compte.

[Notes de version complètes du projet en amont](https://github.com/open-webui/open-webui/releases/tag/v0.12.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
