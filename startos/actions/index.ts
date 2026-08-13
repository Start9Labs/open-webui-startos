import { sdk } from '../sdk'
import { configureBackends } from './configureBackends'
import { reconnectSearxng } from './reconnectSearxng'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(configureBackends)
  .addAction(reconnectSearxng)
  .addAction(resetPassword)
