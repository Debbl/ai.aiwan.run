import { initClient } from '@ts-rest/core'
import { contract } from './contract'

export const baseUrl = '/api'

export const api = initClient(contract, {
  baseUrl,
  baseHeaders: {},
  throwOnUnknownStatus: true,
})
