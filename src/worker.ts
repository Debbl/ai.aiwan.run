import handler from '../.open-next/worker.js'
import { dao } from './server/dao/index.js'

export default {
  fetch: handler.fetch,

  async queue(batch, _env, _ctx) {
    for (const message of batch.messages) {
      await dao.user.updateCredits({
        userId: message.body,
        amount: 50,
      })
    }
  },
} satisfies ExportedHandler<CloudflareEnv, string>

export {
  BucketCachePurge,
  DOQueueHandler,
  DOShardedTagCache,
} from '../.open-next/worker.js'
