import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { versionGraph } from '../versions'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { seedFiles } from './initSecretKey'
import { bootstrap } from './bootstrap'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seedFiles,
  setInterfaces,
  setDependencies,
  actions,
  // Last, and after seedFiles: the bootstrap boot needs WEBUI_SECRET_KEY.
  bootstrap,
)

export const uninit = sdk.setupUninit(versionGraph)
