import { initClient } from '@ts-rest/core'
import { TRIGGER_AUTH_KEY } from '~/env'
import { contract } from '~/shared/contract'

export const baseUrl = 'https://ai.aiwan.run'

export const api = initClient(contract, {
  baseUrl,
  baseHeaders: {
    'x-trigger-auth-key': TRIGGER_AUTH_KEY,
  },
})
