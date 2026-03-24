import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const initSecretKey = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {
      WEBUI_SECRET_KEY: utils.getDefaultString({
        charset: 'a-z,A-Z,1-9',
        len: 64,
      }),
    })
  } else {
    await storeJson.merge(effects, {})
  }
})
