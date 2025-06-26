import { getCloudflareContextAsync } from '~/server/get-cloudflare-context'

export async function updateFile(file: File) {
  const { env } = await getCloudflareContextAsync()

  const uuid = crypto.randomUUID()

  const NEXT_INC_CACHE_R2_BUCKET = env.NEXT_INC_CACHE_R2_BUCKET
  if (!NEXT_INC_CACHE_R2_BUCKET) {
    throw new Error('NEXT_INC_CACHE_R2_BUCKET is not defined')
  }

  const ext = file.name.split('.').pop()
  const key = `${uuid}.${ext}`
  const r2Obj = await NEXT_INC_CACHE_R2_BUCKET.put(key, file)

  return r2Obj
}
