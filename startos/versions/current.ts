import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.5:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.12.5.

- Includes security fixes; upstream strongly recommends updating.
- Adds pages and live presence in notes, faster chat and knowledge-base searches, and lower-memory document embedding.
- Fixes chat search filters, inflated token counts, interrupted tool calls, and model selection persistence.
- Internal update to start-sdk 3.1.1.

Back up before updating: upstream converts existing notes to pages and moves their attachments into the first page. Check notes and attachments after updating. Automation failure notifications now go to targets for the owner rather than system-only webhooks; enable the event in Settings > Notifications if needed.

[Full upstream release notes](https://github.com/open-webui/open-webui/releases/tag/v0.12.5)`,
    es_ES: `Se ha actualizado Open WebUI a 0.12.5.

- Incluye correcciones de seguridad; el proyecto original recomienda encarecidamente actualizar.
- Añade páginas y presencia en tiempo real en las notas, búsquedas más rápidas en chats y bases de conocimiento e incrustación de documentos con menor uso de memoria.
- Corrige los filtros de búsqueda de chats, los recuentos de tokens inflados, las llamadas a herramientas interrumpidas y la persistencia del modelo seleccionado.
- Actualización interna a start-sdk 3.1.1.

Haz una copia de seguridad antes de actualizar: Open WebUI convierte las notas existentes en páginas y mueve sus archivos adjuntos a la primera página. Comprueba las notas y sus adjuntos después de actualizar. Las notificaciones de fallos de automatización ahora se envían a los destinos del propietario en lugar de a los webhooks exclusivos del sistema; activa el evento en Ajustes > Notificaciones si lo necesitas.

[Notas completas de la versión original](https://github.com/open-webui/open-webui/releases/tag/v0.12.5)`,
    de_DE: `Open WebUI wurde auf 0.12.5 aktualisiert.

- Enthält Sicherheitskorrekturen; das Ursprungsprojekt empfiehlt dringend ein Update.
- Ergänzt Seiten und Live-Anwesenheit in Notizen, schnellere Chat- und Wissensdatenbank-Suchen sowie speichersparendere Dokumenten-Einbettung.
- Behebt Chat-Suchfilter, überhöhte Token-Zahlen, unterbrochene Tool-Aufrufe und das Speichern der Modellauswahl.
- Internes Update auf start-sdk 3.1.1.

Vor dem Update eine Sicherung erstellen: Open WebUI wandelt bestehende Notizen in Seiten um und verschiebt ihre Anhänge auf die erste Seite. Notizen und Anhänge nach dem Update prüfen. Fehlermeldungen von Automatisierungen gehen nun an Benachrichtigungsziele des Besitzers statt an reine System-Webhooks; das Ereignis bei Bedarf unter Einstellungen > Benachrichtigungen aktivieren.

[Vollständige Versionshinweise des Ursprungsprojekts](https://github.com/open-webui/open-webui/releases/tag/v0.12.5)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.12.5.

- Zawiera poprawki bezpieczeństwa; autorzy zdecydowanie zalecają aktualizację.
- Dodaje strony i obecność na żywo w notatkach, szybsze wyszukiwanie czatów i baz wiedzy oraz oszczędniejsze pamięciowo tworzenie osadzeń dokumentów.
- Naprawia filtry wyszukiwania czatów, zawyżone liczniki tokenów, przerywane wywołania narzędzi i zapisywanie wybranego modelu.
- Wewnętrzna aktualizacja do start-sdk 3.1.1.

Przed aktualizacją wykonaj kopię zapasową: Open WebUI przekształca istniejące notatki w strony i przenosi ich załączniki na pierwszą stronę. Po aktualizacji sprawdź notatki i załączniki. Powiadomienia o błędach automatyzacji trafiają teraz do celów powiadomień właściciela zamiast do webhooków przeznaczonych wyłącznie dla systemu; w razie potrzeby włącz to zdarzenie w Ustawieniach > Powiadomienia.

[Pełne informacje o wydaniu projektu źródłowego](https://github.com/open-webui/open-webui/releases/tag/v0.12.5)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.12.5.

- Inclut des correctifs de sécurité ; le projet en amont recommande vivement la mise à jour.
- Ajoute des pages et la présence en temps réel dans les notes, accélère la recherche dans les conversations et bases de connaissances et réduit la mémoire utilisée pour les plongements de documents.
- Corrige les filtres de recherche des conversations, les nombres de jetons gonflés, les appels d'outils interrompus et la conservation du modèle choisi.
- Mise à jour interne vers start-sdk 3.1.1.

Sauvegardez avant la mise à jour : Open WebUI convertit les notes existantes en pages et déplace leurs pièces jointes dans la première page. Vérifiez les notes et pièces jointes après la mise à jour. Les notifications d'échec des automatisations vont désormais aux cibles du propriétaire plutôt qu'aux webhooks réservés au système ; activez cet événement dans Paramètres > Notifications si nécessaire.

[Notes de version complètes du projet en amont](https://github.com/open-webui/open-webui/releases/tag/v0.12.5)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
