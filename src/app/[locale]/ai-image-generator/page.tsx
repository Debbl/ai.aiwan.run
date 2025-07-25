'use client'
import { Trans } from '@lingui/react/macro'
import { DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { parseAsString, useQueryState } from 'nuqs'
import { match } from 'ts-pattern'
import { LoaderPinwheel } from '~/components/animate-ui/icons/loader-pinwheel'
import { Button } from '~/components/ui/button'
import { useAuthGuard } from '~/hooks/useAuth'
import { useRefreshCredits } from '~/hooks/useRefreshCredits'
import { AIChatInput } from './components/ai-chat-input'

export default function Page() {
  const [recordId, setRecordId] = useQueryState('recordId', parseAsString)

  const { mutateAsync } = useMutation(
    orpc.ai.image.aiImageGenerator.mutationOptions(),
  )

  const { data } = useQuery(
    orpc.image.getImageById.queryOptions({
      input: {
        id: recordId || '',
      },
      enabled: !!recordId,
      refetchInterval(latestData) {
        const status = latestData.state.data?.status

        if (status === 'completed' || status === 'failed') {
          return 0
        }

        return 5000
      },
    }),
  )

  const { handleAuthGuard } = useAuthGuard()
  const { refreshCredits } = useRefreshCredits()
  const handleClick = async (prompt: string) => {
    if (!handleAuthGuard()) return

    const res = await mutateAsync({
      prompt,
    })
    refreshCredits()
    setRecordId(res.recordId)
  }

  const handleDownload = async () => {
    if (!data?.generatedImageUrl) return

    const res = await fetch(data.generatedImageUrl, {
      mode: 'cors',
      referrerPolicy: 'no-referrer',
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-image-generator-image.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='relative flex flex-1 flex-col'>
      <div className='size-full'>
        {match(data)
          .with({ status: 'completed' }, ({ generatedImageUrl }) => {
            return (
              <div className='mt-2 flex h-full flex-col items-center justify-start'>
                <Image
                  src={generatedImageUrl ?? ''}
                  alt='AI Image'
                  width={100}
                  height={100}
                  className='size-auto max-h-[70%] max-w-[70%]'
                />
                <div className='mt-2 flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='default'
                    onClick={handleDownload}
                  >
                    <DownloadIcon className='size-4' />
                    <Trans>Download</Trans>
                  </Button>
                </div>
              </div>
            )
          })
          .with({ status: 'pending' }, () => {
            return (
              <div className='flex h-full flex-col items-center justify-center'>
                <LoaderPinwheel className='size-10' animate loop />
              </div>
            )
          })
          .otherwise(() => {
            return null
          })}
      </div>

      <AIChatInput handleSubmit={handleClick} />
    </div>
  )
}
