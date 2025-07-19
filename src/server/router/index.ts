import { aiGhibliGenerator, aiImageGenerator } from './ai/image'
import { aiFortuneTeller } from './ai/text'
import { test, uploadFile } from './common'
import { getImageById, getImageList } from './image'
import { getCredits } from './user'

export const router = {
  test,
  uploadFile,

  ai: {
    text: {
      aiFortuneTeller,
    },
    image: {
      aiGhibliGenerator,
      aiImageGenerator,
    },
  },

  user: {
    getCredits,
  },

  image: {
    getImageList,
    getImageById,
  },
}

export type Router = typeof router
