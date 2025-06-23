import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { experimental_generateImage as generateImage } from 'ai'
import { env } from '~/env'
import { api } from './internal/api'
import { base64ToFile } from './internal/utils'
import type { Model } from '~/shared/schema'

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL,
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

      for (const image of result.images) {
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

        const updateImageGeneration = await api.updateImageGeneration({
          body: {
            id: payload.id,
            status: 'completed',
            generatedImageUrl: uploadFile.body.url,
          },
        })
        if (updateImageGeneration.status !== 200) {
          throw new Error('Failed to update image generation')
        }
      }
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
