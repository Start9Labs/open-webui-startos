import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.0:1',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.11.0.

A large release that rebuilds the interface from the ground up, with a redesigned chat view and admin settings moved in alongside your personal settings. It also adds sub-agents, folder pages, chat forking, chat timers, per-chat and per-user variables, webhook notification targets and a personal usage dashboard. Upstream flags this as a security release with several access-control fixes.

This version changes the database schema, so back up Open WebUI before updating, and expect the first start afterwards to take longer than usual while your chats are migrated.

Also fixes two things on the StartOS side. Web search with SearXNG now works whichever order you installed the two in — previously, installing SearXNG after Open WebUI had already run left the search address blank, and turning web search on did nothing. And the models Open WebUI uses for audio transcription and document search now come from inside the package, with the remainder downloaded while it installs rather than the first time you use it — so Open WebUI is ready to work as soon as installing finishes. Anything you have configured yourself is left untouched.

Full release notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    es_ES: `Se ha actualizado Open WebUI a 0.11.0.

Una versión importante que rehace la interfaz desde cero, con una vista de chat rediseñada y la configuración de administración integrada junto a la configuración personal. También añade subagentes, páginas de carpetas, bifurcación de chats, temporizadores, variables por chat y por usuario, destinos de notificación por webhook y un panel de uso personal. El proyecto original la señala como versión de seguridad, con varias correcciones de control de acceso.

Esta versión cambia el esquema de la base de datos: haga una copia de seguridad de Open WebUI antes de actualizar y tenga en cuenta que el primer arranque posterior tardará más de lo habitual mientras se migran sus chats.

También corrige dos cosas del lado de StartOS. La búsqueda web con SearXNG ahora funciona sea cual sea el orden en que instalara ambos: antes, instalar SearXNG después de que Open WebUI ya se hubiera ejecutado dejaba vacía la dirección de búsqueda y activar la búsqueda web no surtía efecto. Además, los modelos que Open WebUI usa para transcribir audio y buscar en documentos ahora vienen dentro del paquete, y el resto se descarga durante la instalación en lugar de la primera vez que los usa, así que Open WebUI está listo para funcionar en cuanto termina de instalarse. Todo lo que haya configurado usted se respeta.

Notas de la versión completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    de_DE: `Open WebUI wurde auf 0.11.0 aktualisiert.

Eine große Version, die die Oberfläche von Grund auf neu aufbaut, mit überarbeiteter Chat-Ansicht und Administrationseinstellungen, die nun neben den persönlichen Einstellungen liegen. Hinzu kommen Unteragenten, Ordnerseiten, das Abzweigen von Chats, Chat-Timer, Variablen pro Chat und pro Benutzer, Webhook-Benachrichtigungsziele und eine persönliche Nutzungsübersicht. Das Ursprungsprojekt kennzeichnet diese Version als Sicherheitsrelease mit mehreren Korrekturen an der Zugriffskontrolle.

Diese Version ändert das Datenbankschema: Sichern Sie Open WebUI vor dem Update, und rechnen Sie damit, dass der erste Start danach länger dauert, während Ihre Chats migriert werden.

Außerdem werden zwei Dinge auf StartOS-Seite behoben. Die Websuche mit SearXNG funktioniert jetzt unabhängig davon, in welcher Reihenfolge Sie beide installiert haben — zuvor blieb die Suchadresse leer, wenn SearXNG installiert wurde, nachdem Open WebUI bereits gelaufen war, und das Einschalten der Websuche bewirkte nichts. Und die Modelle, die Open WebUI für Audio-Transkription und Dokumentsuche verwendet, liegen nun im Paket; der Rest wird während der Installation heruntergeladen statt beim ersten Gebrauch — Open WebUI ist damit einsatzbereit, sobald die Installation fertig ist. Was Sie selbst konfiguriert haben, bleibt unangetastet.

Vollständige Versionshinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    pl_PL: `Zaktualizowano Open WebUI do wersji 0.11.0.

Duże wydanie, które przebudowuje interfejs od podstaw — z przeprojektowanym widokiem czatu i ustawieniami administratora przeniesionymi obok ustawień osobistych. Dodaje też podagentów, strony folderów, rozgałęzianie czatów, minutniki czatu, zmienne dla czatu i użytkownika, cele powiadomień webhook oraz osobisty panel użycia. Autorzy oznaczają je jako wydanie bezpieczeństwa z kilkoma poprawkami kontroli dostępu.

Ta wersja zmienia schemat bazy danych: przed aktualizacją wykonaj kopię zapasową Open WebUI, a pierwsze uruchomienie po niej potrwa dłużej niż zwykle, gdy migrowane będą Twoje czaty.

Naprawia też dwie rzeczy po stronie StartOS. Wyszukiwanie w sieci z użyciem SearXNG działa teraz niezależnie od kolejności instalacji — wcześniej zainstalowanie SearXNG po tym, jak Open WebUI już się uruchomiło, zostawiało pusty adres wyszukiwania, a włączenie wyszukiwania nic nie dawało. Modele, których Open WebUI używa do transkrypcji dźwięku i przeszukiwania dokumentów, są teraz dołączone do pakietu, a reszta pobiera się podczas instalacji zamiast przy pierwszym użyciu — Open WebUI jest więc gotowe do pracy, gdy tylko instalacja się zakończy. Wszystko, co skonfigurowałeś samodzielnie, pozostaje nienaruszone.

Pełne informacje o wydaniu: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    fr_FR: `Open WebUI a été mis à jour vers la version 0.11.0.

Une version majeure qui reconstruit l'interface de fond en comble, avec une vue de conversation redessinée et les réglages d'administration désormais regroupés avec vos réglages personnels. Elle ajoute aussi des sous-agents, des pages de dossiers, la bifurcation des conversations, des minuteurs, des variables par conversation et par utilisateur, des destinations de notification par webhook et un tableau de bord d'utilisation personnel. Le projet en amont la signale comme une version de sécurité, avec plusieurs corrections de contrôle d'accès.

Cette version modifie le schéma de la base de données : sauvegardez Open WebUI avant la mise à jour, et attendez-vous à ce que le premier démarrage ensuite soit plus long que d'habitude, le temps que vos conversations soient migrées.

Elle corrige aussi deux points côté StartOS. La recherche web avec SearXNG fonctionne désormais quel que soit l'ordre dans lequel vous avez installé les deux : auparavant, installer SearXNG après qu'Open WebUI eut déjà démarré laissait l'adresse de recherche vide et activer la recherche web ne changeait rien. Et les modèles qu'Open WebUI utilise pour la transcription audio et la recherche dans les documents sont désormais fournis dans le paquet, le reste étant téléchargé pendant l'installation plutôt qu'à la première utilisation : Open WebUI est donc opérationnel dès que l'installation se termine. Ce que vous avez configuré vous-même reste intact.

Notes de version complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
