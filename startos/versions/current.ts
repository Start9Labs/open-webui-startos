import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.4:2',
  releaseNotes: {
    en_US: `- Reset Admin Password and Reconnect SearXNG ask for confirmation before they run
- Configure Backends lists each backend it can connect and how its API key is handled
- The Base URL format message in Configure Backends is shown in your language`,
    es_ES: `- Restablecer contraseña de administrador y Reconectar SearXNG piden confirmación antes de ejecutarse
- Configurar backends enumera cada backend al que puede conectarse y cómo se gestiona su clave de API
- El mensaje de formato de la URL base en Configurar backends está traducido`,
    de_DE: `- „Admin-Passwort zurücksetzen“ und „SearXNG neu verbinden“ fragen vor der Ausführung nach einer Bestätigung
- „Backends konfigurieren“ führt jedes verbindbare Backend auf und wie sein API-Schlüssel behandelt wird
- Die Formatmeldung zur Basis-URL in „Backends konfigurieren“ ist übersetzt`,
    pl_PL: `- „Zresetuj hasło administratora” i „Połącz ponownie z SearXNG” proszą o potwierdzenie przed uruchomieniem
- „Konfiguruj backendy” wymienia każdy backend, z którym może się połączyć, oraz sposób obsługi jego klucza API
- Komunikat o formacie pola „Bazowy adres URL” w „Konfiguruj backendy” jest przetłumaczony`,
    fr_FR: `- Réinitialiser le mot de passe administrateur et Reconnecter SearXNG demandent une confirmation avant de s'exécuter
- Configurer les backends liste chaque backend auquel il peut se connecter et la façon dont sa clé d'API est gérée
- Le message de format de l'URL de base dans Configurer les backends est traduit`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
