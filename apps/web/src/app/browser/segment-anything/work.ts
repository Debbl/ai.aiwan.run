import { AutoProcessor, RawImage, SamModel, Tensor } from '@huggingface/transformers'
import { createWorker } from './lib'
import type { LocalFunctions, WorkerFunctions } from './types'

const MODEL_ID = 'Xenova/slimsam-77-uniform'

async function segmentAnything() {
  return Promise.all([SamModel.from_pretrained(MODEL_ID, {}), await AutoProcessor.from_pretrained(MODEL_ID, {})])
}

let imageInputs: any
let imageEmbeddings: any

createWorker<LocalFunctions, WorkerFunctions>({
  init: async () => {
    try {
      await segmentAnything()
      return true
    } catch {
      return false
    }
  },
  segment: async (data) => {
    const [model, processor] = await segmentAnything()

    const image = await RawImage.read(data)

    imageInputs = await processor(image)
    imageEmbeddings = await (model as any).get_image_embeddings(imageInputs)
  },
  decode: async (data) => {
    const [model, processor] = await segmentAnything()

    const reshaped = imageInputs.reshaped_input_sizes[0]
    const points = data.map((p) => [p.x * reshaped[1], p.y * reshaped[0]])
    const labels = data.map((x) => BigInt(x.label))

    const input_points = new Tensor('float32', points.flat(Infinity), [1, 1, points.length, 2])
    const input_labels = new Tensor('int64', labels.flat(Infinity), [1, 1, labels.length])

    const { pred_masks, iou_scores } = await model({
      ...imageEmbeddings,
      input_points,
      input_labels,
    })

    const masks = await (processor as any).post_process_masks(
      pred_masks,
      imageInputs.original_sizes,
      imageInputs.reshaped_input_sizes,
    )

    return {
      mask: RawImage.fromTensor(masks[0][0]),
      scores: iou_scores.data,
    }
  },
})
