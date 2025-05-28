/* eslint-disable n/prefer-global/process */

export const NODE_ENV = process.env.NODE_ENV
export const PORT = process.env.PORT
export const VERCEL_URL = process.env.VERCEL_URL
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL

export const R2_BASE_URL = process.env.R2_BASE_URL || ''

export const ANALYZE = process.env.ANALYZE

export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ''
export const CLOUDFLARE_D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN || ''
export const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || ''
