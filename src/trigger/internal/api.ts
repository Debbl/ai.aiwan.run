import { initClient } from '@ts-rest/core'
import { env } from '~/env'
import { contract } from '~/shared/contract'

export const baseUrl = 'https://ai.aiwan.run'

export const api = initClient(contract, {
  baseUrl,
  baseHeaders: {
    'x-trigger-auth-key': env.TRIGGER_AUTH_KEY,
  },
})
