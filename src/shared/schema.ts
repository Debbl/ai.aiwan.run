import { z } from 'zod/v4'

export const imageGenerationStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
])
export type ImageGenerationStatus = z.infer<typeof imageGenerationStatusSchema>

export const modelSchema = z.enum([
  'gpt-4o-image-vip',
  'gpt-image-1',
  'gpt-image-1-vip',
])
export type Model = z.infer<typeof modelSchema>
