import { ORPCError, os } from '@orpc/server'
import { createAuth } from '~/lib/auth'
import { getDBAsync } from '../db'

export const requiredAuthMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ context, next }) => {
    const db = await getDBAsync()
    const auth = createAuth(db)

    const headers = context.headers

    const session = await auth.api.getSession({
      headers,
    })

    if (!session) {
      throw new ORPCError('UNAUTHORIZED', {
        message: 'Unauthorized',
      })
    }

    return next({
      context: {
        userId: session.user.id,
      },
    })
  })
