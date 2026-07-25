import { sdk } from './sdk'

export const uiPort = 8080

export const mainMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'open-webui',
  subpath: null,
  mountpoint: '/app/backend/data',
  readonly: false,
})

export const webuiDb = '/app/backend/data/webui.db'
