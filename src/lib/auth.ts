import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { DB } from '~/server/db'

export const createAuth = (db: DB) =>
  betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: ['http://localhost:8787'],
    user: {
      additionalFields: {
        credits: {
          type: 'number',
          required: false,
        },
      },
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ['x-real-ip', 'cf-connecting-ip'],
        disableIpTracking: false,
      },
    },
  })

export type Auth = ReturnType<typeof createAuth>
