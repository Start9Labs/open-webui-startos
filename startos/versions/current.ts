import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.0:1',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.11.0.

A large release that rebuilds the interface from the ground up, with a redesigned chat view and admin settings moved in alongside your personal settings. It also adds sub-agents, folder pages, chat forking, chat timers, per-chat and per-user variables, webhook notification targets and a personal usage dashboard. Upstream flags this as a security release with several access-control fixes.

This version changes the database schema, so back up Open WebUI before updating, and expect the first start afterwards to take longer than usual while your chats are migrated.

Also fixes web search with SearXNG. If you installed SearXNG after Open WebUI had already run once, the search endpoint stayed blank and turning web search on did nothing. Open WebUI now points itself at SearXNG on every start, so web search works whichever order you installed them in — any endpoint you set yourself is left untouched.

Full release notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    es_ES: `Se ha actualizado Open WebUI a 0.11.0.

Una versión importante que rehace la interfaz desde cero, con una vista de chat rediseñada y la configuración de administración integrada junto a la configuración personal. También añade subagentes, páginas de carpetas, bifurcación de chats, temporizadores, variables por chat y por usuario, destinos de notificación por webhook y un panel de uso personal. El proyecto original la señala como versión de seguridad, con varias correcciones de control de acceso.

Esta versión cambia el esquema de la base de datos: haga una copia de seguridad de Open WebUI antes de actualizar y tenga en cuenta que el primer arranque posterior tardará más de lo habitual mientras se migran sus chats.

También corrige la búsqueda web con SearXNG. Si instaló SearXNG después de que Open WebUI ya se hubiera ejecutado una vez, el endpoint de búsqueda quedaba vacío y activar la búsqueda web no surtía efecto. Ahora Open WebUI se apunta a SearXNG en cada arranque, así que la búsqueda web funciona sea cual sea el orden de instalación; cualquier endpoint que haya configurado usted se respeta.

Notas de la versión completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    de_DE: `Open WebUI wurde auf 0.11.0 aktualisiert.

Eine große Version, die die Oberfläche von Grund auf neu aufbaut, mit überarbeiteter Chat-Ansicht und Administrationseinstellungen, die nun neben den persönlichen Einstellungen liegen. Hinzu kommen Unteragenten, Ordnerseiten, das Abzweigen von Chats, Chat-Timer, Variablen pro Chat und pro Benutzer, Webhook-Benachrichtigungsziele und eine persönliche Nutzungsübersicht. Das Ursprungsprojekt kennzeichnet diese Version als Sicherheitsrelease mit mehreren Korrekturen an der Zugriffskontrolle.

Diese Version ändert das Datenbankschema: Sichern Sie Open WebUI vor dem Update, und rechnen Sie damit, dass der erste Start danach länger dauert, während Ihre Chats migriert werden.

Außerdem wird die Websuche mit SearXNG repariert. Wenn Sie SearXNG installiert haben, nachdem Open WebUI bereits einmal gelaufen war, blieb der Suchendpunkt leer und das Einschalten der Websuche bewirkte nichts. Open WebUI richtet sich nun bei jedem Start selbst auf SearXNG aus, sodass die Websuche unabhängig von der Installationsreihenfolge funktioniert — ein selbst gesetzter Endpunkt bleibt unangetastet.

Vollständige Versionshinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    pl_PL: `Zaktualizowano Open WebUI do wersji 0.11.0.

Duże wydanie, które przebudowuje interfejs od podstaw — z przeprojektowanym widokiem czatu i ustawieniami administratora przeniesionymi obok ustawień osobistych. Dodaje też podagentów, strony folderów, rozgałęzianie czatów, minutniki czatu, zmienne dla czatu i użytkownika, cele powiadomień webhook oraz osobisty panel użycia. Autorzy oznaczają je jako wydanie bezpieczeństwa z kilkoma poprawkami kontroli dostępu.

Ta wersja zmienia schemat bazy danych: przed aktualizacją wykonaj kopię zapasową Open WebUI, a pierwsze uruchomienie po niej potrwa dłużej niż zwykle, gdy migrowane będą Twoje czaty.

Naprawia też wyszukiwanie w sieci z użyciem SearXNG. Jeśli zainstalowałeś SearXNG po tym, jak Open WebUI już raz się uruchomiło, adres wyszukiwania pozostawał pusty, a włączenie wyszukiwania w sieci nic nie dawało. Open WebUI samo kieruje się teraz na SearXNG przy każdym starcie, więc wyszukiwanie działa niezależnie od kolejności instalacji — własnoręcznie ustawiony adres pozostaje nienaruszony.

Pełne informacje o wydaniu: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    fr_FR: `Open WebUI a été mis à jour vers la version 0.11.0.

Une version majeure qui reconstruit l'interface de fond en comble, avec une vue de conversation redessinée et les réglages d'administration désormais regroupés avec vos réglages personnels. Elle ajoute aussi des sous-agents, des pages de dossiers, la bifurcation des conversations, des minuteurs, des variables par conversation et par utilisateur, des destinations de notification par webhook et un tableau de bord d'utilisation personnel. Le projet en amont la signale comme une version de sécurité, avec plusieurs corrections de contrôle d'accès.

Cette version modifie le schéma de la base de données : sauvegardez Open WebUI avant la mise à jour, et attendez-vous à ce que le premier démarrage ensuite soit plus long que d'habitude, le temps que vos conversations soient migrées.

Elle corrige aussi la recherche web avec SearXNG. Si vous avez installé SearXNG après qu'Open WebUI eut déjà démarré une fois, le point d'accès de recherche restait vide et activer la recherche web ne changeait rien. Open WebUI se pointe désormais lui-même vers SearXNG à chaque démarrage : la recherche web fonctionne quel que soit l'ordre d'installation, et un point d'accès que vous avez défini vous-même reste intact.

Notes de version complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
