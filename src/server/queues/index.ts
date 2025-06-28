import { match } from 'ts-pattern'
import { logger } from '~/shared/logger'
import { getCloudflareContextAsync } from '../get-cloudflare-context'
import { runAiGhibliGeneratorQueue } from './ai-ghibli-generator'
import { runAiImageGeneratorQueue } from './ai-image-genratetor'

export type QueueMessages =
  | {
      type: 'ai-ghibli-generator'
      data: Parameters<typeof runAiGhibliGeneratorQueue>[0]
    }
  | {
      type: 'ai-image-generator'
      data: Parameters<typeof runAiImageGeneratorQueue>[0]
    }

export async function runQueue(message: Message<QueueMessages>) {
  logger.log(`message: ${JSON.stringify(message, null, 2)}`)

  await match(message.body)
    .with({ type: 'ai-ghibli-generator' }, async (m) => {
      await runAiGhibliGeneratorQueue(m.data)
    })
    .with({ type: 'ai-image-generator' }, async (m) => {
      await runAiImageGeneratorQueue(m.data)
    })
    .exhaustive()
}

export async function sendQueue(
  message: QueueMessages,
  options?: QueueSendOptions,
) {
  const { env } = await getCloudflareContextAsync()
  await env.NEXT_QUEUES?.send(message, options)
}
