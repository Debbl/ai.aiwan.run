/* eslint-disable vars-on-top */
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin } from '@orpc/client/plugins'
import {
  createTanstackQueryUtils,
  TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL,
} from '@orpc/tanstack-query'
import { X_NEXT_LOCALE } from '~/shared/constants'
import { isBrowser } from '~/shared/is-browser'
import type { RouterClient } from '@orpc/server'
import type { Router } from '~/server/router'

/**
 * This is part of the Optimize SSR setup.
 *
 * @see {@link https://orpc.unnoq.com/docs/adapters/next#optimize-ssr}
 */
declare global {
  var $client: RouterClient<Router> | undefined
}

const GET_OPERATION_TYPE = new Set(['query', 'streamed', 'live', 'infinite'])

const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/rpc`,
  plugins: [
    new BatchLinkPlugin({
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
  method: ({ context }) => {
    const operationType = context[TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL]?.type

    if (operationType && GET_OPERATION_TYPE.has(operationType)) {
      return 'GET'
    }

    return 'POST'
  },
  headers: {
    [X_NEXT_LOCALE]: isBrowser
      ? (window.document.documentElement.lang ?? 'en')
      : 'en',
  },
})

export const client: RouterClient<Router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
