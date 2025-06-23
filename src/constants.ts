import { env } from './env'

export const BASE_URL =
  env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://ai.aiwan.run'
