import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { generateText } from 'ai'
import { OPENAI_API_KEY, OPENAI_BASE_URL, TRIGGER_SECRET_KEY } from '~/env'
import { api } from './api'
import { blobToBase64 } from './utils'

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

export const generationImageTask = task({
  id: 'generate-image',
  maxDuration: 10 * 60,
  run: async (payload: { id: number; prompt: string; image: File }) => {
    try {
      logger.log(JSON.stringify(payload, null, 2))

      const updateStatus = await api.updateImageGeneration({
        body: {
          secretKey: TRIGGER_SECRET_KEY,
          id: payload.id,
          status: 'processing',
        },
      })

      logger.log(JSON.stringify(updateStatus, null, 2))
      if (updateStatus.status !== 200) {
        throw new Error('Failed to update image generation status')
      }

      const base64Image = await blobToBase64(payload.image)

      const result = await generateText({
        model: openai('gpt-4o-image-vip'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: base64Image,
              },
              {
                type: 'text',
                text: payload.prompt,
              },
            ],
          },
        ],
      })

      logger.log(result.text)

      const updateGenerationText = await api.updateImageGeneration({
        body: {
          id: payload.id,
          secretKey: TRIGGER_SECRET_KEY,
          status: 'completed',
          generationText: result.text,
        },
      })

      logger.log(JSON.stringify(updateGenerationText, null, 2))
      if (updateGenerationText.status !== 200) {
        throw new Error('Failed to update image generation text')
      }
    } catch (error) {
      logger.error(JSON.stringify(error, null, 2))

      await api.updateImageGeneration({
        body: {
          id: payload.id,
          secretKey: TRIGGER_SECRET_KEY,
          status: 'failed',
        },
      })
    }
  },
})
