import { sdk } from '../sdk'
import { configureBackends } from './configureBackends'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(configureBackends)
  .addAction(resetPassword)
