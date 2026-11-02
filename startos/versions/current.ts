import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.5:1',
  releaseNotes: {
    en_US: `Fixes web search when SearXNG on this server has a password set: Open WebUI now signs in to SearXNG automatically. Update SearXNG first.

Fixes chats with llama.cpp on this server, which failed with an authentication error on StartOS 0.4.1. Open WebUI now connects to llama.cpp's new OpenAI-compatible API interface and reads its API key automatically. Update llama.cpp first; an existing llama.cpp connection is moved to the new address and key when Open WebUI restarts. If llama.cpp still fails, run Configure Backends again.`,
    es_ES: `Corrige la búsqueda web cuando SearXNG en este servidor tiene una contraseña: Open WebUI ahora inicia sesión en SearXNG automáticamente. Actualice SearXNG primero.

Corrige los chats con llama.cpp en este servidor, que fallaban con un error de autenticación en StartOS 0.4.1. Open WebUI ahora se conecta a la nueva interfaz API compatible con OpenAI de llama.cpp y lee su clave de API automáticamente. Actualice primero llama.cpp; una conexión existente a llama.cpp pasa a la nueva dirección y clave cuando Open WebUI se reinicia. Si llama.cpp sigue fallando, vuelva a ejecutar Configurar backends.`,
    de_DE: `Behebt die Websuche, wenn SearXNG auf diesem Server ein Passwort hat: Open WebUI meldet sich jetzt automatisch bei SearXNG an. Aktualisieren Sie zuerst SearXNG.

Behebt Chats mit llama.cpp auf diesem Server, die unter StartOS 0.4.1 mit einem Authentifizierungsfehler scheiterten. Open WebUI verbindet sich jetzt mit der neuen OpenAI-kompatiblen API-Schnittstelle von llama.cpp und liest deren API-Schlüssel automatisch. Aktualisieren Sie zuerst llama.cpp; eine bestehende llama.cpp-Verbindung wird beim Neustart von Open WebUI auf die neue Adresse und den neuen Schlüssel umgestellt. Falls llama.cpp weiterhin fehlschlägt, führen Sie „Backends konfigurieren“ erneut aus.`,
    pl_PL: `Naprawia wyszukiwanie w sieci, gdy SearXNG na tym serwerze ma ustawione hasło: Open WebUI loguje się teraz do SearXNG automatycznie. Najpierw zaktualizuj SearXNG.

Naprawia czaty z llama.cpp na tym serwerze, które w StartOS 0.4.1 kończyły się błędem uwierzytelniania. Open WebUI łączy się teraz z nowym interfejsem API zgodnym z OpenAI w llama.cpp i automatycznie odczytuje jego klucz API. Najpierw zaktualizuj llama.cpp; istniejące połączenie z llama.cpp zostanie przeniesione na nowy adres i klucz przy ponownym uruchomieniu Open WebUI. Jeśli llama.cpp nadal nie działa, uruchom ponownie akcję Konfiguruj backendy.`,
    fr_FR: `Corrige la recherche web lorsque SearXNG sur ce serveur a un mot de passe : Open WebUI se connecte désormais automatiquement à SearXNG. Mettez d’abord SearXNG à jour.

Corrige les discussions avec llama.cpp sur ce serveur, qui échouaient avec une erreur d’authentification sous StartOS 0.4.1. Open WebUI se connecte désormais à la nouvelle interface API compatible OpenAI de llama.cpp et lit sa clé d’API automatiquement. Mettez d’abord llama.cpp à jour ; une connexion llama.cpp existante passe à la nouvelle adresse et à la nouvelle clé au redémarrage d’Open WebUI. Si llama.cpp échoue encore, relancez Configurer les backends.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
