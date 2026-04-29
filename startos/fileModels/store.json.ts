import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const openaiProviderShape = z.object({
  name: z.string(),
  baseUrl: z.string(),
  apiKey: z.string(),
})

const shape = z.object({
  WEBUI_SECRET_KEY: z.string(),
  enableOllama: z.boolean().default(true),
  openaiProviders: z.array(openaiProviderShape).default([]),
})

export type OpenAiProvider = z.infer<typeof openaiProviderShape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: './store.json' },
  shape,
)
