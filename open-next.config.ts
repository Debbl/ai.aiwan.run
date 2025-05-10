import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache'
import type { OpenNextConfig } from '@opennextjs/aws/types/open-next'

const config: OpenNextConfig = {
  ...defineCloudflareConfig({
    incrementalCache: kvIncrementalCache,
  }),
  appPath: 'apps/web',
  buildOutputPath: 'apps/web',
  packageJsonPath: 'apps/web',
  buildCommand: 'turbo build',
}

export default config
