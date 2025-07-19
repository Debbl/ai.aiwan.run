import { getCloudflareContext as getCloudflareContextFn } from '@opennextjs/cloudflare'
import type { CloudflareContext } from '@opennextjs/cloudflare'

let cloudflareContext: CloudflareContext | null = null

export function initCloudflareContext(ctx: CloudflareContext) {
  cloudflareContext = ctx
}

export function getCloudflareContext() {
  if (cloudflareContext) {
    return cloudflareContext
  }

  cloudflareContext = getCloudflareContextFn()
  return cloudflareContext
}

export async function getCloudflareContextAsync() {
  if (cloudflareContext) {
    return cloudflareContext
  }

  cloudflareContext = await getCloudflareContextFn({ async: true })
  return cloudflareContext
}
