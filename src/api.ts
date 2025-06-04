import { initClient } from '@ts-rest/core'
import { contract } from './shared/contract'
import type { ValueOf } from 'type-fest'

export const api = initClient(contract, {
  baseUrl: 'http://localhost:3000',
  baseHeaders: {},
  throwOnUnknownStatus: true,
})

export function getApiUrl(route: ValueOf<typeof contract>) {
  return `${route.path}`
}
