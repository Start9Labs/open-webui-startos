import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.2:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.12.2.

- Adds external apps in channels, side-by-side text revision comparison, and skill archive exports.
- Fixes reconnect loops after sign-in, recurring automation scheduling, tool approvals losing sources, and tool search compatibility with strict providers.
- Includes security fixes for channel message metadata, retrieval access checks, and SCIM administrator deletion.
- Internal update to start-sdk 3.0.6.

Back up before updating: upstream migrates the database on first start, including channel membership changes and missing sign-in records for SCIM-created users. Allow extra time for that first start.

[Upstream 0.12.1 release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.1) · [Upstream 0.12.2 release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.2)`,
    es_ES: `Se ha actualizado Open WebUI a 0.12.2.

- Añade aplicaciones externas en canales, comparación de revisiones de texto en paralelo y exportación de archivos de habilidades.
- Corrige bucles de reconexión tras iniciar sesión, la programación de automatizaciones recurrentes, la pérdida de fuentes al aprobar herramientas y la compatibilidad de la búsqueda de herramientas con proveedores estrictos.
- Incluye correcciones de seguridad para los metadatos de mensajes de canales, las comprobaciones de acceso a la recuperación de documentos y la eliminación de administradores mediante SCIM.
- Actualización interna a start-sdk 3.0.6.

Haz una copia de seguridad antes de actualizar: Open WebUI migra la base de datos en el primer arranque, incluidos cambios en la pertenencia a canales y registros de inicio de sesión que faltan para usuarios creados mediante SCIM. Deja más tiempo para ese primer arranque.

[Notas de la versión original 0.12.1](https://github.com/open-webui/open-webui/releases/tag/v0.12.1) · [Notas de la versión original 0.12.2](https://github.com/open-webui/open-webui/releases/tag/v0.12.2)`,
    de_DE: `Open WebUI wurde auf 0.12.2 aktualisiert.

- Ergänzt externe Apps in Kanälen, Textvergleich von Revisionen nebeneinander und den Export von Skill-Archiven.
- Behebt Wiederverbindungsschleifen nach der Anmeldung, die Planung wiederkehrender Automatisierungen, verlorene Quellen nach Tool-Freigaben und die Kompatibilität der Tool-Suche mit strikten Anbietern.
- Enthält Sicherheitskorrekturen für Kanalnachrichten-Metadaten, Zugriffskontrollen beim Dokumentenabruf und das Löschen von Administratoren über SCIM.
- Internes Update auf start-sdk 3.0.6.

Vor dem Update eine Sicherung erstellen: Open WebUI migriert die Datenbank beim ersten Start, einschließlich Änderungen an Kanalmitgliedschaften und fehlender Anmeldedatensätze für über SCIM erstellte Benutzer. Plane für diesen ersten Start mehr Zeit ein.

[Versionshinweise des Ursprungsprojekts 0.12.1](https://github.com/open-webui/open-webui/releases/tag/v0.12.1) · [Versionshinweise des Ursprungsprojekts 0.12.2](https://github.com/open-webui/open-webui/releases/tag/v0.12.2)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.12.2.

- Dodaje zewnętrzne aplikacje w kanałach, porównywanie wersji tekstu obok siebie i eksport archiwów umiejętności.
- Naprawia pętle ponownego łączenia po zalogowaniu, harmonogramy cyklicznych automatyzacji, utratę źródeł po zatwierdzeniu narzędzi i zgodność wyszukiwania narzędzi z rygorystycznymi dostawcami.
- Zawiera poprawki bezpieczeństwa metadanych wiadomości w kanałach, kontroli dostępu przy pobieraniu dokumentów i usuwania administratorów przez SCIM.
- Wewnętrzna aktualizacja do start-sdk 3.0.6.

Przed aktualizacją wykonaj kopię zapasową: Open WebUI migruje bazę danych przy pierwszym uruchomieniu, w tym członkostwo w kanałach i brakujące rekordy logowania użytkowników utworzonych przez SCIM. Zarezerwuj więcej czasu na to pierwsze uruchomienie.

[Informacje o wydaniu projektu źródłowego 0.12.1](https://github.com/open-webui/open-webui/releases/tag/v0.12.1) · [Informacje o wydaniu projektu źródłowego 0.12.2](https://github.com/open-webui/open-webui/releases/tag/v0.12.2)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.12.2.

- Ajoute les applications externes dans les canaux, la comparaison côte à côte des révisions de texte et l’export d’archives de compétences.
- Corrige les boucles de reconnexion après connexion, la planification des automatisations récurrentes, la perte des sources après approbation des outils et la compatibilité de la recherche d’outils avec les fournisseurs stricts.
- Inclut des correctifs de sécurité pour les métadonnées des messages de canaux, les contrôles d’accès à la recherche documentaire et la suppression d’administrateurs via SCIM.
- Mise à jour interne vers start-sdk 3.0.6.

Sauvegardez avant la mise à jour : Open WebUI migre la base de données au premier démarrage, notamment les adhésions aux canaux et les enregistrements de connexion manquants des utilisateurs créés via SCIM. Prévoyez davantage de temps pour ce premier démarrage.

[Notes de version en amont 0.12.1](https://github.com/open-webui/open-webui/releases/tag/v0.12.1) · [Notes de version en amont 0.12.2](https://github.com/open-webui/open-webui/releases/tag/v0.12.2)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
