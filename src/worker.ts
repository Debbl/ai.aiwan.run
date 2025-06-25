// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-named-default
import { default as handler } from '../.open-next/worker.js'

export default {
  fetch: handler.fetch,

  async queue(batch, _env, _ctx) {
    for (const message of batch.messages) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ queue ~ message:', message)
    }
  },
} satisfies ExportedHandler<CloudflareEnv, string>

export {
  DOQueueHandler,
  DOShardedTagCache,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '../.open-next/worker.js'
