import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { generateText } from 'ai'
import { match } from 'ts-pattern'
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '~/env'
import { api } from './api'
import { srcToBase64String } from './utils'
import type { Model } from '~/shared/schema'

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

function parseText(str: string) {
  if (str.includes('Generation failed')) {
    return {
      success: false,
      url: '',
    }
  }

  const url = str.match(/!\[.*?\]\((.*?)\)/)?.[1]

  return {
    success: !!url,
    url,
  }
}

export const generationImageTask = task({
  id: 'generate-image',
  maxDuration: 10 * 60,
  run: async (
    payload:
      | {
          type: 'text2image'
          model: Model
          userId: string
          id: number
          prompt: string
          amount: number
        }
      | {
          type: 'image2image'
          model: Model
          userId: string
          id: number
          prompt: string
          image: string
          amount: number
        },
  ) => {
    // TODO: add image2image
    if (payload.type === 'text2image') return

    try {
      logger.log(JSON.stringify(payload, null, 2))

      const updateStatus = await api.updateImageGeneration({
        body: {
          id: payload.id,
          status: 'processing',
        },
      })

      logger.log(`updateStatus: ${JSON.stringify(updateStatus, null, 2)}`)
      if (updateStatus.status !== 200) {
        throw new Error('Failed to update image generation status')
      }

      const base64Image = await srcToBase64String(payload.image)

      const runModel = match(payload.model)
        .with('gpt-4o-image-vip', () => openai('gpt-4o-image-vip'))
        .with('gpt-image-1', () => openai('gpt-image-1'))
        .with('gpt-image-1-vip', () => openai('gpt-image-1-vip'))
        .exhaustive()

      const result = await generateText({
        model: runModel,
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
      const generationText = result.text

      logger.log(`generationText: ${generationText}`)

      const { success, url } = match(payload.model)
        .with('gpt-image-1-vip', () => parseText(generationText))
        .with('gpt-4o-image-vip', () => parseText(generationText))
        .with('gpt-image-1', () => parseText(generationText))
        .exhaustive()

      const updateGenerationText = await api.updateImageGeneration({
        body: {
          id: payload.id,
          status: success ? 'completed' : 'failed',
          generationText,
          generatedImageUrl: url,
        },
      })
      if (!success) {
        await api.updateUserCredits({
          body: {
            userId: payload.userId,
            amount: payload.amount,
          },
        })
      }

      logger.log(
        `updateGenerationText: ${JSON.stringify(updateGenerationText, null, 2)}`,
      )
      if (updateGenerationText.status !== 200) {
        throw new Error('Failed to update image generation text')
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
