import { initClient, tsRestFetchApi } from '@ts-rest/core'
import { toast } from 'sonner'
import { contract } from './shared/contract'
import type { ApiFetcherArgs } from '@ts-rest/core'
import type { ValueOf } from 'type-fest'

export const api = initClient(contract, {
  baseUrl: '.',
  baseHeaders: {},
  throwOnUnknownStatus: true,
  api: async (args: ApiFetcherArgs) => {
    const result = await tsRestFetchApi(args)

    if (result.status !== 200) {
      toast.warning((result?.body as string) || 'Unknown error')
    }

    return result
  },
})

export function getApiUrl(route: ValueOf<typeof contract>) {
  return `${route.path}`
}
