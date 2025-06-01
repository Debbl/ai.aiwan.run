import { deepseek } from '@ai-sdk/deepseek'
import { tasks } from '@trigger.dev/sdk/v3'
import { tsr } from '@ts-rest/serverless/next'
import { streamText } from 'ai'
import { TRIGGER_SECRET_KEY } from '~/env'
import { dao } from '~/server/dao'
import { contract } from '../contract'
import { services } from '../services'
import type { generationImageTask } from '~/trigger/image-generation'

export const router = tsr.routerWithMiddleware(contract)<{ userId: string }>({
  test: async (...args) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ test: ~ args:', args)
    const request = args[0]
    return { status: 200, body: JSON.stringify(request) }
  },
  uploadFile: async (_, { nextRequest }) => {
    const formData = await nextRequest.formData()
    const file = formData.get('file') as File

    const r2Obj = await services.updateFile(file)

    return { status: 200, body: { url: r2Obj?.key || '' } }
  },
  updateImageGeneration: async ({ body }) => {
    const { id, status, prompt, originalImageUrl, generatedImageUrl, generationText } = body

    if (body.secretKey !== TRIGGER_SECRET_KEY) {
      return {
        status: 400,
        body: 'Invalid secret key',
      }
    }

    try {
      await dao.imageGenerations.update({
        id,
        status,
        prompt,
        generationText,
        originalImageUrl,
        generatedImageUrl,
      })
    } catch {
      return { status: 500, body: 'Failed to update image generation' }
    }

    return { status: 200, body: 'ok' }
  },
  aiFortuneTeller: async ({ body }, { responseHeaders }) => {
    const { messages } = body

    const message = messages.at(-1)

    const { gender, birthday } = JSON.parse(message.content)

    const genderText = gender === 0 ? '女性' : '男性'

    const content = `我是${genderText}，我的公历出生日期是${birthday}。请用盲派技巧逐步分析八字，请分析我的一生运势，以及体貌特征，时间节点，事件，涵盖各方面，尽可能详细具体。着重分析大运能赚多少钱，包括学业和婚姻，判断出准确的关系模型后输出最终结果，诚实一点评价，用语不用太温和。`
    const result = streamText({
      model: deepseek('deepseek-reasoner'),
      messages: [
        {
          role: 'user',
          content,
          parts: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ],
    })

    const response = result.toDataStreamResponse({
      sendReasoning: true,
    })

    for (const [key, value] of response.headers) {
      responseHeaders.set(key, value)
    }

    return response as any
  },
  aiGhibliGenerator: async (_, { request: { userId }, nextRequest }) => {
    const formData = await nextRequest.formData()

    const image = formData.get('image') as File
    const ratio = formData.get('ratio') as string

    const r2Obj = await services.updateFile(image)

    if (!r2Obj) {
      return {
        status: 500,
        body: 'Failed to upload image',
      }
    }

    const prompt = `convert this photo to studio ghibli style anime, ratio is ${ratio}`

    const res = await dao.imageGenerations.insert({
      userId,
      prompt,
      originalImageUrl: r2Obj.key,
      generatedImageUrl: '',
      status: 'pending',
    })

    if (!res.success) {
      return {
        status: 500,
        body: 'Failed to insert image generation',
      }
    }

    const handle = await tasks.trigger<typeof generationImageTask>('generate-image', {
      id: res.meta.last_row_id,
      prompt,
      image,
    })

    return {
      status: 200,
      body: handle,
    }
  },
})
