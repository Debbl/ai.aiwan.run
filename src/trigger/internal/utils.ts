import { Buffer } from 'node:buffer'

export async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  return `data:${blob.type};base64,${base64}`
}

export async function srcToBase64String(src: string) {
  const blob = await fetch(src).then((res) => res.blob())

  return await blobToBase64(blob)
}

export async function base64ToFile(base64: string) {
  const blob = await fetch(`data:image/png;base64,${base64}`).then((res) =>
    res.blob(),
  )
  const file = new File([blob], 'image.png', { type: blob.type })

  return file
}
