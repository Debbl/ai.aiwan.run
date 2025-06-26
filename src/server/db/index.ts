import { drizzle } from 'drizzle-orm/d1'
import { cache } from 'react'
import {
  getCloudflareContext,
  getCloudflareContextAsync,
} from '../get-cloudflare-context'
import { schema } from './schema'

export const getDB = cache(() => {
  const { env } = getCloudflareContext()
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema })
})

// This is the one to use for static routes (i.e. ISR/SSG)
export const getDBAsync = cache(async () => {
  const { env } = await getCloudflareContextAsync()
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema })
})

export { schema }

export type DB = ReturnType<typeof getDB>
