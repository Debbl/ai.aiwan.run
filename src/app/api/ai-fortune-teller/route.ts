import { deepseek } from '@ai-sdk/deepseek'
import { msg } from '@lingui/core/macro'
import { streamText } from 'ai'
import { X_NEXT_LOCALE } from '~/constants'
import { getI18nInstance } from '~/i18n'
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

  const headers = req.headers
  const locale = (headers.get(X_NEXT_LOCALE) ?? 'en') as 'en' | 'zh'
  const i18n = await getI18nInstance(locale)

  const { messages } = (await req.json()) as { messages: any[] }

  const message = messages.at(-1)

  const { gender, birthday } = JSON.parse(message.content)

  const genderText = gender === 0 ? i18n.t(msg`female`) : i18n.t(msg`male`)

  const amount = -2
  const userUpdate = await dao.user.updateCredits({
    userId: session.user.id,
    amount,
  })
  if (userUpdate.error) {
    return new Response('Credits not enough', { status: 400 })
  }

  const content = i18n.t(
    msg`I am ${genderText}, my birthday is ${birthday}. Please use the blind-style technique to analyze the eight characters step by step. Please analyze my life fortune, physical appearance, time nodes, events, and cover all aspects as detailed as possible. Focus on analyzing how much money I can make during my life, including my education and marriage. After determining the accurate relationship model, output the final result, and be honest in your evaluation, using language that is not too gentle.`,
  )

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
