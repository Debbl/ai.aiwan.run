import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const contract = c.router({
  uploadFile: {
    method: 'POST',
    path: '/upload-file',
    contentType: 'multipart/form-data',
    body: c.type<{
      file: File
    }>(),
    responses: {
      200: z.object({
        url: z.string(),
      }),
    },
  },
  aiFortuneTeller: {
    method: 'POST',
    path: '/ai-fortune-teller',
    body: z.any(),
    responses: {
      200: c.otherResponse({
        contentType: 'text/plain; charset=utf-8',
        body: z.any(),
      }),
    },
  },
  aiGhibliGenerator: {
    method: 'POST',
    path: '/ai-ghibli-generator',
    contentType: 'multipart/form-data',
    body: c.type<{
      image: File
      ratio: string
    }>(),
    responses: {
      200: c.otherResponse({
        contentType: 'text/plain; charset=utf-8',
        body: z.any(),
      }),
    },
  },
})
