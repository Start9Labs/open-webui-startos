import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mainMounts, webuiDb } from '../utils'

export const resetPassword = sdk.Action.withoutInput(
  'reset-password',

  {
    name: i18n('Reset Admin Password'),
    description: i18n(
      'Reset the admin user password in case you forget it',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  async ({ effects }) => {
    const newPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9',
      len: 22,
    })

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'open-webui' },
      mainMounts,
      'reset-pass',
      async (subc) => {
        await subc.execFail([
          'python3',
          '-c',
          [
            'import sqlite3, bcrypt',
            `new_pw = "${newPassword}"`,
            `hashed = bcrypt.hashpw(new_pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")`,
            `conn = sqlite3.connect("${webuiDb}")`,
            `c = conn.cursor()`,
            `c.execute("SELECT id FROM user WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1")`,
            `row = c.fetchone()`,
            `assert row, "No admin user found"`,
            `c.execute("UPDATE auth SET password = ? WHERE id = ?", (hashed, row[0]))`,
            `conn.commit()`,
            `conn.close()`,
          ].join('\n'),
        ])
      },
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
      },
    }
  },
)
