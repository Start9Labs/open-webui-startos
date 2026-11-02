import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.ofVolumes('open-webui', 'startos').setOptions({
      // Dependencies' `public` volumes, mounted by backends.ts.
      exclude: ['/*-public/'],
    }),
)
