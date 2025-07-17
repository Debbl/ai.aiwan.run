import z from 'zod'
import { getR2Url } from '~/shared'
import { dao } from '../dao'
import { auth } from '../orpc'

export const getImageList = auth
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
    }),
  )
  .route({
    method: 'GET',
  })
  .handler(async ({ context }) => {
    const { userId } = context

    const res = await dao.imageGenerations.getList({
      userId,
    })

    const imageList = res.map((item) => ({
      id: item.id,
      originalImageUrl: getR2Url(item.originalImageUrl),
      generatedImageUrl: getR2Url(item.generatedImageUrl),
      status: item.status,
    }))

    return { list: imageList }
  })

export const getImageById = auth
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .route({
    method: 'GET',
  })
  .handler(async ({ input }) => {
    const { id } = input

    const res = await dao.imageGenerations.getById({ id: Number(id) })

    return {
      id: res.id,
      originalImageUrl: getR2Url(res.originalImageUrl),
      generatedImageUrl: getR2Url(res.generatedImageUrl),
      status: res.status,
    }
  })
