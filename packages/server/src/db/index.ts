import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { cache } from "react";
import * as schema from "./schema";

export const getDb = cache(() => {
  const { env } = getCloudflareContext();
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema });
});

// This is the one to use for static routes (i.e. ISR/SSG)
export const getDbAsync = cache(async () => {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.NEXT_TAG_CACHE_D1!, { schema });
});

export function insertImageGeneration(
  prompt: string,
  originalImageUrl: string,
  generatedImageUrl: string,
  status: string,
) {
  const db = getDb();

  return db.insert(schema.imageGenerationsTable).values({
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
  const db = getDb();

  return db
    .update(schema.imageGenerationsTable)
    .set({
      prompt,
      status,
      originalImageUrl,
      generatedImageUrl,
    })
    .where(eq(schema.imageGenerationsTable.id, id));
}
