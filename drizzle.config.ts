import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'

const isDev = env.NODE_ENV === 'development'

function getLocalD1DB() {
  try {
    const basePath = path.resolve('.wrangler')
    const dbFile = fs
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .find((f) => f.endsWith('.sqlite'))

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`)
    }

    const url = path.resolve(basePath, dbFile)
    return url
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error  ${err}`)
  }
}

export default defineConfig(
  isDev
    ? {
        out: './drizzle',
        schema: './src/server/db/schema/internal/index.ts',
        dialect: 'sqlite',
        dbCredentials: {
          url: getLocalD1DB()!,
        },
      }
    : {
        out: './drizzle',
        schema: './src/server/db/schema/internal/index.ts',
        dialect: 'sqlite',
        driver: 'd1-http',
        dbCredentials: {
          accountId: env.CLOUDFLARE_ACCOUNT_ID,
          databaseId: env.CLOUDFLARE_DATABASE_ID,
          token: env.CLOUDFLARE_D1_TOKEN,
        },
      },
)
