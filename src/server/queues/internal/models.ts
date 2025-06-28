import { createOpenAI } from '@ai-sdk/openai'
import { env } from '~/env'

export const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL,
})
