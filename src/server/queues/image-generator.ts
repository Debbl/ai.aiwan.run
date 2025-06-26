/* eslint-disable no-console */
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { env } from '~/env'
import { dao } from '../dao'
import { srcToBase64String } from '../utils'

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

export async function runImageGeneratorQueue(data: {
  id: number
  userId: string
  imageUrl: string
  prompt: string
  amount: number
}) {
  const { id, userId, imageUrl, prompt, amount } = data

  console.info(
    `${new Date().toISOString()} 🚀 ~ runImageGeneratorQueue ~ data:`,
    data,
  )

  try {
    const openai = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL,
    })

    await dao.imageGenerations.update({
      id,
      status: 'processing',
    })

    const base64Image = await srcToBase64String(imageUrl)

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
              text: prompt,
            },
          ],
        },
      ],
    })

    const generationText = result.text
    console.info(
      `${new Date().toISOString()} 🚀 ~ generationText:`,
      generationText,
    )

    const { success, url } = parseText(generationText)

    await dao.imageGenerations.update({
      id,
      status: success ? 'completed' : 'failed',
      generationText,
      generatedImageUrl: url,
    })
  } catch (error) {
    console.error(
      `${new Date().toISOString()} 🚀 ~ error: ${JSON.stringify(error, null, 2)}`,
    )

    await dao.imageGenerations.update({
      id,
      status: 'failed',
    })
    await dao.user.updateCredits({
      userId,
      amount,
    })
  }
}
