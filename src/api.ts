import { initClient } from '@ts-rest/core'
import { contract } from './shared/contract'
import type { ValueOf } from 'type-fest'

export const api = initClient(contract, {
  baseUrl: '.',
  baseHeaders: {},
})

export function getApiUrl(route: ValueOf<typeof contract>) {
  return `${route.path}`
}
