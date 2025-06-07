import z from 'zod'

export function getR2Url(key?: string) {
  if (!key) return ''

  const { success } = z.string().url().safeParse(key)
  if (success) return key

  return `https://r2.aiwan.run/${key}`
}
