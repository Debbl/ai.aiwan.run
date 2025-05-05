import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { imageGenerationsTable } from "./schema";

export const db = drizzle("AI_AIWAN_RUN");

export function insertImageGeneration(
  prompt: string,
  originalImageUrl: string,
  generatedImageUrl: string,
  status: string,
) {
  return db.insert(imageGenerationsTable).values({
    prompt,
    status,
    originalImageUrl,
    generatedImageUrl,
  });
}

export function updateImageGeneration(
  id: number,
  status?: string,
  prompt?: string,
  originalImageUrl?: string,
  generatedImageUrl?: string,
) {
  return db
    .update(imageGenerationsTable)
    .set({
      prompt,
      status,
      originalImageUrl,
      generatedImageUrl,
    })
    .where(eq(imageGenerationsTable.id, id));
}
