import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.0:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.11.0.

A large release that rebuilds the interface from the ground up, with a redesigned chat view and admin settings moved in alongside your personal settings. It also adds sub-agents, folder pages, chat forking, chat timers, per-chat and per-user variables, webhook notification targets and a personal usage dashboard. Upstream flags this as a security release with several access-control fixes.

This version changes the database schema, so back up Open WebUI before updating, and expect the first start afterwards to take longer than usual while your chats are migrated.

Full release notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    es_ES: `Se ha actualizado Open WebUI a 0.11.0.

Una versión importante que rehace la interfaz desde cero, con una vista de chat rediseñada y la configuración de administración integrada junto a la configuración personal. También añade subagentes, páginas de carpetas, bifurcación de chats, temporizadores, variables por chat y por usuario, destinos de notificación por webhook y un panel de uso personal. El proyecto original la señala como versión de seguridad, con varias correcciones de control de acceso.

Esta versión cambia el esquema de la base de datos: haga una copia de seguridad de Open WebUI antes de actualizar y tenga en cuenta que el primer arranque posterior tardará más de lo habitual mientras se migran sus chats.

Notas de la versión completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    de_DE: `Open WebUI wurde auf 0.11.0 aktualisiert.

Eine große Version, die die Oberfläche von Grund auf neu aufbaut, mit überarbeiteter Chat-Ansicht und Administrationseinstellungen, die nun neben den persönlichen Einstellungen liegen. Hinzu kommen Unteragenten, Ordnerseiten, das Abzweigen von Chats, Chat-Timer, Variablen pro Chat und pro Benutzer, Webhook-Benachrichtigungsziele und eine persönliche Nutzungsübersicht. Das Ursprungsprojekt kennzeichnet diese Version als Sicherheitsrelease mit mehreren Korrekturen an der Zugriffskontrolle.

Diese Version ändert das Datenbankschema: Sichern Sie Open WebUI vor dem Update, und rechnen Sie damit, dass der erste Start danach länger dauert, während Ihre Chats migriert werden.

Vollständige Versionshinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    pl_PL: `Zaktualizowano Open WebUI do wersji 0.11.0.

Duże wydanie, które przebudowuje interfejs od podstaw — z przeprojektowanym widokiem czatu i ustawieniami administratora przeniesionymi obok ustawień osobistych. Dodaje też podagentów, strony folderów, rozgałęzianie czatów, minutniki czatu, zmienne dla czatu i użytkownika, cele powiadomień webhook oraz osobisty panel użycia. Autorzy oznaczają je jako wydanie bezpieczeństwa z kilkoma poprawkami kontroli dostępu.

Ta wersja zmienia schemat bazy danych: przed aktualizacją wykonaj kopię zapasową Open WebUI, a pierwsze uruchomienie po niej potrwa dłużej niż zwykle, gdy migrowane będą Twoje czaty.

Pełne informacje o wydaniu: https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
    fr_FR: `Open WebUI a été mis à jour vers la version 0.11.0.

Une version majeure qui reconstruit l'interface de fond en comble, avec une vue de conversation redessinée et les réglages d'administration désormais regroupés avec vos réglages personnels. Elle ajoute aussi des sous-agents, des pages de dossiers, la bifurcation des conversations, des minuteurs, des variables par conversation et par utilisateur, des destinations de notification par webhook et un tableau de bord d'utilisation personnel. Le projet en amont la signale comme une version de sécurité, avec plusieurs corrections de contrôle d'accès.

Cette version modifie le schéma de la base de données : sauvegardez Open WebUI avant la mise à jour, et attendez-vous à ce que le premier démarrage ensuite soit plus long que d'habitude, le temps que vos conversations soient migrées.

Notes de version complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
