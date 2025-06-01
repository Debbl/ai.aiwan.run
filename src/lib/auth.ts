import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { DB } from 'better-auth/adapters/drizzle'

export const createAuth = (db: DB) =>
  betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: ['http://localhost:8787'],
    advanced: {
      ipAddress: {
        ipAddressHeaders: ['x-real-ip', 'cf-connecting-ip'],
        disableIpTracking: false,
      },
    },
  })

export type Auth = ReturnType<typeof createAuth>
