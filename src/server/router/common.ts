import z from 'zod'
import { auth } from '../orpc'
import { services } from '../services'

export const test = auth
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { userId } = context
    return { userId, input }
  })

export const uploadFile = auth
  .input(z.object({ file: z.instanceof(File) }))
  .handler(async ({ input }) => {
    const r2Obj = await services.updateFile(input.file)

    return { url: r2Obj?.key || '' }
  })
