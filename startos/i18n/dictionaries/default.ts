export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Open WebUI!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  'Web UI': 4,
  'The web interface of Open WebUI': 5,
  'Reset Admin Password': 6,
  'Reset the admin user password in case you forget it': 7,
  'Success': 8,
  'The new admin password is below': 9,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
