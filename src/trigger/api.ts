import { initClient } from '@ts-rest/core'
import { contract } from '~/server/contract'

export const baseUrl = 'https://ai.aiwan.run'

export const api = initClient(contract, {
  baseUrl: `${baseUrl}/api`,
  baseHeaders: {},
  throwOnUnknownStatus: true,
})
