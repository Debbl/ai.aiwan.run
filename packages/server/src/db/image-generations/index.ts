import { eq } from 'drizzle-orm'
import { getDB } from '../getDB'
import * as schema from './schema'

export function insertImageGeneration(
  prompt: string,
  originalImageUrl: string,
  generatedImageUrl: string,
  status: string,
) {
  const db = getDB()

  return db.insert(schema.imageGenerationsTable).values({
    prompt,
    status,
    originalImageUrl,
    generatedImageUrl,
  })
}

export function updateImageGeneration(
  id: number,
  status?: string,
  prompt?: string,
  originalImageUrl?: string,
  generatedImageUrl?: string,
) {
  const db = getDB()

  return db
    .update(schema.imageGenerationsTable)
    .set({
      prompt,
      status,
      originalImageUrl,
      generatedImageUrl,
    })
    .where(eq(schema.imageGenerationsTable.id, id))
}
