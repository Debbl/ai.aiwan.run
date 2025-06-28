import {
  getRouteQuery,
  initClient,
  isAppRoute,
  isAppRouteQuery,
} from '@ts-rest/core'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type {
  AppRoute,
  AppRouteDeleteNoBody,
  AppRouteMutation,
  AppRouteQuery,
  AppRouter,
  AreAllPropertiesOptional,
  ClientArgs,
  ClientInferRequest,
  ClientInferResponseBody,
  ClientInferResponses,
  InitClientArgs,
  PartialClientInferRequest,
  Prettify,
} from '@ts-rest/core'
import type { SWRConfiguration, SWRResponse } from 'swr'
import type {
  SWRMutationConfiguration,
  SWRMutationResponse,
} from 'swr/mutation'

function getSWRRouteQuery(route: AppRouteQuery, clientArgs: InitClientArgs) {
  const queryFn = getRouteQuery(route, clientArgs)

  return {
    useSWR: (
      args: ClientInferRequest<AppRouteMutation, ClientArgs>,
      options: {
        enabled?: boolean
      } & Omit<SWRConfiguration, 'isPaused'> = {},
    ) => {
      const { enabled = true, ...SWROptions } = options
      const enabledRef = useRef(enabled)
      enabledRef.current = enabled

      const values = useSWR(
        [route.path, args],
        async () => {
          const res = await queryFn(args)
          if (res.status !== 200) {
            throw new Error((res.body as any)?.message || 'unknown error')
          }

          return res.body
        },
        {
          ...SWROptions,
          isPaused() {
            return !enabledRef.current
          },
        },
      )

      return values
    },
  }
}

function getSWRRouteMutation(
  route: AppRouteMutation | AppRouteDeleteNoBody,
  clientArgs: InitClientArgs,
) {
  const mutationFn = getRouteQuery(route, clientArgs)

  return {
    useSWRMutation: (options: SWRMutationConfiguration<any, any, any> = {}) => {
      const values = useSWRMutation(
        [route.path],
        async (_url: string, { arg }: { arg: any }) => {
          const res = await mutationFn(arg)

          if (res.status !== 200) {
            throw new Error('error')
          }

          return res.body
        },
        options,
      )

      return values
    },
  }
}

type AppSWRRouteFunction<
  TRoute extends AppRoute,
  TClientArgs extends ClientArgs,
  TArgs = PartialClientInferRequest<TRoute, TClientArgs>,
> =
  AreAllPropertiesOptional<TArgs> extends true
    ? (
        args?: Prettify<TArgs>,
      ) => Promise<Prettify<ClientInferResponses<TRoute>>>
    : TRoute extends AppRouteQuery
      ? {
          useSWR: <Data = Prettify<ClientInferResponseBody<TRoute, 200>>>(
            args?: Prettify<TArgs>,
            options?: {
              enabled?: boolean
            } & SWRConfiguration<Data>,
          ) => SWRResponse<Data>
        }
      : TRoute extends AppRouteMutation | AppRouteDeleteNoBody
        ? {
            useSWRMutation: <
              Data = Prettify<ClientInferResponseBody<TRoute, 200>>,
              ExtraArg = Prettify<TArgs>,
            >(
              options?: SWRMutationConfiguration<Data, any, any, ExtraArg>,
            ) => SWRMutationResponse<Data, any, any, ExtraArg>
          }
        : (
            args: Prettify<TArgs>,
          ) => Promise<Prettify<ClientInferResponses<TRoute>>>

type RecursiveProxyObj<T extends AppRouter, TClientArgs extends ClientArgs> = {
  [TKey in keyof T]: T[TKey] extends AppRoute
    ? AppSWRRouteFunction<T[TKey], TClientArgs>
    : T[TKey] extends AppRouter
      ? RecursiveProxyObj<T[TKey], TClientArgs>
      : never
}

export type InitClientReturn<
  T extends AppRouter,
  TClientArgs extends ClientArgs,
> = RecursiveProxyObj<T, TClientArgs>

export function createApi<
  T extends AppRouter,
  TClientArgs extends InitClientArgs,
>(router: T, args: TClientArgs): InitClientReturn<T, TClientArgs> {
  const api = Object.fromEntries(
    Object.entries(router).map(([key, subRouter]) => {
      if (isAppRoute(subRouter)) {
        if (isAppRouteQuery(subRouter)) {
          return [key, getSWRRouteQuery(subRouter, args)]
        }

        return [key, getSWRRouteMutation(subRouter, args)]
      } else {
        return [key, initClient(subRouter, args)]
      }
    }),
  )

  return api
}

export const api = createApi(contract, {
  baseUrl: '.',
  baseHeaders: {},
  throwOnUnknownStatus: true,
})
