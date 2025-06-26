import { match } from 'ts-pattern'
import { getCloudflareContextAsync } from '../get-cloudflare-context'
import { runImageGeneratorQueue } from './image-generator'

export interface QueueMessages {
  type: 'image-generator'
  data: Parameters<typeof runImageGeneratorQueue>[0]
}

export async function runQueue(message: Message<QueueMessages>) {
  await match(message.body)
    .with({ type: 'image-generator' }, async (m) => {
      await runImageGeneratorQueue(m.data)
    })
    .exhaustive()
}

export async function sendQueue(message: QueueMessages) {
  const { env } = await getCloudflareContextAsync()
  await env.NEXT_QUEUES?.send(message)
}
