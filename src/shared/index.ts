import z from 'zod'
import { R2_BASE_URL } from '~/env'

export function getR2Url(key?: string) {
  if (!key) return ''

  const { success } = z.string().url().safeParse(key)
  if (!success) return key

  return `${R2_BASE_URL}/${key}`
}
