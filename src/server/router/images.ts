import { ORPCError } from '@orpc/server'
import z from 'zod'
import { getR2Url } from '~/shared'
import { dao } from '../dao'
import { auth } from '../orpc'
import { sendQueue } from '../queues'
import { services } from '../services'

export const aiGhibliGenerator = auth
  .input(
    z.object({
      prompt: z.string(),
      image: z.instanceof(File),
    }),
  )
  .handler(async ({ context, input }) => {
    const { userId } = context

    const {
      prompt = 'convert this photo to studio ghibli style anime',
      image,
    } = input

    const r2Obj = await services.updateFile(image)

    if (!r2Obj) {
      throw new ORPCError('FAILED_TO_UPLOAD_IMAGE', {
        message: 'Failed to upload image',
      })
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
      throw new ORPCError('FAILED_TO_INSERT_IMAGE_GENERATION', {
        message: 'Failed to insert image generation',
      })
    }

    await dao.user.updateCredits({
      userId,
      amount: -amount,
    })

    await sendQueue({
      type: 'ai-ghibli-generator',
      data: {
        id: imageGenerationsInsert.meta.last_row_id,
        userId,
        prompt,
        imageUrl: getR2Url(originalImageUrlKey),
        amount,
      },
    })

    return {
      recordId: imageGenerationsInsert.meta.last_row_id.toString(),
    }
  })

export const aiImageGenerator = auth
  .input(
    z.object({
      prompt: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { userId } = context
    const { prompt } = input

    const amount = 2
    const userUpdate = await dao.user.updateCredits({
      userId,
      amount: -amount,
    })

    if (userUpdate.error) {
      throw new ORPCError('FAILED_TO_UPDATE_CREDITS', {
        message: 'Failed to update credits',
      })
    }

    const imageGenerationsInsert = await dao.imageGenerations.insert({
      userId,
      prompt,
      type: 'text-to-image',
      credits: Math.abs(amount),
      originalImageUrl: '',
      generatedImageUrl: '',
      status: 'pending',
    })
    if (imageGenerationsInsert.error) {
      throw new ORPCError('FAILED_TO_INSERT_IMAGE_GENERATION', {
        message: 'Failed to insert image generation',
      })
    }

    await sendQueue({
      type: 'ai-image-generator',
      data: {
        id: imageGenerationsInsert.meta.last_row_id,
        userId,
        prompt,
        amount,
      },
    })

    return {
      recordId: imageGenerationsInsert.meta.last_row_id.toString(),
    }
  })

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
