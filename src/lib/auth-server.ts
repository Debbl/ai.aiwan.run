import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { cache } from 'react'
import { betterAuthConfig } from './auth'
import type { DB } from '~/server/db'

export const createAuth = cache((db: DB) =>
  betterAuth({
    ...betterAuthConfig,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
  }),
)

export type Auth = Parameters<typeof createAuth>[0]
