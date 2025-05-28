import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { generateText } from 'ai'
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '~/env'
import { api } from './api'

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

export const generationImageTask = task({
  id: 'generate-image',
  maxDuration: 10 * 60,
  run: async (payload: { id: number; prompt: string; originalImageUrl: string }) => {
    logger.log(JSON.stringify(payload, null, 2))

    const updateStatus = await api.updateImageGeneration({
      body: {
        id: payload.id,
        status: 'processing',
      },
    })

    logger.log(JSON.stringify(updateStatus, null, 2))

    const result = await generateText({
      model: openai('gpt-4o-image-vip'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: 'https://r2.aiwan.run/46ed85f8-cc51-4c78-a0b3-5b5b0cb5ba12.png',
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
        status: 'completed',
        generationText: result.text,
      },
    })

    logger.log(JSON.stringify(updateGenerationText, null, 2))
  },
})
