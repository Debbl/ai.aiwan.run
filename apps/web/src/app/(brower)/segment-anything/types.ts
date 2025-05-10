import type { RawImage } from '@huggingface/transformers'

export interface LocalFunctions {}

export interface WorkerFunctions {
  init: () => Promise<boolean>
  segment: (data: string) => Promise<void>
  decode: (points: Points) => Promise<{
    mask: RawImage
    scores: any
  }>
}

export type Points = Point[]

export interface Point {
  id: 0 | 1
  x: number
  y: number
  label: number
}
