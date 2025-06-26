// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-named-default
import { default as handler } from '../../.open-next/worker.js'
import { initCloudflareContext } from './get-cloudflare-context.js'
import { runQueue } from './queues'
import type { QueueMessages } from './queues'

export {
  BucketCachePurge,
  DOQueueHandler,
  DOShardedTagCache,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '../../.open-next/worker.js'

export default {
  fetch: handler.fetch,

  async queue(batch, env, ctx) {
    initCloudflareContext({
      env,
      cf: undefined,
      ctx,
    })

    for (const message of batch.messages) {
      await runQueue(message)
    }
  },
} satisfies ExportedHandler<CloudflareEnv, QueueMessages>
