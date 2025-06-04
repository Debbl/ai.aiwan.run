import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { imageGenerationStatus } from '~/server/dao/internal/image-generations'

const c = initContract()

export const contract = c.router(
  {
    test: {
      method: 'POST',
      path: '/test',
      body: z.object({
        name: z.string(),
      }),
      responses: {
        200: z.any(),
      },
    },
    getUser: {
      method: 'GET',
      path: '/get-user',
      responses: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          credits: z.number(),
        }),
        500: z.string(),
      },
    },
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
    updateImageGeneration: {
      method: 'POST',
      path: '/update-image-generation',
      body: z.object({
        id: z.number(),
        status: imageGenerationStatus,
        prompt: z.string().optional(),
        generationText: z.string().optional(),
        originalImageUrl: z.string().optional(),
        generatedImageUrl: z.string().optional(),
      }),
      responses: {
        200: z.string(),
        500: z.string(),
      },
    },
    updateUserCredits: {
      method: 'POST',
      path: '/update-user-credits',
      body: z.object({
        userId: z.string(),
        amount: z.number(),
      }),
      responses: {
        200: z.string(),
        500: z.string(),
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
        500: z.object({
          error: z.string(),
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
        prompt?: string
      }>(),
      responses: {
        200: z.object({
          recordId: z.string(),
        }),
        500: z.string(),
      },
    },
    getImageList: {
      method: 'GET',
      path: '/get-image-list',
      query: z.object({
        userId: z.string(),
      }),
      responses: {
        200: z.object({
          list: z.array(
            z.object({
              id: z.number(),
              originalImageUrl: z.string().nullable(),
              generatedImageUrl: z.string().nullable(),
              status: imageGenerationStatus,
            }),
          ),
        }),
      },
    },
    getImageById: {
      method: 'GET',
      path: '/get-image-by-id',
      query: z.object({
        id: z.string(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          originalImageUrl: z.string().nullable(),
          generatedImageUrl: z.string().nullable(),
          status: imageGenerationStatus,
        }),
        500: z.string(),
      },
    },
  },
  {
    pathPrefix: '/api',
    commonResponses: {
      401: z.object({
        message: z.string(),
      }),
    },
  },
)
