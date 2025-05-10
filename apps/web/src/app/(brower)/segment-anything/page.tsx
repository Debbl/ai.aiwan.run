'use client'
import { Loader, Sparkle, X } from 'lucide-react'
import NextImage from 'next/image'
import { useRef, useState } from 'react'
import { match } from 'ts-pattern'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { getImageSize } from '~/utils'
import { useRPCWorker } from './lib/use-rpc-worker'
import type { ChangeEventHandler } from 'react'
import type { LocalFunctions, Point, WorkerFunctions } from './types'

function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(Math.max(value, min), max)
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [score, setScore] = useState(0)
  const [image, setImage] = useState({
    src: '',
    width: 0,
    height: 0,
  })
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)

  const { rpc } = useRPCWorker<WorkerFunctions, LocalFunctions>(
    () => new Worker(new URL('./work.ts', import.meta.url)),
    {},
  )

  const init = async () => {
    setIsLoading(true)
    setIsReady((await rpc.current?.init()) ?? false)
    setIsLoading(false)
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async (er) => {
      setIsLoading(true)

      if (!isReady) {
        setIsReady((await rpc.current?.init()) ?? false)
      }

      const result = er.target?.result
      if (typeof result === 'string') {
        await rpc.current?.segment(result)
      }

      setIsLoading(false)
    }

    reader.readAsDataURL(file)

    const src = URL.createObjectURL(file)
    setImage({
      src,
      ...(await getImageSize(src)),
    })
  }

  const handleImageMouseDown = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (isLoading) return

    setIsLoading(true)
    const imageEl = e.currentTarget
    const imageRect = imageEl.getBoundingClientRect()

    const point = {
      id: points.length,
      label: e.button === 0 ? 1 : 0,
      x: clamp((e.clientX - imageRect.left) / imageRect.width),
      y: clamp((e.clientY - imageRect.top) / imageRect.height),
    } as Point

    const newPoints = [...points, point]
    setPoints(newPoints)

    const data = await rpc.current?.decode(newPoints)
    do {
      if (!data) break

      const { mask, scores } = data
      const maskCanvas = maskCanvasRef.current!
      // Update canvas dimensions (if different)
      if (maskCanvas.width !== mask.width || maskCanvas.height !== mask.height) {
        maskCanvas.width = mask.width
        maskCanvas.height = mask.height
      }

      // Create context and allocate buffer for pixel data
      const context = maskCanvas.getContext('2d')!
      const imageData = context.createImageData(maskCanvas.width, maskCanvas.height)

      // Select best mask
      const numMasks = scores.length // 3
      let bestIndex = 0
      for (let i = 1; i < numMasks; ++i) {
        if (scores[i] > scores[bestIndex]) {
          bestIndex = i
        }
      }
      setScore(+scores[bestIndex].toFixed(2))

      // Fill mask with colour
      const pixelData = imageData.data
      for (let i = 0; i < pixelData.length; ++i) {
        if (mask.data[numMasks * i + bestIndex] === 1) {
          const offset = 4 * i
          pixelData[offset] = 0 // red
          pixelData[offset + 1] = 114 // green
          pixelData[offset + 2] = 189 // blue
          pixelData[offset + 3] = 255 // alpha
        }
      }

      context.putImageData(imageData, 0, 0)
    } while (false)

    setIsLoading(false)
  }

  const handleCutMask = () => {
    const maskCanvas = maskCanvasRef.current!

    const [w, h] = [maskCanvas.width, maskCanvas.height]

    // Get the mask pixel data
    const maskContext = maskCanvas.getContext('2d')!
    const maskPixelData = maskContext.getImageData(0, 0, w, h)

    // Load the image
    const imageInstance = new Image()
    imageInstance.crossOrigin = 'anonymous'
    imageInstance.onload = async () => {
      // Create a new canvas to hold the image
      const imageCanvas = new OffscreenCanvas(w, h)
      const imageContext = imageCanvas.getContext('2d')!
      imageContext.drawImage(imageInstance, 0, 0, w, h)
      const imagePixelData = imageContext.getImageData(0, 0, w, h)

      // Create a new canvas to hold the cut-out
      const cutCanvas = new OffscreenCanvas(w, h)
      const cutContext = cutCanvas.getContext('2d')!
      const cutPixelData = cutContext.getImageData(0, 0, w, h)

      // Copy the image pixel data to the cut canvas
      for (let i = 3; i < maskPixelData.data.length; i += 4) {
        if (maskPixelData.data[i] > 0) {
          for (let j = 0; j < 4; ++j) {
            const offset = i - j
            cutPixelData.data[offset] = imagePixelData.data[offset]
          }
        }
      }
      cutContext.putImageData(cutPixelData, 0, 0)

      // Download image
      const link = document.createElement('a')
      link.download = 'image.png'
      link.href = URL.createObjectURL(await cutCanvas.convertToBlob())
      link.click()
      link.remove()
    }
    imageInstance.src = image.src
  }

  return (
    <main className='flex min-h-screen items-center justify-center'>
      <div>
        <h1 className='text-center text-lg font-bold'>Segment anything</h1>

        <div className='mt-4 flex items-center gap-x-2'>
          <Input type='file' accept='image/*' onChange={handleInputChange} />
          {match(isReady)
            .with(true, () => (
              <Button disabled={!isReady || !image.src} onClick={handleCutMask}>
                Cut mask
              </Button>
            ))
            .otherwise(() => (
              <Button onClick={init} disabled={isLoading}>
                {isLoading && <Loader className='animate-spin' />}
                load model
              </Button>
            ))}
        </div>

        <p className='mt-2 text-sm text-gray-600'>Left click = positive points, right click = negative points.</p>

        {image.src && (
          <>
            <div className='relative mt-4'>
              <NextImage
                onMouseDown={handleImageMouseDown}
                onContextMenu={(e) => e.preventDefault()}
                className='mt-2 size-full cursor-pointer'
                {...image}
                alt='image'
              />
              <canvas ref={maskCanvasRef} className='pointer-events-none absolute inset-0 size-full' />

              {points.map((p) => {
                const Icon = p.label === 0 ? X : Sparkle

                return (
                  <Icon
                    key={p.id}
                    onContextMenu={(e) => e.preventDefault()}
                    className='absolute size-6 -translate-x-3 -translate-y-3 cursor-pointer'
                    color={p.label === 0 ? '#dc2626' : '#fef08a'}
                    style={{
                      left: `${p.x * 100}%`,
                      top: `${p.y * 100}%`,
                    }}
                  />
                )
              })}
              {isLoading && (
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  className='absolute inset-0 flex size-full items-center justify-center bg-gray-400/20'
                >
                  <Loader className='animate-spin' />
                </div>
              )}
            </div>
            <p className='mt-2 text-center'>Segment score : {score}</p>
          </>
        )}
      </div>
    </main>
  )
}
