import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.0:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.13.0.

- Includes security fixes; upstream strongly recommends updating.
- Adds a tabbed workspace, side chats, optional comment threads, a notification inbox, and interactive MCP apps in chat.
- Adds multi-model sub-agents, knowledge-base file limits, and fixes for chat streaming and saved OAuth settings.

Back up before updating: upstream migrates the database on first start to add comments, notifications and tool enable switches. Allow extra time for that first start. Chat controls now live in the model menu beside the message input. Sub-agent limits default to unlimited, and the tool-call limit rises to 1024; review those settings if you use agent workflows. File-processing failure webhook alerts are removed.

[Full upstream release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.0)

Fixes web search when SearXNG on this server has a password set: Open WebUI now signs in to SearXNG automatically. Update SearXNG first.

Fixes chats with llama.cpp on this server, which failed with an authentication error on StartOS 0.4.1. Open WebUI now connects to llama.cpp's new OpenAI-compatible API interface and reads its API key automatically. Update llama.cpp first; an existing llama.cpp connection is moved to the new address and key when Open WebUI restarts. If llama.cpp still fails, run Configure Backends again.`,
    es_ES: `Se ha actualizado Open WebUI a 0.13.0.

- Incluye correcciones de seguridad; el proyecto original recomienda encarecidamente actualizar.
- Añade un espacio de trabajo con pestañas, chats secundarios, hilos de comentarios opcionales, una bandeja de notificaciones y aplicaciones MCP interactivas en el chat.
- Añade subagentes con distintos modelos, límites de archivos en bases de conocimiento y correcciones para la transmisión de chats y los ajustes OAuth guardados.

Haga una copia de seguridad antes de actualizar: Open WebUI migra la base de datos en el primer arranque para añadir comentarios, notificaciones e interruptores de herramientas. Deje más tiempo para ese primer arranque. Los controles del chat ahora están en el menú del modelo junto al campo de mensaje. Los subagentes no tienen límites por defecto y el límite de llamadas a herramientas sube a 1024; revise esos ajustes si usa flujos con agentes. Se eliminan las alertas por webhook de fallos en el procesamiento de archivos.

[Notas completas de la versión original](https://github.com/open-webui/open-webui/releases/tag/v0.13.0)

Corrige la búsqueda web cuando SearXNG en este servidor tiene una contraseña: Open WebUI ahora inicia sesión en SearXNG automáticamente. Actualice SearXNG primero.

Corrige los chats con llama.cpp en este servidor, que fallaban con un error de autenticación en StartOS 0.4.1. Open WebUI ahora se conecta a la nueva interfaz API compatible con OpenAI de llama.cpp y lee su clave de API automáticamente. Actualice primero llama.cpp; una conexión existente a llama.cpp pasa a la nueva dirección y clave cuando Open WebUI se reinicia. Si llama.cpp sigue fallando, vuelva a ejecutar Configurar backends.`,
    de_DE: `Open WebUI wurde auf 0.13.0 aktualisiert.

- Enthält Sicherheitskorrekturen; das Ursprungsprojekt empfiehlt dringend ein Update.
- Ergänzt einen Arbeitsbereich mit Tabs, Neben-Chats, optionale Kommentar-Threads, einen Benachrichtigungseingang und interaktive MCP-Apps im Chat.
- Ergänzt Unteragenten mit verschiedenen Modellen, Dateilimits für Wissensdatenbanken sowie Korrekturen für Chat-Streaming und gespeicherte OAuth-Einstellungen.

Erstellen Sie vor dem Update eine Sicherung: Open WebUI migriert die Datenbank beim ersten Start für Kommentare, Benachrichtigungen und Ein-/Aus-Schalter für Tools. Planen Sie für diesen ersten Start mehr Zeit ein. Die Chat-Steuerung liegt nun im Modellmenü neben dem Nachrichtenfeld. Unteragenten sind standardmäßig unbegrenzt und das Tool-Aufruflimit steigt auf 1024; prüfen Sie diese Einstellungen bei Agenten-Workflows. Webhook-Meldungen bei fehlgeschlagener Dateiverarbeitung entfallen.

[Vollständige Versionshinweise des Ursprungsprojekts](https://github.com/open-webui/open-webui/releases/tag/v0.13.0)

Behebt die Websuche, wenn SearXNG auf diesem Server ein Passwort hat: Open WebUI meldet sich jetzt automatisch bei SearXNG an. Aktualisieren Sie zuerst SearXNG.

Behebt Chats mit llama.cpp auf diesem Server, die unter StartOS 0.4.1 mit einem Authentifizierungsfehler scheiterten. Open WebUI verbindet sich jetzt mit der neuen OpenAI-kompatiblen API-Schnittstelle von llama.cpp und liest deren API-Schlüssel automatisch. Aktualisieren Sie zuerst llama.cpp; eine bestehende llama.cpp-Verbindung wird beim Neustart von Open WebUI auf die neue Adresse und den neuen Schlüssel umgestellt. Falls llama.cpp weiterhin fehlschlägt, führen Sie „Backends konfigurieren“ erneut aus.`,
    pl_PL: `Zaktualizowano Open WebUI do 0.13.0.

- Zawiera poprawki bezpieczeństwa; autorzy zdecydowanie zalecają aktualizację.
- Dodaje obszar roboczy z kartami, czaty poboczne, opcjonalne wątki komentarzy, skrzynkę powiadomień i interaktywne aplikacje MCP w czacie.
- Dodaje podagentów z różnymi modelami, limity plików w bazach wiedzy oraz poprawki przesyłania odpowiedzi i zapisanych ustawień OAuth.

Przed aktualizacją wykonaj kopię zapasową: Open WebUI migruje bazę danych przy pierwszym uruchomieniu, dodając komentarze, powiadomienia i przełączniki narzędzi. Zarezerwuj więcej czasu na to pierwsze uruchomienie. Elementy sterujące czatem znajdują się teraz w menu modelu obok pola wiadomości. Podagenci domyślnie nie mają limitów, a limit wywołań narzędzi wzrasta do 1024; sprawdź te ustawienia, jeśli używasz agentów. Usunięto alerty webhook o błędach przetwarzania plików.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/open-webui/open-webui/releases/tag/v0.13.0)

Naprawia wyszukiwanie w sieci, gdy SearXNG na tym serwerze ma ustawione hasło: Open WebUI loguje się teraz do SearXNG automatycznie. Najpierw zaktualizuj SearXNG.

Naprawia czaty z llama.cpp na tym serwerze, które w StartOS 0.4.1 kończyły się błędem uwierzytelniania. Open WebUI łączy się teraz z nowym interfejsem API zgodnym z OpenAI w llama.cpp i automatycznie odczytuje jego klucz API. Najpierw zaktualizuj llama.cpp; istniejące połączenie z llama.cpp zostanie przeniesione na nowy adres i klucz przy ponownym uruchomieniu Open WebUI. Jeśli llama.cpp nadal nie działa, uruchom ponownie akcję Konfiguruj backendy.`,
    fr_FR: `Open WebUI a été mis à jour vers 0.13.0.

- Inclut des correctifs de sécurité ; le projet en amont recommande vivement la mise à jour.
- Ajoute un espace de travail à onglets, des conversations secondaires, des fils de commentaires facultatifs, une boîte de notifications et des applications MCP interactives dans le chat.
- Ajoute des sous-agents utilisant différents modèles, des limites de fichiers dans les bases de connaissances et des correctifs pour la diffusion des réponses et les réglages OAuth enregistrés.

Sauvegardez avant la mise à jour : Open WebUI migre la base de données au premier démarrage pour ajouter les commentaires, les notifications et les interrupteurs d’outils. Prévoyez davantage de temps pour ce premier démarrage. Les contrôles du chat se trouvent désormais dans le menu du modèle près du champ de message. Les sous-agents sont illimités par défaut et la limite d’appels d’outils passe à 1024 ; vérifiez ces réglages si vous utilisez des agents. Les alertes webhook d’échec du traitement des fichiers sont supprimées.

[Notes de version complètes du projet en amont](https://github.com/open-webui/open-webui/releases/tag/v0.13.0)

Corrige la recherche web lorsque SearXNG sur ce serveur a un mot de passe : Open WebUI se connecte désormais automatiquement à SearXNG. Mettez d’abord SearXNG à jour.

Corrige les discussions avec llama.cpp sur ce serveur, qui échouaient avec une erreur d’authentification sous StartOS 0.4.1. Open WebUI se connecte désormais à la nouvelle interface API compatible OpenAI de llama.cpp et lit sa clé d’API automatiquement. Mettez d’abord llama.cpp à jour ; une connexion llama.cpp existante passe à la nouvelle adresse et à la nouvelle clé au redémarrage d’Open WebUI. Si llama.cpp échoue encore, relancez Configurer les backends.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
