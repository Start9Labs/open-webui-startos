import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.3:1',
  releaseNotes: {
    en_US:
      'Installation progress shows each step as it runs — copying the bundled models, then preparing the database and models.',
    es_ES:
      'El progreso de la instalación muestra cada paso a medida que se ejecuta: copiar los modelos incluidos y, después, preparar la base de datos y los modelos.',
    de_DE:
      'Der Installationsfortschritt zeigt jeden Schritt, während er läuft: die mitgelieferten Modelle kopieren und anschließend Datenbank und Modelle vorbereiten.',
    pl_PL:
      'Postęp instalacji pokazuje każdy krok w trakcie jego wykonywania: kopiowanie dołączonych modeli, a następnie przygotowanie bazy danych i modeli.',
    fr_FR:
      "La progression de l'installation affiche chaque étape au fur et à mesure : copie des modèles fournis, puis préparation de la base de données et des modèles.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
