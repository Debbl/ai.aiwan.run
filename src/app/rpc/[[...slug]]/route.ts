import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { BatchHandlerPlugin, StrictGetMethodPlugin } from '@orpc/server/plugins'
import { router } from '~/server/router'

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
  plugins: [new BatchHandlerPlugin(), new StrictGetMethodPlugin()],
})

async function handleRequest(request: Request) {
  const { response } = await rpcHandler.handle(request, {
    prefix: '/rpc',
    context: {},
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
