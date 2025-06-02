import { initClient } from '@ts-rest/core'
import { TRIGGER_SECRET_KEY } from '~/env'
import { contract } from '~/shared/contract'

export const baseUrl = 'https://ai.aiwan.run'

export const api = initClient(contract, {
  baseUrl: `${baseUrl}/api`,
  baseHeaders: {
    'x-trigger-secret': TRIGGER_SECRET_KEY,
  },
  throwOnUnknownStatus: true,
})
