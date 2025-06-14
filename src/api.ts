import { createApi } from './lib/create-api'
import { contract } from './shared/contract'
import type { ValueOf } from 'type-fest'

export const api = createApi(contract, {
  baseUrl: '.',
  baseHeaders: {},
  throwOnUnknownStatus: true,
})

export function getApiUrl(route: ValueOf<typeof contract>) {
  return `${route.path}`
}
