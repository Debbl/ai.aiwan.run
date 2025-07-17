import { ORPCError } from '@orpc/server'
import z from 'zod'
import { dao } from '~/server/dao'
import { auth } from '~/server/orpc'
import { sendQueue } from '~/server/queues'
import { services } from '~/server/services'
import { getR2Url } from '~/shared'

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
