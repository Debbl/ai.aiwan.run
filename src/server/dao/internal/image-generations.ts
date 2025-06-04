import { desc, eq } from 'drizzle-orm'
import { getDBAsync } from '~/server/db'
import { schema } from '~/server/db/schema'
import type { ImageGenerationsInferInsert } from '~/server/db/schema/internal/image-generations'

export async function insert(values: ImageGenerationsInferInsert) {
  const db = await getDBAsync()

  return await db.insert(schema.imageGenerations).values(values)
}

export async function update(
  values: Partial<ImageGenerationsInferInsert> & { id: number },
) {
  const db = await getDBAsync()

  return await db
    .update(schema.imageGenerations)
    .set(values)
    .where(eq(schema.imageGenerations.id, values.id))
}

export async function getList(values: { userId: string }) {
  const db = await getDBAsync()

  return await db
    .select()
    .from(schema.imageGenerations)
    .where(eq(schema.imageGenerations.userId, values.userId))
    .orderBy(desc(schema.imageGenerations.createdAt))
}

export async function getById(values: { id: number }) {
  const db = await getDBAsync()

  const res = await db
    .select()
    .from(schema.imageGenerations)
    .where(eq(schema.imageGenerations.id, values.id))
    .limit(1)

  return res[0]
}
