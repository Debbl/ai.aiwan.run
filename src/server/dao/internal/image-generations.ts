import { eq } from 'drizzle-orm'
import { getDBAsync } from '~/server/db'
import { schema } from '~/server/db/schema'

export async function insert(values: {
  prompt: string
  originalImageUrl: string
  generatedImageUrl: string
  status: string
}) {
  const db = await getDBAsync()

  return await db.insert(schema.imageGenerationsTable).values(values)
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

  return await db.update(schema.imageGenerationsTable).set(values).where(eq(schema.imageGenerationsTable.id, values.id))
}
