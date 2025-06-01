import { toNextJsHandler } from 'better-auth/next-js'
import { createAuth } from '~/lib/auth'
import { getDB } from '~/server/db'

export function GET(request: Request) {
  const auth = createAuth(getDB())

  return toNextJsHandler(auth.handler).GET(request)
}

export function POST(request: Request) {
  const auth = createAuth(getDB())

  return toNextJsHandler(auth.handler).POST(request)
}
