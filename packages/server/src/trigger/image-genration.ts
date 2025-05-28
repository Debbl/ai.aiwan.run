import { createOpenAI } from '@ai-sdk/openai'
import { logger, task } from '@trigger.dev/sdk/v3'
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '@workspace/env'
import { streamText } from 'ai'
import { blobToBase64 } from '..'
import { api } from '../api'

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

export const generationImageTask = task({
  id: 'generate-image',
  maxDuration: 10 * 60,
  run: async (payload: { id: number; prompt: string; originalImageUrl: string }) => {
    await api.updateImageGeneration({
      body: {
        id: payload.id,
      },
    })

    const blob = await fetch(payload.originalImageUrl).then((res) => res.blob())
    const imageBase64 = await blobToBase64(blob)

    const result = streamText({
      model: openai('gpt-4o-image-vip'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: imageBase64,
            },
            {
              type: 'text',
              text: payload.prompt,
            },
          ],
        },
      ],
    })

    for await (const chunk of result.textStream) {
      logger.log(chunk)
    }
  },
})
