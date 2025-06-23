import { toNextJsHandler } from 'better-auth/next-js'
import { cache } from 'react'
import { createAuth } from '~/lib/auth'
import { getDBAsync } from '~/server/db'

const getHandler = cache(async () => {
  const db = await getDBAsync()
  const auth = createAuth(db)

  return toNextJsHandler(auth.handler)
})

export async function GET(request: Request) {
  const handler = await getHandler()
  return handler.GET(request)
}

export async function POST(request: Request) {
  const handler = await getHandler()
  return handler.POST(request)
}
