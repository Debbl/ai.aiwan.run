import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { Auth } from './auth'

export const authClient = createAuthClient({
  baseURL: 'https://ai.aiwan.run',
  plugins: [
    inferAdditionalFields<Auth>({
      user: {
        credits: {
          type: 'number',
          required: false,
        },
      },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
