import { initClient } from '@ts-rest/core'
import { contract } from '~/server/contract'

export const api = initClient(contract, {
  baseUrl: 'https://ai.aiwan.run/api',
  baseHeaders: {},
  throwOnUnknownStatus: true,
})
