import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import { cache } from 'react'
import { schema } from './schema'

export const getDB = cache(() => {
  const { env } = getCloudflareContext()
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema })
})

// This is the one to use for static routes (i.e. ISR/SSG)
export const getDBAsync = cache(async () => {
  const { env } = await getCloudflareContext({ async: true })
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema })
})
