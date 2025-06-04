import { deepseek } from '@ai-sdk/deepseek'
import { tasks } from '@trigger.dev/sdk/v3'
import { tsr } from '@ts-rest/serverless/next'
import { streamText } from 'ai'
import { dao } from '~/server/dao'
import { getR2Url } from '~/shared'
import { contract } from '../../shared/contract'
import { services } from '../services'
import type { generationImageTask } from '~/trigger/image-generation'

export const router = tsr.routerWithMiddleware(contract)<{ userId: string }>({
  test: async (_, { request: { userId } }) => {
    const amount = -2
    const userUpdate = await dao.user.updateCredits({
      userId,
      amount,
    })
    if (userUpdate.error) {
      return {
        status: 500,
        body: 'Credits not enough',
      }
    }

    return { status: 200, body: JSON.stringify({ userId }) }
  },
  uploadFile: async (_, { nextRequest }) => {
    const formData = await nextRequest.formData()
    const file = formData.get('file') as File

    const r2Obj = await services.updateFile(file)

    return { status: 200, body: { url: r2Obj?.key || '' } }
  },
  updateImageGeneration: async ({ body }) => {
    const {
      id,
      status,
      prompt,
      originalImageUrl,
      generatedImageUrl,
      generationText,
    } = body

    await dao.imageGenerations.update({
      id,
      status,
      prompt,
      generationText,
      originalImageUrl,
      generatedImageUrl,
    })

    return { status: 200, body: 'ok' }
  },
  getCredits: async ({ query }) => {
    const { userId } = query

    const user = await dao.user.getCreditsByUserId({ userId })

    if (!user) {
      return {
        status: 404,
        body: 'User not found',
      }
    }

    return {
      status: 200,
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    }
  },
  updateUserCredits: async ({ body }) => {
    const { userId, amount } = body

    await dao.user.updateCredits({
      userId,
      amount,
    })

    return { status: 200, body: 'ok' }
  },
  aiFortuneTeller: async (
    { body },
    { request: { userId }, responseHeaders },
  ) => {
    const { messages } = body

    const message = messages.at(-1)

    const { gender, birthday } = JSON.parse(message.content)

    const genderText = gender === 0 ? '女性' : '男性'

    const amount = -2
    const userUpdate = await dao.user.updateCredits({
      userId,
      amount,
    })
    if (userUpdate.error) {
      return {
        status: 500,
        body: 'Credits not enough',
      }
    }

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
    const prompt =
      (formData.get('prompt') as string) ||
      `convert this photo to studio ghibli style anime, ratio is ${ratio}`

    const r2Obj = await services.updateFile(image)

    if (!r2Obj) {
      return {
        status: 500,
        body: 'Failed to upload image',
      }
    }

    const originalImageUrlKey = r2Obj.key
    const amount = 2
    const imageGenerationsInsert = await dao.imageGenerations.insert({
      userId,
      prompt,
      credits: Math.abs(amount),
      originalImageUrl: originalImageUrlKey,
      generatedImageUrl: '',
      status: 'pending',
    })
    if (imageGenerationsInsert.error) {
      return {
        status: 500,
        body: 'Failed to insert image generation',
      }
    }

    const userUpdate = await dao.user.updateCredits({
      userId,
      amount: -amount,
    })
    if (userUpdate.error) {
      return {
        status: 500,
        body: 'Failed to update credits',
      }
    }

    await tasks.trigger<typeof generationImageTask>('generate-image', {
      userId,
      id: imageGenerationsInsert.meta.last_row_id,
      prompt,
      image: getR2Url(originalImageUrlKey),
      amount,
    })

    return {
      status: 200,
      body: {
        recordId: imageGenerationsInsert.meta.last_row_id.toString(),
      },
    }
  },
  getImageList: async ({ query }) => {
    const { userId } = query

    const res = await dao.imageGenerations.getList({
      userId,
    })

    const imageList = res.map((item) => ({
      id: item.id,
      originalImageUrl: getR2Url(item.originalImageUrl),
      generatedImageUrl: getR2Url(item.generatedImageUrl),
      status: item.status,
    }))

    return { status: 200, body: { list: imageList } }
  },
  getImageById: async ({ query }) => {
    const { id } = query

    const res = await dao.imageGenerations.getById({ id: Number(id) })

    return {
      status: 200,
      body: {
        id: res.id,
        originalImageUrl: getR2Url(res.originalImageUrl),
        generatedImageUrl: getR2Url(res.generatedImageUrl),
        status: res.status,
      },
    }
  },
})
