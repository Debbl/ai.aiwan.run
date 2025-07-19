import { os } from '@orpc/server'
import { cookies, headers } from 'next/headers'
import { requiredAuthMiddleware } from './middlewares/auth'

export const base = os.use(async ({ next }) =>
  next({
    context: {
      headers: await headers(),
      cookies: await cookies(),
    },
  }),
)

export const auth = base.use(requiredAuthMiddleware)
