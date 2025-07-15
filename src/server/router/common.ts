import { msg } from '@lingui/core/macro'
import z from 'zod'
import { requiredLocaleMiddleware } from '../middlewares/locale'
import { auth } from '../orpc'
import { services } from '../services'

export const test = auth
  .use(requiredLocaleMiddleware)
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { userId, i18n } = context

    const text = i18n.t(msg`Hello ${input.name}`)

    return { userId, input, text }
  })

export const uploadFile = auth
  .input(z.object({ file: z.instanceof(File) }))
  .handler(async ({ input }) => {
    const r2Obj = await services.updateFile(input.file)

    return { url: r2Obj?.key || '' }
  })
