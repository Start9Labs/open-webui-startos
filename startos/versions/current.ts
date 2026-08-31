import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.3:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.11.3, taking in 0.11.2 along the way.

Upstream flags 0.11.2 as a security release and recommends updating.

The fixes you are most likely to notice: a conversation no longer breaks part way through and stops showing the reply until you reload, and chats already saved in that state work again; a reply written under an earlier message stays attached to it, so branch arrows, exports and later edits keep the whole conversation in view, and chats already missing that link are repaired when opened; a reply from a reasoning model streams to the end instead of freezing after its first few words; a model's reasoning after it uses a tool stays in Thoughts instead of being written into the reply as ordinary text; text containing angle brackets and a dollar sign is no longer stripped from your message; and a model switched off in the admin list stays in view so you can switch it back on. Searching and filtering by tag now ignore letter case for accented and non-Latin text.

Also new: document and slide previews gain numbered page thumbnails you can click, you can name a font for the interface to use, and accessibility mode lifts the contrast of more of the interface, menus and the model picker included.

If a database upgrade fails, Open WebUI now stops at the error that caused it rather than starting half updated — the cause of the missing 'chat.timer_at' column reported after upgrading from 0.11.0, 0.11.1 or 0.11.2.

Full release notes: https://github.com/open-webui/open-webui/releases/tag/v0.11.3`,
    es_ES: `Se ha actualizado Open WebUI a 0.11.3, incorporando también la versión 0.11.2.

El proyecto original señala la 0.11.2 como versión de seguridad y recomienda actualizar.

Las correcciones que más se notan: una conversación ya no se rompe a mitad y deja de mostrar la respuesta hasta recargar, y los chats guardados en ese estado vuelven a funcionar; una respuesta escrita bajo un mensaje anterior permanece unida a él, de modo que las flechas de ramificación, las exportaciones y las ediciones posteriores mantienen toda la conversación a la vista, y los chats a los que ya les faltaba ese vínculo se reparan al abrirlos; la respuesta de un modelo de razonamiento se transmite hasta el final en lugar de congelarse tras las primeras palabras; el razonamiento de un modelo tras usar una herramienta permanece en Pensamientos en lugar de escribirse en la respuesta como texto normal; el texto con corchetes angulares y un signo de dólar ya no se elimina de su mensaje; y un modelo desactivado en el panel de administración sigue visible para poder reactivarlo. La búsqueda y el filtrado por etiqueta ya ignoran mayúsculas y minúsculas en textos acentuados y no latinos.

Novedades: las vistas previas de documentos y presentaciones incluyen miniaturas de página numeradas en las que puede hacer clic, puede indicar la fuente tipográfica que usará la interfaz, y el modo de accesibilidad aumenta el contraste de más partes de la interfaz, incluidos los menús y el selector de modelos.

Si una actualización de la base de datos falla, Open WebUI ahora se detiene en el error que la causó en lugar de arrancar a medio actualizar: es el origen de la columna 'chat.timer_at' ausente que se comunicó al actualizar desde 0.11.0, 0.11.1 o 0.11.2.

Notas de la versión completas: https://github.com/open-webui/open-webui/releases/tag/v0.11.3`,
    de_DE: `Open WebUI wurde auf 0.11.3 aktualisiert und nimmt dabei auch 0.11.2 mit.

Das Ursprungsprojekt kennzeichnet 0.11.2 als Sicherheitsrelease und empfiehlt die Aktualisierung.

Die auffälligsten Korrekturen: Eine Unterhaltung bricht nicht mehr mittendrin ab und zeigt die Antwort erst nach einem Neuladen wieder an, und bereits in diesem Zustand gespeicherte Chats funktionieren wieder; eine Antwort unter einer früheren Nachricht bleibt mit dieser verknüpft, sodass Verzweigungspfeile, Exporte und spätere Bearbeitungen die gesamte Unterhaltung im Blick behalten, und Chats, denen diese Verknüpfung bereits fehlt, werden beim Öffnen repariert; die Antwort eines Reasoning-Modells wird bis zum Ende gestreamt, statt nach den ersten Worten einzufrieren; die Überlegungen eines Modells nach dem Einsatz eines Werkzeugs bleiben in den Gedanken, statt als gewöhnlicher Text in die Antwort geschrieben zu werden; Text mit spitzen Klammern und einem Dollarzeichen wird nicht mehr aus Ihrer Nachricht entfernt; und ein in der Administrationsliste abgeschaltetes Modell bleibt sichtbar, sodass Sie es wieder einschalten können. Suche und Filterung nach Tags ignorieren nun Groß- und Kleinschreibung bei akzentuierten und nicht lateinischen Texten.

Ebenfalls neu: Dokument- und Folienvorschauen erhalten nummerierte Seitenminiaturen zum Anklicken, Sie können eine Schriftart für die Oberfläche angeben, und der Barrierefreiheitsmodus hebt den Kontrast in weiteren Bereichen an, einschließlich der Menüs und der Modellauswahl.

Schlägt eine Aktualisierung der Datenbank fehl, hält Open WebUI nun bei dem verursachenden Fehler an, statt halb aktualisiert zu starten — die Ursache der fehlenden Spalte 'chat.timer_at', die nach einem Update von 0.11.0, 0.11.1 oder 0.11.2 gemeldet wurde.

Vollständige Versionshinweise: https://github.com/open-webui/open-webui/releases/tag/v0.11.3`,
    pl_PL: `Zaktualizowano Open WebUI do wersji 0.11.3, obejmując po drodze także 0.11.2.

Autorzy oznaczają wersję 0.11.2 jako wydanie bezpieczeństwa i zalecają aktualizację.

Najbardziej widoczne poprawki: rozmowa nie urywa się już w połowie i nie przestaje pokazywać odpowiedzi do czasu przeładowania, a czaty zapisane w takim stanie znów działają; odpowiedź zapisana pod wcześniejszą wiadomością pozostaje z nią powiązana, dzięki czemu strzałki gałęzi, eksporty i późniejsze edycje zachowują całą rozmowę, a czaty, w których tego powiązania już brakowało, są naprawiane przy otwarciu; odpowiedź modelu rozumującego przesyła się do końca zamiast zatrzymywać się po pierwszych słowach; rozumowanie modelu po użyciu narzędzia zostaje w sekcji Przemyślenia, zamiast trafiać do odpowiedzi jako zwykły tekst; tekst zawierający nawiasy ostre i znak dolara nie jest już usuwany z Twojej wiadomości; a model wyłączony na liście administratora pozostaje widoczny, więc można go włączyć ponownie. Wyszukiwanie i filtrowanie po etykietach nie rozróżnia już wielkości liter w tekstach z akcentami i niełacińskich.

Nowości: podglądy dokumentów i prezentacji zyskują numerowane miniatury stron, które można kliknąć, można wskazać krój pisma dla interfejsu, a tryb dostępności podnosi kontrast w kolejnych częściach interfejsu, w tym w menu i w wyborze modelu.

Jeśli aktualizacja bazy danych się nie powiedzie, Open WebUI zatrzymuje się teraz na błędzie, który ją spowodował, zamiast uruchamiać się w połowie zaktualizowany — to przyczyna brakującej kolumny 'chat.timer_at' zgłaszanej po aktualizacji z wersji 0.11.0, 0.11.1 lub 0.11.2.

Pełne informacje o wydaniu: https://github.com/open-webui/open-webui/releases/tag/v0.11.3`,
    fr_FR: `Open WebUI a été mis à jour vers la version 0.11.3, en intégrant au passage la 0.11.2.

Le projet en amont signale la 0.11.2 comme une version de sécurité et recommande la mise à jour.

Les correctifs les plus visibles : une conversation ne se rompt plus en cours de route en cessant d'afficher la réponse jusqu'au rechargement, et les conversations déjà enregistrées dans cet état fonctionnent de nouveau ; une réponse écrite sous un message antérieur y reste rattachée, de sorte que les flèches de branche, les exports et les modifications ultérieures conservent toute la conversation, et les conversations auxquelles ce lien manquait déjà sont réparées à l'ouverture ; la réponse d'un modèle de raisonnement se diffuse jusqu'au bout au lieu de se figer après les premiers mots ; le raisonnement d'un modèle après l'usage d'un outil reste dans Réflexions au lieu d'être écrit dans la réponse comme du texte ordinaire ; un texte contenant des chevrons et un signe dollar n'est plus retiré de votre message ; et un modèle désactivé dans la liste d'administration reste visible pour pouvoir être réactivé. La recherche et le filtrage par étiquette ignorent désormais la casse pour les textes accentués et non latins.

Également nouveau : les aperçus de documents et de diapositives offrent des miniatures de pages numérotées sur lesquelles cliquer, vous pouvez indiquer une police pour l'interface, et le mode d'accessibilité renforce le contraste sur davantage d'éléments, menus et sélecteur de modèles compris.

Si une mise à niveau de la base de données échoue, Open WebUI s'arrête maintenant sur l'erreur qui l'a causée au lieu de démarrer à moitié mis à jour — à l'origine de la colonne 'chat.timer_at' manquante signalée après une mise à jour depuis 0.11.0, 0.11.1 ou 0.11.2.

Notes de version complètes : https://github.com/open-webui/open-webui/releases/tag/v0.11.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
