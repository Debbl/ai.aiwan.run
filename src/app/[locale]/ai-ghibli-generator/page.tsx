'use client'
import { Trans, useLingui } from '@lingui/react/macro'
import { LucideDatabase } from 'lucide-react'
import Image from 'next/image'
import { parseAsString, useQueryState } from 'nuqs'
import { match, P } from 'ts-pattern'
import { useIsMatchMedia } from 'use-is-match-media'
import { LoaderPinwheel } from '~/components/animate-ui/icons/loader-pinwheel'
import { PlusIcon } from '~/components/icons/plus-icon'
import { RocketIcon } from '~/components/icons/rocket-icon'
import { XIcon } from '~/components/icons/x-icon'
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '~/components/motion-primitives/image-comparison'
import { Button } from '~/components/ui/button'
import { Card, CardFooter } from '~/components/ui/card'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { Textarea } from '~/components/ui/textarea'
import { useAuthGuard } from '~/hooks/useAuth'
import { useRefreshCredits } from '~/hooks/useRefreshCredits'
import { getImageSize } from '~/utils'

export default function Page() {
  const { handleAuthGuard } = useAuthGuard()
  const [image, setImage] = useState<File | null>(null)
  const [recordId, setRecordId] = useQueryState('recordId', parseAsString)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [_imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  })
  const { t } = useLingui()
  const [prompt, setPrompt] = useState(
    t`convert this photo to studio ghibli style anime`,
  )
  const isMobile = useIsMatchMedia('(max-width: 768px)')

  const { refreshCredits } = useRefreshCredits()
  const { data: imageList } = api.getImageById.useSWR(
    {
      query: {
        id: recordId || '',
      },
    },
    {
      enabled: !!recordId,
      refreshInterval: (latestData) => {
        if (
          latestData?.status === 'completed' ||
          latestData?.status === 'failed'
        ) {
          refreshCredits()
          return 0
        }

        return 5000
      },
      errorRetryCount: 1,
    },
  )

  const uploadImageUrl = useMemo(() => {
    if (!image) return null
    return URL.createObjectURL(image)
  }, [image])

  const { trigger, isMutating } = api.aiGhibliGenerator.useSWRMutation({
    onSuccess: () => {
      refreshCredits()
    },
  })

  const handleClick = async () => {
    if (!handleAuthGuard()) return
    if (!image) return

    const res = await trigger({
      body: {
        image,
        prompt,
      },
    })

    setRecordId(res.recordId)
  }

  const handleFileChange = async (file: File) => {
    setImage(file)
    const url = URL.createObjectURL(file)

    const imageSize = await getImageSize(url)
    setImageSize(imageSize)
    setPrompt(
      `convert this photo to studio ghibli style anime, ratio is ${imageSize.width}:${imageSize.height}`,
    )
  }

  const handleDownload = async () => {
    if (!imageList?.generatedImageUrl) return

    const response = await fetch(imageList.generatedImageUrl)
    const blob = await response.blob()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-ghibli-generator-image.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className='relative flex flex-1 flex-col items-center justify-center gap-y-6'>
      <ResizablePanelGroup
        direction={isMobile ? 'vertical' : 'horizontal'}
        className='size-full flex-1 border-b'
      >
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={40}
          style={{ minWidth: 400, minHeight: 400 }}
        >
          <div className='flex h-full flex-col items-center justify-between'>
            <h1 className='mt-4 text-center text-3xl font-bold'>
              <Trans>AI Ghibli Generator</Trans>
            </h1>

            <Card
              className={cn(
                'relative flex h-[30%] max-h-[600px] w-[80%] max-w-[600px] items-center justify-center border-dashed',
                isDragging && 'border-muted-foreground',
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (!file) return
                handleFileChange(file)
              }}
              onClick={() => {
                inputRef.current?.click()
              }}
            >
              <PlusIcon
                size={100}
                className={cn(
                  'text-muted',
                  isDragging && 'text-muted-foreground',
                )}
              />
              {uploadImageUrl && (
                <div className='group absolute inset-0 flex items-center justify-center'>
                  <Image
                    src={uploadImageUrl}
                    alt={t`origin image`}
                    width={100}
                    height={100}
                    className='size-full object-contain'
                  />
                  <div className='absolute top-2 right-2 hidden group-hover:block'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation()
                        setImage(null)
                      }}
                    >
                      <XIcon size={24} />
                    </Button>
                  </div>
                </div>
              )}
              <input
                type='file'
                className='hidden'
                ref={inputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  handleFileChange(file)
                }}
              />
            </Card>

            <Textarea
              disabled={!image}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t`Enter your prompt`}
              className='w-[80%] max-w-[600px]'
              rows={3}
            />

            <div className='my-4'>
              <Button onClick={handleClick} disabled={isMutating}>
                <span>
                  <Trans>Generate</Trans>
                </span>
                <div className='flex items-center gap-1'>
                  <span>2</span> <LucideDatabase />
                </div>
              </Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div className='flex size-full flex-col items-center justify-center gap-2'>
            <Card
              className={cn(
                'relative flex h-[70%] max-h-[600px] w-[80%] max-w-[600px] items-center justify-center',
              )}
            >
              {match(imageList?.status)
                .with(P.union('pending', 'processing'), () => {
                  return (
                    <div className='bg-accent absolute inset-0 flex items-center justify-center'>
                      <LoaderPinwheel size={100} animate />
                    </div>
                  )
                })
                .with('completed', () => (
                  <div className='size-full'>
                    <ImageComparison className='size-full'>
                      <ImageComparisonImage
                        src={imageList?.originalImageUrl || ''}
                        alt={t`original-image`}
                        position='left'
                      />
                      <ImageComparisonImage
                        src={imageList?.generatedImageUrl || ''}
                        alt={t`generated-image`}
                        position='right'
                      />
                      <ImageComparisonSlider className='bg-accent' />
                    </ImageComparison>
                  </div>
                ))
                .with('failed', () => (
                  <div>
                    <Trans>failed</Trans>
                  </div>
                ))
                .otherwise(() => (
                  <>
                    <RocketIcon />
                    <CardFooter>
                      <div className='flex flex-col items-center justify-center'>
                        <p>
                          <Trans>Generate Your Ghibli Art Now!</Trans>
                        </p>
                        <p className='text-muted-foreground'>
                          <Trans>
                            Please upload an image to generate a Ghibli image
                          </Trans>
                        </p>
                      </div>
                    </CardFooter>
                  </>
                ))}
            </Card>

            {imageList?.status === 'completed' && (
              <div>
                <Button onClick={handleDownload}>
                  <Trans>Download</Trans>
                </Button>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
