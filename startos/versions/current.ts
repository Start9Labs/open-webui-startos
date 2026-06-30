import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.1:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.10.1.

- Share folders and their chats with users or groups, with read/write access.
- Automatic context compaction keeps long chats within a model's context window.
- Reworked memory system with distinct long-lived and per-conversation memories.
- New event system: outbound webhooks and an Event plugin primitive reacting to app-wide activity.
- Configure LDAP and OAuth/OIDC from a dedicated admin Authentication page.
- Optional Argon2 password hashing and encryption of valve values at rest.
- 0.10.1 fixes shared read-only chats incorrectly signing users out.

Full notes: https://github.com/open-webui/open-webui/releases/tag/v0.10.1`,
    es_ES: `Open WebUI actualizado a 0.10.1.

- Comparte carpetas y sus chats con usuarios o grupos, con acceso de lectura/escritura.
- La compactación automática del contexto mantiene los chats largos dentro de la ventana de contexto del modelo.
- Sistema de memoria rediseñado con memorias persistentes y por conversación.
- Nuevo sistema de eventos: webhooks salientes y un primitivo de plugin Event que reacciona a la actividad de la aplicación.
- Configura LDAP y OAuth/OIDC desde una página de autenticación de administración dedicada.
- Hash de contraseñas Argon2 opcional y cifrado de valores de valve en reposo.
- 0.10.1 corrige que los chats compartidos de solo lectura cerraran la sesión de los usuarios.

Notas completas: https://github.com/open-webui/open-webui/releases/tag/v0.10.1`,
    de_DE: `Open WebUI auf 0.10.1 aktualisiert.

- Teile Ordner und ihre Chats mit Nutzern oder Gruppen, mit Lese-/Schreibzugriff.
- Automatische Kontextverdichtung hält lange Chats im Kontextfenster des Modells.
- Überarbeitetes Speichersystem mit langlebigen und gesprächsbezogenen Erinnerungen.
- Neues Ereignissystem: ausgehende Webhooks und ein Event-Plugin-Primitiv, das auf anwendungsweite Aktivität reagiert.
- Konfiguriere LDAP und OAuth/OIDC über eine eigene Admin-Authentifizierungsseite.
- Optionales Argon2-Passwort-Hashing und Verschlüsselung von Valve-Werten im Ruhezustand.
- 0.10.1 behebt, dass geteilte schreibgeschützte Chats Nutzer fälschlich abmeldeten.

Vollständige Hinweise: https://github.com/open-webui/open-webui/releases/tag/v0.10.1`,
    pl_PL: `Zaktualizowano Open WebUI do 0.10.1.

- Udostępniaj foldery i ich czaty użytkownikom lub grupom z dostępem do odczytu/zapisu.
- Automatyczna kompaktacja kontekstu utrzymuje długie czaty w oknie kontekstu modelu.
- Przeprojektowany system pamięci z trwałymi i przypisanymi do rozmowy wspomnieniami.
- Nowy system zdarzeń: wychodzące webhooki i prymityw wtyczki Event reagujący na aktywność w całej aplikacji.
- Konfiguruj LDAP i OAuth/OIDC z dedykowanej strony uwierzytelniania w panelu administracyjnym.
- Opcjonalne haszowanie haseł Argon2 i szyfrowanie wartości valve w spoczynku.
- 0.10.1 naprawia błędne wylogowywanie użytkowników z udostępnionych czatów tylko do odczytu.

Pełne informacje: https://github.com/open-webui/open-webui/releases/tag/v0.10.1`,
    fr_FR: `Open WebUI mis à jour vers 0.10.1.

- Partagez des dossiers et leurs conversations avec des utilisateurs ou des groupes, en lecture/écriture.
- La compaction automatique du contexte garde les longues conversations dans la fenêtre de contexte du modèle.
- Système de mémoire repensé avec des mémoires persistantes et propres à chaque conversation.
- Nouveau système d'événements : webhooks sortants et une primitive de plugin Event réagissant à l'activité de l'application.
- Configurez LDAP et OAuth/OIDC depuis une page d'authentification dédiée dans l'administration.
- Hachage de mot de passe Argon2 optionnel et chiffrement des valeurs de valve au repos.
- 0.10.1 corrige la déconnexion erronée des utilisateurs sur les conversations partagées en lecture seule.

Notes complètes : https://github.com/open-webui/open-webui/releases/tag/v0.10.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
