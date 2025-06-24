import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'

const isDev = env.NODE_ENV === 'development'

export default defineConfig(
  isDev
    ? {
        out: './drizzle',
        schema: './src/server/db/schema/internal/index.ts',
        dialect: 'sqlite',
        dbCredentials: {
          url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/8288b704ef1aa1ad30abc1b56baccf178a3b0940566cc07f373946ab2a4c0e30.sqlite',
        },
      }
    : {
        out: './drizzle',
        schema: './src/server/db/schema/internal/index.ts',
        dialect: 'sqlite',
        driver: 'd1-http',
        dbCredentials: {
          accountId: env.CLOUDFLARE_ACCOUNT_ID! as string,
          databaseId: env.CLOUDFLARE_DATABASE_ID! as string,
          token: env.CLOUDFLARE_D1_TOKEN! as string,
        },
      },
)
