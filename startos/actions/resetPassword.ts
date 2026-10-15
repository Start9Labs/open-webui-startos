import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { runAdminAuthScript } from '../utils'
import { adminExists } from '../webuiConfig'

export const resetPassword = sdk.Action.withoutInput(
  'reset-password',

  {
    name: i18n('Reset Admin Password'),
    description: i18n('Reset the admin user password in case you forget it'),
    warning: i18n(
      'Replaces the password of the first admin account and signs it out on every device.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  async ({ effects }) => {
    // Same ordering guard as Configure Backends (issue #15): there's no admin
    // to reset before Open WebUI has initialized its schema and first account.
    // Without this, the query below hits a missing `user` table and surfaces an
    // opaque traceback instead of an actionable message.
    if (!(await adminExists(effects))) {
      throw new Error(
        i18n(
          "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before resetting the password.",
        ),
      )
    }

    const newPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9',
      len: 22,
    })

    await runAdminAuthScript(
      effects,
      `import bcrypt
from open_webui.models.auths import Auths
hashed = bcrypt.hashpw(inputs['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
if not await Auths.update_user_password_by_id(admin_id, hashed):
    raise RuntimeError('Admin password could not be reset')
return 'updated'`,
      { password: newPassword },
    )

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('The new admin password is below'),
      result: {
        type: 'single',
        value: newPassword,
        masked: true,
        copyable: true,
        qr: false,
        launchable: false,
      },
    }
  },
)
