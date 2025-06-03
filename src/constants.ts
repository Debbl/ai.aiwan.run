import { NODE_ENV } from './env'

export const BASE_URL =
  NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ai.aiwan.run'
