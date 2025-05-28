import { Buffer } from 'node:buffer'
import { R2_BASE_URL } from '~/env'

export function getR2Url(key: string) {
  return `${R2_BASE_URL}/${key}`
}

export async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  return `data:${blob.type};base64,${base64}`
}
