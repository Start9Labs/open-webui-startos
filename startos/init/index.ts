import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { versionGraph } from '../install/versionGraph'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { initSecretKey } from './initSecretKey'

export const init = sdk.setupInit(
  initSecretKey,
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
)

export const uninit = sdk.setupUninit(versionGraph)
