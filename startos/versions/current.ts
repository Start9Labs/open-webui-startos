import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.11.1.

Upstream flags this as a security release. It fixes knowledge-base searches that could return material you have no access to, documents crafted to exhaust the server's memory, web address checks that a request could skip, and code execution reachable through a tag in a model's reply.

It also rebuilds how replies stream: a long reply now arrives as small additions rather than the whole message resent with every update, which makes long chats noticeably lighter on the server and in your browser. Several ways a reply could vanish, arrive empty, or stop partway are fixed too.

New in this release: a model can be made to ask before it runs a tool, a model can put a multiple-choice question to you mid-conversation, chat search finds recent messages properly, and you can switch model from the message box.

The database is updated on the first start after this upgrade. It is a small change, so the extra wait should be short.

Full release notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.1`,
    es_ES: `Se ha actualizado Open WebUI a 0.11.1.

El proyecto original la señala como versión de seguridad. Corrige búsquedas en bases de conocimiento que podían devolver material al que usted no tiene acceso, documentos diseñados para agotar la memoria del servidor, comprobaciones de direcciones web que una petición podía saltarse y ejecución de código alcanzable mediante una etiqueta en la respuesta de un modelo.

También rehace la transmisión de las respuestas: una respuesta larga llega ahora como pequeñas adiciones en lugar de reenviarse entera con cada actualización, lo que aligera notablemente las conversaciones largas tanto en el servidor como en su navegador. Además se corrigen varias formas en que una respuesta podía desaparecer, llegar vacía o detenerse a medias.

Novedades de esta versión: se puede exigir que un modelo pida permiso antes de usar una herramienta, un modelo puede plantearle una pregunta de opción múltiple en mitad de la conversación, la búsqueda de chats encuentra correctamente los mensajes recientes y puede cambiar de modelo desde el cuadro de mensaje.

La base de datos se actualiza en el primer arranque tras esta actualización. Es un cambio pequeño, así que la espera adicional será breve.

Notas de la versión completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.1`,
    de_DE: `Open WebUI wurde auf 0.11.1 aktualisiert.

Das Ursprungsprojekt kennzeichnet diese Version als Sicherheitsrelease. Sie behebt Suchen in Wissensdatenbanken, die Material zurückgeben konnten, auf das Sie keinen Zugriff haben, Dokumente, die gezielt den Arbeitsspeicher des Servers erschöpfen, Prüfungen von Web-Adressen, die eine Anfrage umgehen konnte, und Codeausführung, die über ein Tag in der Antwort eines Modells erreichbar war.

Außerdem wird das Streaming der Antworten neu aufgebaut: Eine lange Antwort kommt jetzt als kleine Ergänzungen an, statt bei jeder Aktualisierung vollständig neu gesendet zu werden, was lange Unterhaltungen auf dem Server und im Browser deutlich leichter macht. Mehrere Fälle, in denen eine Antwort verschwand, leer ankam oder auf halbem Weg abbrach, sind ebenfalls behoben.

Neu in dieser Version: Ein Modell kann verpflichtet werden, vor dem Einsatz eines Werkzeugs nachzufragen, ein Modell kann Ihnen mitten im Gespräch eine Auswahlfrage stellen, die Chat-Suche findet neue Nachrichten zuverlässig, und Sie können das Modell direkt im Nachrichtenfeld wechseln.

Die Datenbank wird beim ersten Start nach diesem Update angepasst. Es ist eine kleine Änderung, die zusätzliche Wartezeit bleibt also kurz.

Vollständige Versionshinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.1`,
    pl_PL: `Zaktualizowano Open WebUI do wersji 0.11.1.

Autorzy oznaczają je jako wydanie bezpieczeństwa. Naprawia wyszukiwanie w bazach wiedzy, które mogło zwracać materiały bez dostępu do nich, dokumenty spreparowane tak, by wyczerpać pamięć serwera, kontrole adresów internetowych, które żądanie mogło pominąć, oraz wykonanie kodu osiągalne przez znacznik w odpowiedzi modelu.

Przebudowuje też przesyłanie odpowiedzi: długa odpowiedź przychodzi teraz jako niewielkie uzupełnienia, zamiast być przesyłana w całości przy każdej aktualizacji, dzięki czemu długie rozmowy znacznie mniej obciążają serwer i przeglądarkę. Poprawiono również kilka sytuacji, w których odpowiedź znikała, przychodziła pusta lub urywała się w połowie.

Nowości w tym wydaniu: można wymagać, aby model pytał o zgodę przed użyciem narzędzia, model może zadać Ci pytanie wielokrotnego wyboru w trakcie rozmowy, wyszukiwanie czatów poprawnie znajduje najnowsze wiadomości, a model można zmienić z poziomu pola wiadomości.

Baza danych zostanie zaktualizowana przy pierwszym uruchomieniu po tej aktualizacji. To niewielka zmiana, więc dodatkowe oczekiwanie będzie krótkie.

Pełne informacje o wydaniu: https://github.com/open-webui/open-webui/releases/tag/v0.11.1`,
    fr_FR: `Open WebUI a été mis à jour vers la version 0.11.1.

Le projet en amont la signale comme une version de sécurité. Elle corrige des recherches dans les bases de connaissances qui pouvaient renvoyer des éléments auxquels vous n'avez pas accès, des documents conçus pour épuiser la mémoire du serveur, des vérifications d'adresses web qu'une requête pouvait contourner, et une exécution de code accessible via une balise dans la réponse d'un modèle.

Elle reconstruit également la diffusion des réponses : une réponse longue arrive désormais par petits ajouts au lieu d'être renvoyée en entier à chaque mise à jour, ce qui allège nettement les longues conversations, sur le serveur comme dans votre navigateur. Plusieurs cas où une réponse disparaissait, arrivait vide ou s'arrêtait en cours de route sont aussi corrigés.

Nouveautés de cette version : un modèle peut être tenu de demander votre accord avant d'utiliser un outil, un modèle peut vous poser une question à choix multiples en pleine conversation, la recherche dans les conversations retrouve correctement les messages récents, et vous pouvez changer de modèle depuis la zone de saisie.

La base de données est mise à jour au premier démarrage après cette mise à niveau. Le changement est petit, l'attente supplémentaire sera donc brève.

Notes de version complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
