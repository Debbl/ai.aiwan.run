import { test, uploadFile } from './common'
import {
  aiGhibliGenerator,
  aiImageGenerator,
  getImageById,
  getImageList,
} from './images'
import { getCredits } from './user'

export const router = {
  test,
  uploadFile,

  user: {
    getCredits,
  },

  images: {
    getImageList,
    getImageById,
    aiGhibliGenerator,
    aiImageGenerator,
  },
}

export type Router = typeof router
