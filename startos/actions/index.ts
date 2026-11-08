import { sdk } from '../sdk'
import { configureBackends } from './configureBackends'
import { reconnectSearxng } from './reconnectSearxng'
import { resetPassword } from './resetPassword'
import { resetMfa } from './resetMfa'
import { memorySettings } from './memorySettings'

export const actions = sdk.Actions.of()
  .addAction(configureBackends)
  .addAction(reconnectSearxng)
  .addAction(memorySettings)
  .addAction(resetPassword)
  .addAction(resetMfa)
