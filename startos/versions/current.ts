import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.13.5:0',
  releaseNotes: {
    en_US: `Updated Open WebUI to 0.13.5.

**Before updating**

- Back up Open WebUI first. The first start after updating converts your existing chat history to a new format, which can take a while on a large history; the web interface becomes ready once it finishes.

**Features**

- Automatic model selection: a router in the model picker sends each question to the model suited to it
- Citations open beside the answer, with jumps to the cited PDF page
- Sending messages in long chats is much faster
- Video generation with ComfyUI
- Folder workspaces, with project instructions read from \`AGENTS.md\` or \`CLAUDE.md\`

**Changes**

- Arena model selection becomes random routers. If you used the built-in Arena, recreate it as a random router.
- Terminals are now called Machines.

**Security**

- Includes upstream security fixes; upstream urges prompt updating.

[Full release notes](https://github.com/open-webui/open-webui/releases/tag/v0.13.5)`,
    es_ES: `Open WebUI actualizado a 0.13.5.

**Antes de actualizar**

- Haga primero una copia de seguridad de Open WebUI. El primer inicio tras la actualización convierte su historial de chats existente a un nuevo formato, lo que puede tardar con un historial grande; la interfaz web estará lista cuando termine.

**Novedades**

- Selección automática de modelo: un enrutador en el selector de modelos envía cada pregunta al modelo adecuado
- Las citas se abren junto a la respuesta, con saltos a la página citada del PDF
- Enviar mensajes en chats largos es mucho más rápido
- Generación de vídeo con ComfyUI
- Espacios de trabajo por carpeta, con instrucciones del proyecto leídas de \`AGENTS.md\` o \`CLAUDE.md\`

**Cambios**

- La selección de modelos Arena pasa a ser enrutadores aleatorios. Si usaba el Arena integrado, vuelva a crearlo como enrutador aleatorio.
- Los terminales ahora se llaman Máquinas.

**Seguridad**

- Incluye correcciones de seguridad de upstream; upstream recomienda actualizar cuanto antes.

[Notas completas de la versión](https://github.com/open-webui/open-webui/releases/tag/v0.13.5)`,
    de_DE: `Open WebUI auf 0.13.5 aktualisiert.

**Vor dem Update**

- Sichern Sie Open WebUI zuerst. Der erste Start nach dem Update wandelt Ihren bestehenden Chatverlauf in ein neues Format um, was bei einem großen Verlauf eine Weile dauern kann; die Weboberfläche ist bereit, sobald dies abgeschlossen ist.

**Neuerungen**

- Automatische Modellauswahl: Ein Router in der Modellauswahl leitet jede Frage an das passende Modell weiter
- Quellenangaben öffnen sich neben der Antwort, mit Sprung zur zitierten PDF-Seite
- Nachrichten in langen Chats werden deutlich schneller gesendet
- Videoerzeugung mit ComfyUI
- Ordner-Arbeitsbereiche, mit Projektanweisungen aus \`AGENTS.md\` oder \`CLAUDE.md\`

**Änderungen**

- Die Arena-Modellauswahl wird zu zufälligen Routern. Wenn Sie die eingebaute Arena genutzt haben, legen Sie sie als zufälligen Router neu an.
- Terminals heißen jetzt Maschinen.

**Sicherheit**

- Enthält Sicherheitskorrekturen von Upstream; Upstream rät zu einem zeitnahen Update.

[Vollständige Versionshinweise](https://github.com/open-webui/open-webui/releases/tag/v0.13.5)`,
    pl_PL: `Zaktualizowano Open WebUI do 0.13.5.

**Przed aktualizacją**

- Najpierw wykonaj kopię zapasową Open WebUI. Pierwsze uruchomienie po aktualizacji konwertuje istniejącą historię czatów do nowego formatu, co przy dużej historii może potrwać; interfejs WWW będzie gotowy po zakończeniu.

**Nowości**

- Automatyczny wybór modelu: router w selektorze modeli kieruje każde pytanie do odpowiedniego modelu
- Cytaty otwierają się obok odpowiedzi, z przejściem do cytowanej strony PDF
- Wysyłanie wiadomości w długich czatach jest znacznie szybsze
- Generowanie wideo za pomocą ComfyUI
- Obszary robocze folderów, z instrukcjami projektu odczytywanymi z \`AGENTS.md\` lub \`CLAUDE.md\`

**Zmiany**

- Wybór modeli Arena staje się losowymi routerami. Jeśli korzystałeś z wbudowanej Areny, utwórz ją ponownie jako losowy router.
- Terminale nazywają się teraz Maszynami.

**Bezpieczeństwo**

- Zawiera poprawki bezpieczeństwa z upstreamu; upstream zaleca szybką aktualizację.

[Pełne informacje o wydaniu](https://github.com/open-webui/open-webui/releases/tag/v0.13.5)`,
    fr_FR: `Open WebUI mis à jour vers 0.13.5.

**Avant la mise à jour**

- Sauvegardez d'abord Open WebUI. Le premier démarrage après la mise à jour convertit votre historique de discussions existant vers un nouveau format, ce qui peut prendre du temps pour un historique volumineux ; l'interface web est prête une fois la conversion terminée.

**Nouveautés**

- Sélection automatique du modèle : un routeur dans le sélecteur de modèles envoie chaque question au modèle adapté
- Les citations s'ouvrent à côté de la réponse, avec accès direct à la page PDF citée
- L'envoi de messages dans les longues discussions est beaucoup plus rapide
- Génération de vidéos avec ComfyUI
- Espaces de travail par dossier, avec des instructions de projet lues depuis \`AGENTS.md\` ou \`CLAUDE.md\`

**Changements**

- La sélection de modèles Arena devient des routeurs aléatoires. Si vous utilisiez l'Arena intégrée, recréez-la en tant que routeur aléatoire.
- Les terminaux s'appellent désormais Machines.

**Sécurité**

- Inclut des correctifs de sécurité en amont ; l'amont recommande de mettre à jour rapidement.

[Notes de version complètes](https://github.com/open-webui/open-webui/releases/tag/v0.13.5)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
