import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

export const imageGenerations = sqliteTable('image_generations_table', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text()
    .references(() => user.id)
    .notNull(),
  prompt: text().notNull(),
  generationText: text().default(''),
  credits: int().default(0),
  status: text().notNull().default('pending'),
  originalImageUrl: text().notNull().default(''),
  generatedImageUrl: text().notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})
