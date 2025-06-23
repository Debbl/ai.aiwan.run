import { toNextJsHandler } from 'better-auth/next-js'
import { cache } from 'react'
import { createAuth } from '~/lib/auth'
import { getDB } from '~/server/db'

const getHandler = cache(() => {
  const db = getDB()
  const auth = createAuth(db)

  return toNextJsHandler(auth.handler)
})

export const { GET, POST } = getHandler()
