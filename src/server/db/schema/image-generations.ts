import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const imageGenerationsTable = sqliteTable('image_generations_table', {
  id: int().primaryKey({ autoIncrement: true }),
  prompt: text().notNull(),
  generationText: text().default(''),
  status: text().notNull().default('pending'),
  originalImageUrl: text().notNull(),
  generatedImageUrl: text(),
})
