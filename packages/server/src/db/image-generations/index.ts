import { eq } from 'drizzle-orm'
import { getDBAsync } from '../getDB'
import * as schema from './schema'

export async function insertImageGeneration(values: {
  prompt: string
  originalImageUrl: string
  generatedImageUrl: string
  status: string
}) {
  const db = await getDBAsync()

  return await db.insert(schema.imageGenerationsTable).values(values)
}

export async function updateImageGeneration(
  id: number,
  status?: string,
  prompt?: string,
  originalImageUrl?: string,
  generatedImageUrl?: string,
) {
  const db = await getDBAsync()

  return await db
    .update(schema.imageGenerationsTable)
    .set({
      prompt,
      status,
      originalImageUrl,
      generatedImageUrl,
    })
    .where(eq(schema.imageGenerationsTable.id, id))
}
