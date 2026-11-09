import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.3:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.13.3.

- Adds coding agents to scheduled automations and lets you change terminals and working folders during a chat.
- Fixes copy buttons over plain HTTP, DeepSeek thinking with knowledge and memories through llama.cpp, and knowledge searches containing punctuation.

- Includes security fixes; upstream strongly recommends updating.
- Speeds up large chats and channels, reduces tool-chat costs through better prompt caching, and adds resizable split panes with layouts remembered per chat.
- Fixes chats and comments failing over plain HTTP, interrupted Ollama tool calls, and tool approvals in side chats.

New Memory Settings action: turn on background memory review, set how often it runs, and set how much memory goes into each chat.

Back up Open WebUI before updating: upstream adds database tables and channel indexes on first start. Allow extra time for that start.

Attached files are no longer preloaded by default with native function calling. For models without file tools, enable **Preload files** in the model's **Capabilities**. Small files are included in full when read, with a default threshold of 50,000 characters. Retrieval defaults increase to 10 results and 1,024-character chunks unless you saved your own values; existing documents keep their chunks until reindexed.

Side chats are saved unless Temporary Chat is enabled. With native function calling, custom pipes must handle memory and knowledge context arriving as hidden tool results, which can make a tool message the last message.

[Upstream 0.13.1 release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) · [Upstream 0.13.2 release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.2) · [Upstream 0.13.3 release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.3)`,
    es_ES: `Se ha actualizado Open WebUI a 0.13.3.

- Añade agentes de programación a las automatizaciones programadas y permite cambiar de terminal y carpeta de trabajo durante un chat.
- Corrige los botones de copia por HTTP sin cifrar, el modo de razonamiento de DeepSeek con conocimiento y memoria a través de llama.cpp y las búsquedas de conocimiento con signos de puntuación.

- Incluye correcciones de seguridad; el proyecto original recomienda encarecidamente actualizar.
- Acelera los chats grandes y los canales, reduce el coste de las conversaciones con herramientas mediante una mejor caché de instrucciones y añade paneles divididos redimensionables cuya distribución se recuerda por chat.
- Corrige los fallos de chats y comentarios a través de HTTP sin cifrar, las llamadas a herramientas de Ollama interrumpidas y las aprobaciones de herramientas en chats laterales.

Nueva acción Ajustes de memoria: activa la revisión de memoria en segundo plano, elige cada cuánto se ejecuta y cuánta memoria entra en cada chat.

Haz una copia de seguridad de Open WebUI antes de actualizar: el proyecto original añade tablas e índices de canales a la base de datos en el primer arranque. Deja más tiempo para ese arranque.

Los archivos adjuntos ya no se precargan por defecto con llamadas nativas a funciones. Para modelos sin herramientas de archivos, activa **Precargar archivos** en las **Capacidades** del modelo. Los archivos pequeños se incluyen completos al leerlos, con un umbral predeterminado de 50.000 caracteres. Los valores predeterminados de recuperación aumentan a 10 resultados y fragmentos de 1.024 caracteres, salvo que hayas guardado tus propios valores; los documentos existentes conservan sus fragmentos hasta que se reindexen.

Los chats laterales se guardan salvo que esté activado el chat temporal. Con llamadas nativas a funciones, las canalizaciones personalizadas deben admitir que el contexto de memoria y conocimiento llegue como resultados ocultos de herramientas, por lo que el último mensaje puede ser de una herramienta.

[Notas de la versión original 0.13.1](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) · [Notas de la versión original 0.13.2](https://github.com/open-webui/open-webui/releases/tag/v0.13.2) · [Notas de la versión original 0.13.3](https://github.com/open-webui/open-webui/releases/tag/v0.13.3)`,
    de_DE: `Open WebUI wurde auf 0.13.3 aktualisiert.

- Ergänzt Programmieragenten in geplanten Automatisierungen und erlaubt den Wechsel von Terminal und Arbeitsordner während eines Chats.
- Behebt Kopierschaltflächen über unverschlüsseltes HTTP, den DeepSeek-Denkmodus mit Wissen und Erinnerungen über llama.cpp sowie Wissenssuchen mit Satzzeichen.

- Enthält Sicherheitskorrekturen; das Ursprungsprojekt empfiehlt dringend ein Update.
- Beschleunigt große Chats und Kanäle, senkt durch verbessertes Prompt-Caching die Kosten für Chats mit Tools und ergänzt größenverstellbare geteilte Ansichten, deren Anordnung pro Chat gespeichert wird.
- Behebt Fehler bei Chats und Kommentaren über unverschlüsseltes HTTP, unterbrochene Ollama-Tool-Aufrufe und Tool-Freigaben in Seitenchats.

Neue Aktion Gedächtnis-Einstellungen: Gedächtnisprüfung im Hintergrund einschalten, festlegen, wie oft sie läuft und wie viel Erinnerung in jeden Chat einfließt.

Vor dem Update Open WebUI sichern: Beim ersten Start ergänzt das Ursprungsprojekt Datenbanktabellen und Kanalindizes. Für diesen Start mehr Zeit einplanen.

Angehängte Dateien werden bei nativen Funktionsaufrufen standardmäßig nicht mehr vorgeladen. Für Modelle ohne Datei-Tools **Dateien vorladen** unter den **Fähigkeiten** des Modells aktivieren. Kleine Dateien werden beim Lesen vollständig eingebunden; der Standardschwellenwert beträgt 50.000 Zeichen. Die Abrufstandardwerte steigen auf 10 Ergebnisse und Abschnitte mit 1.024 Zeichen, sofern keine eigenen Werte gespeichert sind; bestehende Dokumente behalten ihre Abschnitte bis zur Neuindizierung.

Seitenchats werden gespeichert, sofern temporäre Chats nicht aktiviert sind. Bei nativen Funktionsaufrufen müssen eigene Pipes Speicher- und Wissenskontext als verborgene Tool-Ergebnisse verarbeiten können; dadurch kann die letzte Nachricht eine Tool-Nachricht sein.

[Versionshinweise des Ursprungsprojekts 0.13.1](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) · [Versionshinweise des Ursprungsprojekts 0.13.2](https://github.com/open-webui/open-webui/releases/tag/v0.13.2) · [Versionshinweise des Ursprungsprojekts 0.13.3](https://github.com/open-webui/open-webui/releases/tag/v0.13.3)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.13.3.

- Dodaje agentów programistycznych do zaplanowanych automatyzacji i pozwala zmieniać terminal oraz katalog roboczy podczas czatu.
- Naprawia przyciski kopiowania przez nieszyfrowany HTTP, tryb rozumowania DeepSeek z wiedzą i pamięcią przez llama.cpp oraz wyszukiwanie wiedzy ze znakami interpunkcyjnymi.

- Zawiera poprawki bezpieczeństwa; autorzy zdecydowanie zalecają aktualizację.
- Przyspiesza duże czaty i kanały, obniża koszty rozmów z narzędziami dzięki lepszemu buforowaniu promptów i dodaje panele o zmiennym rozmiarze z układem zapamiętywanym dla każdego czatu.
- Naprawia błędy czatów i komentarzy przez nieszyfrowany HTTP, przerywane wywołania narzędzi Ollama i zatwierdzanie narzędzi w czatach bocznych.

Nowa akcja Ustawienia pamięci: włącz przegląd pamięci w tle, ustaw, jak często ma działać i ile pamięci trafia do każdego czatu.

Przed aktualizacją wykonaj kopię zapasową Open WebUI: przy pierwszym uruchomieniu aplikacja dodaje tabele bazy danych i indeksy kanałów. Zarezerwuj więcej czasu na to uruchomienie.

Załączniki nie są już domyślnie wczytywane z wyprzedzeniem przy natywnym wywoływaniu funkcji. Dla modeli bez narzędzi plikowych włącz **Wstępne wczytywanie plików** w **Możliwościach** modelu. Małe pliki są odczytywane w całości, z domyślnym progiem 50 000 znaków. Domyślne wartości wyszukiwania rosną do 10 wyników i fragmentów po 1024 znaki, chyba że zapisano własne wartości; istniejące dokumenty zachowują fragmenty do ponownego indeksowania.

Czaty boczne są zapisywane, chyba że włączono czat tymczasowy. Przy natywnym wywoływaniu funkcji własne potoki muszą obsługiwać kontekst pamięci i wiedzy jako ukryte wyniki narzędzi, przez co ostatnią wiadomością może być wiadomość narzędzia.

[Informacje o wydaniu projektu źródłowego 0.13.1](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) · [Informacje o wydaniu projektu źródłowego 0.13.2](https://github.com/open-webui/open-webui/releases/tag/v0.13.2) · [Informacje o wydaniu projektu źródłowego 0.13.3](https://github.com/open-webui/open-webui/releases/tag/v0.13.3)`,
    fr_FR: `Open WebUI a été mis à jour vers 0.13.3.

- Ajoute les agents de programmation aux automatisations planifiées et permet de changer de terminal et de dossier de travail pendant une conversation.
- Corrige les boutons de copie en HTTP non chiffré, le mode de raisonnement DeepSeek avec les connaissances et les souvenirs via llama.cpp, ainsi que les recherches de connaissances contenant de la ponctuation.

- Inclut des correctifs de sécurité ; le projet en amont recommande vivement la mise à jour.
- Accélère les grandes conversations et les canaux, réduit le coût des conversations avec outils grâce à une meilleure mise en cache des instructions et ajoute des volets redimensionnables dont la disposition est mémorisée par conversation.
- Corrige les échecs des conversations et commentaires en HTTP non chiffré, les appels d'outils Ollama interrompus et les autorisations d'outils dans les conversations latérales.

Nouvelle action Paramètres de mémoire : activez la révision de la mémoire en arrière-plan, choisissez sa fréquence et la quantité de mémoire ajoutée à chaque chat.

Sauvegardez Open WebUI avant la mise à jour : au premier démarrage, le projet en amont ajoute des tables de base de données et des index de canaux. Prévoyez davantage de temps pour ce démarrage.

Les fichiers joints ne sont plus préchargés par défaut avec les appels de fonctions natifs. Pour les modèles sans outils de fichiers, activez **Précharger les fichiers** dans les **Capacités** du modèle. Les petits fichiers sont inclus intégralement à la lecture, avec un seuil par défaut de 50 000 caractères. Les valeurs par défaut de récupération passent à 10 résultats et à des fragments de 1 024 caractères, sauf si vous avez enregistré vos propres valeurs ; les documents existants conservent leurs fragments jusqu'à leur réindexation.

Les conversations latérales sont enregistrées sauf si le mode temporaire est activé. Avec les appels de fonctions natifs, les pipelines personnalisés doivent accepter le contexte de mémoire et de connaissances sous forme de résultats d'outils masqués : le dernier message peut donc être un message d'outil.

[Notes de version en amont 0.13.1](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) · [Notes de version en amont 0.13.2](https://github.com/open-webui/open-webui/releases/tag/v0.13.2) · [Notes de version en amont 0.13.3](https://github.com/open-webui/open-webui/releases/tag/v0.13.3)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
