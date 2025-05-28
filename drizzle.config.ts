/* eslint-disable no-console */
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

const getLocalD1 = () => {
  try {
    const basePath = path.resolve(
      '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/8288b704ef1aa1ad30abc1b56baccf178a3b0940566cc07f373946ab2a4c0e30.sqlite',
    )
    console.log('🚀 ~ getLocalD1 ~ basePath:', basePath)

    return basePath
  } catch (err) {
    console.log(`Error  ${err}`)
  }
}

export default defineConfig({
  out: './drizzle',
  schema: './src/server/db/schema/internal.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1() || '',
  },
})
