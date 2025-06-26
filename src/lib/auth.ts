import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { cache } from 'react'
import { BASE_URL } from '~/constants'
import { env } from '~/env'
import type { DB } from '~/server/db'

export const createAuth = cache((db: DB) =>
  betterAuth({
    onAPIError: {
      errorURL: '/',
    },
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    trustedOrigins: ['http://localhost:8787', BASE_URL],
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
  }),
)

export type Auth = ReturnType<typeof createAuth>
