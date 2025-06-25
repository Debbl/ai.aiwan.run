/* eslint-disable n/prefer-global/process */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  VERCEL_URL: process.env.VERCEL_URL || '',
  ANALYZE: process.env.ANALYZE === 'true',

  // basic
  R2_BASE_URL: process.env.R2_BASE_URL || '',

  // openai
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || '',

  // deepseek
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',

  // cloudflare
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN || '',
  CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID || '',

  // trigger
  TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY || '',
  TRIGGER_AUTH_KEY: process.env.TRIGGER_AUTH_KEY || '',

  // better-auth
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',

  // google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // github
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
}
