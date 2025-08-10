import {
  anonymousClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { Auth } from './auth-server'

export const authClient = createAuthClient({
  plugins: [
    anonymousClient(),
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
