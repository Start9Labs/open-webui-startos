import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  reclaimManagedConfig,
  resolveManagedContext,
  SEARXNG_QUERY_URL_KEY,
} from '../managedConfig'
import { adminExists } from '../webuiConfig'

/**
 * Hand the web-search address back to this package.
 *
 * Open WebUI keeps `web.search.searxng_query_url` pointed at SearXNG on every
 * start, but only while the stored value is still one it wrote — see `isOurs`
 * in managedConfig.ts. Editing the field in Open WebUI's admin settings makes
 * the value the user's, and the automatic handling stops for good. Clearing it
 * again is not a way out: the input is marked `required` upstream, so the form
 * will not save an empty value, and the address itself is an assigned bridge
 * port nobody can be expected to know.
 *
 * That left a database edit over SSH, or a reinstall, as the only recoveries.
 * This action is the supported one.
 */
export const reconnectSearxng = sdk.Action.withoutInput(
  'reconnect-searxng',

  {
    name: i18n('Reconnect SearXNG'),
    description: i18n(
      "Point web search back at SearXNG. Use this if the search address was changed by hand and Open WebUI stopped keeping it up to date — it restores the correct address and resumes maintaining it. Doesn't affect your other settings.",
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  async ({ effects }) => {
    // Same ordering guard as the other actions (issue #15): writing the config
    // table before Open WebUI has built its schema and first admin corrupts
    // onboarding. adminExists() is file-existence gated, so this also never
    // creates an empty webui.db.
    if (!(await adminExists(effects))) {
      throw new Error(
        i18n(
          "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before reconnecting SearXNG.",
        ),
      )
    }

    // `.once()`: an action reads the current bridge address, it doesn't
    // subscribe. Null means SearXNG isn't installed — there is no address to
    // restore, and writing a fabricated one would be worse than saying so.
    const ctx = await resolveManagedContext(effects, 'once')
    if (!ctx.searxng) {
      throw new Error(
        i18n(
          "SearXNG isn't installed on this server, so there is no address to reconnect to. Install SearXNG and start it, then run this action again.",
        ),
      )
    }

    const written = await reclaimManagedConfig(effects, ctx)
    const url = written[SEARXNG_QUERY_URL_KEY] ?? ''

    // Open WebUI reads its configuration at start-up, so the restored address
    // only takes effect — and only shows up in the admin settings page — once
    // the daemon has been restarted.
    await effects.restart()

    return {
      version: '1' as const,
      title: i18n('Success'),
      message: i18n(
        'Web search is pointed back at SearXNG, and Open WebUI is restarting. The address below is now managed for you again — leave it alone and it will stay correct.',
      ),
      result: {
        type: 'single' as const,
        value: url,
        masked: false,
        copyable: true,
        qr: false,
      },
    }
  },
)
