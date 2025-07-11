import {
  createNextHandler,
  tsr,
  TsRestResponse,
} from '@ts-rest/serverless/next'
import { env } from '~/env'
import { createAuth } from '~/lib/auth'
import { getDBAsync } from '~/server/db'
import { router } from '~/server/routes'
import { contract } from '~/shared/contract'

const handler = createNextHandler(contract, router, {
  handlerType: 'app-router',
  errorHandler: (error) => {
    return TsRestResponse.fromJson(
      { message: (error as any)?.message || 'Internal Server Error' },
      { status: 500 },
    )
  },
  requestMiddleware: [
    tsr.middleware<{ userId: string }>(async (request) => {
      const db = await getDBAsync()
      const auth = createAuth(db)

      const headers = request.headers

      const session = await auth.api.getSession({
        headers,
      })

      const triggerSecret = headers.get('x-trigger-auth-key')
      const isFromTrigger = triggerSecret === env.TRIGGER_AUTH_KEY

      if (!session && !isFromTrigger) {
        return TsRestResponse.fromJson(
          { message: 'Unauthorized' },
          { status: 401 },
        )
      }
      request.userId = session?.user.id || ''
    }),
  ],
})

export {
  handler as DELETE,
  handler as GET,
  handler as OPTIONS,
  handler as PATCH,
  handler as POST,
  handler as PUT,
}
