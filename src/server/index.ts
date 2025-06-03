import { Buffer } from 'node:buffer'

export async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  return `data:${blob.type};base64,${base64}`
}
