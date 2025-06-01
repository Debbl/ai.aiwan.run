import { createNextHandler, tsr, TsRestResponse } from '@ts-rest/serverless/next'
import { createAuth } from '~/lib/auth'
import { contract } from '~/server/contract'
import { getDB } from '~/server/db'
import { router } from '~/server/routes'

const handler = createNextHandler(contract, router, {
  basePath: '/api',
  handlerType: 'app-router',
  requestMiddleware: [
    tsr.middleware<{ userId: string }>(async (request) => {
      const auth = createAuth(getDB())
      const headers = request.headers
      const session = await auth.api.getSession({
        headers,
      })

      if (!session) {
        return TsRestResponse.fromJson({ message: 'Unauthorized' }, { status: 401 })
      }
      request.userId = session.user.id
    }),
  ],
})

export { handler as DELETE, handler as GET, handler as OPTIONS, handler as PATCH, handler as POST, handler as PUT }
