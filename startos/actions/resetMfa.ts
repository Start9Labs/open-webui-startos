import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { runAdminAuthScript } from '../utils'
import { adminExists } from '../webuiConfig'

export const resetMfa = sdk.Action.withoutInput(
  'reset-admin-mfa',
  {
    name: i18n('Reset Admin Two-Factor Authentication'),
    description: i18n(
      'Recover the first admin account when its authenticator and recovery codes are lost.',
    ),
    warning: i18n(
      'Replaces the first admin account\'s authenticator and recovery codes and signs it out on every device. Only run this to recover that account.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  async ({ effects }) => {
    if (!(await adminExists(effects))) {
      throw new Error(
        i18n(
          'Create the first admin account in the Web UI before recovering two-factor authentication.',
        ),
      )
    }
    const token = await runAdminAuthScript(
      effects,
      `from open_webui.utils.mfa import reset_mfa
return await reset_mfa(admin_email, 'StartOS administrator account recovery')`,
    )
    return {
      version: '1',
      title: i18n('Success'),
      message: i18n(
        'Sign in with your password, use this one-time recovery token when prompted, and enroll a new authenticator. The token expires in 30 minutes. If you also need to reset your password, do that first: resetting it invalidates this token.',
      ),
      result: {
        type: 'single',
        value: token,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
