import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { experimental_generateImage as generateImage } from 'ai'
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '~/env'
import { api } from './internal/api'
import { base64ToFile } from './internal/utils'
import type { Model } from '~/shared/schema'

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

export const imageGeneratorTask = task({
  id: 'image-generator',
  maxDuration: 10 * 60,
  run: async (payload: {
    id: number
    model: Model
    userId: string
    prompt: string
  }) => {
    try {
      logger.log(`payload: ${JSON.stringify(payload, null, 2)}`)

      const result = await generateImage({
        model: openai.image('gpt-image-1'),
        prompt: payload.prompt,
        n: 1,
      })

      logger.log(`ok images length: ${result.images.length}`)

      await Promise.all(
        result.images.map(async (image) => {
          const base64 = image.base64
          const imageFile = await base64ToFile(base64)
          const uploadFile = await api.uploadFile({
            body: {
              file: imageFile,
            },
          })
          logger.log(`uploadFile: ${JSON.stringify(uploadFile, null, 2)}`)
          if (uploadFile.status !== 200) {
            throw new Error('Failed to upload file')
          }

          await api.updateImageGeneration({
            body: {
              id: payload.id,
              status: 'completed',
              generatedImageUrl: uploadFile.body.url,
            },
          })
        }),
      )
    } catch (error) {
      logger.error(`error: ${JSON.stringify(error, null, 2)}`)

      await api.updateImageGeneration({
        body: {
          id: payload.id,
          status: 'failed',
        },
      })
    }
  },
})
