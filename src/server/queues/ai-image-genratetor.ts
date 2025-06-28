import { experimental_generateImage as generateImage } from 'ai'
import { logger } from '~/shared/logger'
import { dao } from '../dao'
import { services } from '../services'
import { base64ToFile } from '../utils'
import { openai } from './internal/models'

export async function runAiImageGeneratorQueue(payload: {
  id: number
  userId: string
  prompt: string
  amount: number
}) {
  const { id, userId, prompt, amount } = payload

  try {
    logger.log(`payload: ${JSON.stringify(payload, null, 2)}`)

    const result = await generateImage({
      model: openai.image('gpt-image-1'),
      prompt,
      n: 1,
    })

    logger.log(`ok images length: ${result.images.length}`)

    for (const image of result.images) {
      const base64 = image.base64
      const imageFile = await base64ToFile(base64)
      const uploadFile = await services.updateFile(imageFile)

      logger.log(`uploadFile: ${JSON.stringify(uploadFile, null, 2)}`)

      if (!uploadFile) {
        throw new Error('Failed to upload file')
      }

      const updateImageGeneration = await dao.imageGenerations.update({
        id,
        status: 'completed',
        generatedImageUrl: uploadFile.key,
      })
      if (!updateImageGeneration) {
        throw new Error('Failed to update image generation')
      }
    }
  } catch (error) {
    logger.error(`error: ${JSON.stringify(error, null, 2)}`)

    await dao.imageGenerations.update({
      id,
      status: 'failed',
    })

    await dao.user.updateCredits({
      userId,
      amount,
    })

    logger.info(
      `${new Date().toISOString()} 🚀 ~ return credits`,
      userId,
      amount,
    )
  }
}
