import { z } from 'zod/v4'

export const imageGenerationStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
])
export type ImageGenerationStatus = z.infer<typeof imageGenerationStatusSchema>

export const model = [
  'gpt-4o-image-vip',
  'gpt-image-1',
  'gpt-image-1-vip',
] as const
export const modelSchema = z.enum(model)
export type Model = z.infer<typeof modelSchema>
