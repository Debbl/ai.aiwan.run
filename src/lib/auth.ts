import { anonymous } from 'better-auth/plugins'
import { BASE_URL } from '~/constants'
import { env } from '~/env'
import type { betterAuth } from 'better-auth'

export const betterAuthConfig: Parameters<typeof betterAuth>[0] = {
  plugins: [anonymous()],
  onAPIError: {
    errorURL: '/',
  },
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
        required: true,
        defaultValue: 100,
      },
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-real-ip', 'cf-connecting-ip'],
      disableIpTracking: false,
    },
  },
}

/**
 * npx @better-auth/cli generate
 */
// export const auth = betterAuth({
//   ...betterAuthConfig,
//   database: drizzleAdapter(new Database(':memory:'), {
//     provider: 'sqlite',
//   }),
// })
