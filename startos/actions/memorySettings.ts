import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { adminExists, readConfig, writeConfig } from '../webuiConfig'

const { InputSpec, Value } = sdk

/**
 * Open WebUI's memory tuning (issue #30). These keys are seeded from env vars
 * (`ENABLE_MEMORY_BACKGROUND_REVIEW`, `MEMORIES_REVIEW_INTERVAL_TURNS`,
 * `MEMORIES_USER_CHAR_LIMIT`, `MEMORIES_CONTEXT_CHAR_LIMIT`) into the `config`
 * table, and the admin UI has no field for them, so this action is the only
 * way to change them on StartOS. The database stays the source of truth: the
 * form prefills from it and writes back to it, with nothing kept in store.json.
 *
 * Upstream reads them with `Config.get_many` on every chat request, which
 * queries the table directly, so a write takes effect without a restart.
 */
const KEYS = {
  backgroundReview: 'memories.background_review.enable',
  reviewInterval: 'memories.review_interval_turns',
  userCharLimit: 'memories.user_char_limit',
  contextCharLimit: 'memories.context_char_limit',
} as const

// Upstream's defaults (config.py) and floor: utils/memory.py clamps both
// character limits to at least 250 and the interval to at least 1.
const DEFAULTS = {
  backgroundReview: false,
  reviewInterval: 10,
  userCharLimit: 2000,
  contextCharLimit: 2000,
}
const MIN_CHAR_LIMIT = 250

const inputSpec = InputSpec.of({
  backgroundReview: Value.toggle({
    name: i18n('Background memory review'),
    description: i18n(
      'Every few messages, Open WebUI asks the chat model to review the conversation and add, update or remove your memories by itself. Each review is an extra request to the model, which takes time on a local model and costs money on a paid API. It only runs while Memory is turned on in Open WebUI.',
    ),
    default: DEFAULTS.backgroundReview,
  }),
  reviewInterval: Value.number({
    name: i18n('Review interval'),
    description: i18n(
      'How many of your messages pass between background reviews. Lower means memories update sooner, with more extra requests to the model.',
    ),
    required: true,
    default: DEFAULTS.reviewInterval,
    min: 1,
    max: null,
    step: null,
    integer: true,
    units: i18n('messages'),
    placeholder: null,
  }),
  userCharLimit: Value.number({
    name: i18n('Memory about you'),
    description: i18n(
      'The most text from memories about you (facts, preferences, instructions) added to each chat. Anything beyond it is left out. A higher limit uses more of the model context.',
    ),
    required: true,
    default: DEFAULTS.userCharLimit,
    min: MIN_CHAR_LIMIT,
    max: null,
    step: null,
    integer: true,
    units: i18n('characters'),
    placeholder: null,
  }),
  contextCharLimit: Value.number({
    name: i18n('Related memory'),
    description: i18n(
      'The most text from other memories related to the conversation added to each chat. Anything beyond it is left out. A higher limit uses more of the model context.',
    ),
    required: true,
    default: DEFAULTS.contextCharLimit,
    min: MIN_CHAR_LIMIT,
    max: null,
    step: null,
    integer: true,
    units: i18n('characters'),
    placeholder: null,
  }),
})

const asInt = (v: unknown, fallback: number, min: number): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isInteger(n) && n >= min ? n : fallback
}

export const memorySettings = sdk.Action.withInput(
  'memory-settings',

  {
    name: i18n('Memory Settings'),
    description: i18n(
      'Tune how Open WebUI remembers things about you between chats: whether the model updates memories by itself, how often, and how much memory goes into each chat.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  inputSpec,

  async ({ effects }) => {
    const stored = await readConfig(effects, Object.values(KEYS))
    const review = stored[KEYS.backgroundReview]
    return {
      backgroundReview:
        typeof review === 'boolean' ? review : DEFAULTS.backgroundReview,
      reviewInterval: asInt(
        stored[KEYS.reviewInterval],
        DEFAULTS.reviewInterval,
        1,
      ),
      userCharLimit: asInt(
        stored[KEYS.userCharLimit],
        DEFAULTS.userCharLimit,
        MIN_CHAR_LIMIT,
      ),
      contextCharLimit: asInt(
        stored[KEYS.contextCharLimit],
        DEFAULTS.contextCharLimit,
        MIN_CHAR_LIMIT,
      ),
    }
  },

  async ({ effects, input }) => {
    // Same ordering guard as the other actions (issue #15): writing the config
    // table before Open WebUI has built its schema and first admin corrupts
    // onboarding. adminExists() is file-existence gated, so this also never
    // creates an empty webui.db.
    if (!(await adminExists(effects))) {
      throw new Error(
        i18n(
          "Open WebUI hasn't been set up yet. Start the service, open the Web UI, and register the first account (which becomes the admin) before changing memory settings.",
        ),
      )
    }

    await writeConfig(effects, {
      [KEYS.backgroundReview]: input.backgroundReview,
      [KEYS.reviewInterval]: input.reviewInterval,
      [KEYS.userCharLimit]: input.userCharLimit,
      [KEYS.contextCharLimit]: input.contextCharLimit,
    })

    return {
      version: '1' as const,
      title: i18n('Success'),
      message: i18n(
        'Memory settings saved. They apply to the next chat message, with no restart.',
      ),
      result: null,
    }
  },
)
