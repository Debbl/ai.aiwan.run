import { deepseek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'
import { createAuth } from '~/lib/auth'
import { dao } from '~/server/dao'
import { getDBAsync } from '~/server/db'

export async function POST(req: Request) {
  const db = await getDBAsync()
  const auth = createAuth(db)

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = (await req.json()) as { messages: any[] }

  const message = messages.at(-1)

  const { gender, birthday } = JSON.parse(message.content)

  const genderText = gender === 0 ? '女性' : '男性'

  const amount = -2
  const userUpdate = await dao.user.updateCredits({
    userId: session.user.id,
    amount,
  })
  if (userUpdate.error) {
    return new Response('Credits not enough', { status: 400 })
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

  return response
}
