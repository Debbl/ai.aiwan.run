import { eq } from 'drizzle-orm'
import { getDBAsync } from '~/server/db'
import { schema } from '~/server/db/schema'

export async function insert(values: {
  userId: string
  prompt: string
  originalImageUrl: string
  generatedImageUrl: string
  status: string
}) {
  const db = await getDBAsync()

  return await db.insert(schema.imageGenerations).values(values)
}

export async function update(values: {
  id: number
  status?: string
  prompt?: string
  originalImageUrl?: string
  generatedImageUrl?: string
  generationText?: string
}) {
  const db = await getDBAsync()

  return await db.update(schema.imageGenerations).set(values).where(eq(schema.imageGenerations.id, values.id))
}
