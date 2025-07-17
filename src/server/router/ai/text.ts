import { deepseek } from '@ai-sdk/deepseek'
import { msg } from '@lingui/core/macro'
import { streamToEventIterator, type } from '@orpc/server'
import { convertToModelMessages, streamText } from 'ai'
import { requiredLocaleMiddleware } from '~/server/middlewares/locale'
import { auth } from '~/server/orpc'
import type { UIMessage } from 'ai'

export const aiFortuneTeller = auth
  .input(type<{ chatId: string; messages: UIMessage[] }>())
  .use(requiredLocaleMiddleware)
  .handler(async ({ context, input }) => {
    const { i18n } = context

    const { messages } = input

    const message = messages.at(-1)?.parts.find((i) => i.type === 'text')

    const { gender, birthday } = JSON.parse(message?.text ?? '{}')

    const genderText = gender === 0 ? i18n.t(msg`female`) : i18n.t(msg`male`)
    const content = i18n.t(
      msg`I am ${genderText}, my birthday is ${birthday}. Please use the blind-style technique to analyze the eight characters step by step. Please analyze my life fortune, physical appearance, time nodes, events, and cover all aspects as detailed as possible. Focus on analyzing how much money I can make during my life, including my education and marriage. After determining the accurate relationship model, output the final result, and be honest in your evaluation, using language that is not too gentle.`,
    )

    const result = streamText({
      model: deepseek('deepseek-reasoner'),
      messages: convertToModelMessages([
        {
          role: 'user',
          parts: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ]),
    })

    return streamToEventIterator(
      result.toUIMessageStream({
        sendReasoning: true,
      }),
    )
  })
