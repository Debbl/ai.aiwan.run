'use client'
import Image from 'next/image'
import { toast } from 'sonner'
import { Spinner } from '~/components/spinner'
import { Button } from '~/components/ui/button'
import { useAuthGuard } from '~/hooks/useAuth'
import { Input } from '../../components/ui/input'
import { PajamasClear } from '../../icons'
import { useAiGhibliGenerator } from './hooks/use-ai-ghibli-generator'

export default function Page() {
  const { status, originImage, progress, generatedImage, setOriginImage, handleSubmit } = useAiGhibliGenerator()
  const { handleAuthGuard } = useAuthGuard()

  const handleClick = async () => {
    handleAuthGuard()
    handleSubmit()
  }

  const handleDownload = async () => {
    const response = await fetch(generatedImage)
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
      <h1 className='text-3xl font-bold'>AI Ghibli Generator</h1>

      <div className='flex max-w-[60%] flex-col gap-y-2'>
        <div className='flex items-center gap-x-2'>
          <Input
            type='file'
            accept='image/*'
            className='h-full'
            data-umami-event='change-ai-ghibli-generator-input'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return

              if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB', {
                  position: 'top-left',
                  richColors: true,
                })
                e.target.value = ''
                return
              }

              setOriginImage(URL.createObjectURL(file))
            }}
          />

          <Button
            color='primary'
            onClick={handleClick}
            disabled={status !== 'ready' || !originImage}
            data-umami-event='click-ai-ghibli-generator-generate'
          >
            Generate
          </Button>
          {generatedImage && status === 'ready' && (
            <Button
              color='primary'
              size='sm'
              onClick={handleDownload}
              disabled={status !== 'ready' || !originImage}
              data-umami-event='click-ai-ghibli-generator-download'
            >
              Download
            </Button>
          )}
        </div>

        <div className='flex items-center gap-x-2 empty:hidden'>
          {originImage && (
            <div className='group relative flex flex-1 items-center'>
              <Button
                size='sm'
                aria-label='Clear'
                className='absolute top-2 right-2 opacity-0 group-hover:opacity-100'
                onClick={() => setOriginImage('')}
              >
                {<PajamasClear className='size-4' />}
              </Button>

              <Image src={originImage} alt='origin image' width={100} height={100} className='size-full' />
            </div>
          )}
          {generatedImage && (
            <div className='relative flex flex-1 items-center'>
              {['streaming', 'generating'].includes(status) && (
                <div className='absolute inset-0 flex items-center justify-center bg-white/50 text-white dark:bg-black/50'>
                  <Spinner className='size-4' />
                  <span className='text-sm'>{progress}%</span>
                </div>
              )}

              <Image src={generatedImage} alt='generated image' width={100} height={100} className='size-full' />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
