import { ORPCError } from '@orpc/server'
import { eq } from 'drizzle-orm'
import { getDBAsync } from '~/server/db'
import { schema } from '~/server/db/schema'

export async function update(values: { userId: string; credits: number }) {
  const db = await getDBAsync()

  return await db
    .update(schema.user)
    .set(values)
    .where(eq(schema.user.id, values.userId))
}

export async function updateCredits(values: {
  userId: string
  amount: number
}) {
  const db = await getDBAsync()
  const credits = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, values.userId))

  const newCredits = credits[0].credits + values.amount

  if (newCredits < 0) {
    throw new ORPCError('CREDITS_NOT_ENOUGH', {
      message: 'Credits not enough',
    })
  }

  return await db
    .update(schema.user)
    .set({ credits: newCredits })
    .where(eq(schema.user.id, values.userId))
}

export async function getCreditsByUserId({ userId }: { userId: string }) {
  const db = await getDBAsync()

  const user = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId))

  if (!user) {
    return null
  }

  return user[0]
}
