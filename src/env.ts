/* eslint-disable n/prefer-global/process */
import z from 'zod'

// eslint-disable-next-line unused-imports/no-unused-vars
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  VERCEL_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_BASE_URL: z.string().min(1),
  ANALYZE: z.boolean().default(false),

  R2_BASE_URL: z.string().min(1),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_D1_TOKEN: z.string().min(1),
  CLOUDFLARE_DATABASE_ID: z.string().min(1),

  TRIGGER_AUTH_KEY: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
})

export const env = process.env
