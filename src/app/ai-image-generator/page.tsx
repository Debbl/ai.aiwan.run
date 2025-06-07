'use client'
import { DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { parseAsString, useQueryState } from 'nuqs'
import { match } from 'ts-pattern'
import { LoaderPinwheel } from '~/components/animate-ui/icons/loader-pinwheel'
import { Button } from '~/components/ui/button'
import { useAuthGuard } from '~/hooks/useAuth'
import { useRefreshCredits } from '~/hooks/useRefreshCredits'
import { contract } from '~/shared/contract'
import { AIChatInput } from './components/ai-chat-input'

export default function Page() {
  const [recordId, setRecordId] = useQueryState('recordId', parseAsString)

  const { trigger } = useSWRMutation(
    contract.aiImageGenerator.path,
    async (
      _,
      { arg }: { arg: Parameters<typeof api.aiImageGenerator>[0]['body'] },
    ) => {
      const res = await api.aiImageGenerator({
        body: arg,
      })

      if (res.status !== 200) {
        throw new Error('Failed to generate image')
      }

      return res.body
    },
  )

  const { data } = useSWR(
    recordId ? [contract.getImageById.path, recordId] : null,
    async ([_, id]) => {
      const res = await api.getImageById({ query: { id } })

      return res
    },
    {
      refreshInterval(latestData) {
        if (
          latestData?.status !== 200 ||
          latestData?.body.status === 'pending'
        ) {
          return 0
        }

        return 5000
      },
    },
  )

  const { handleAuthGuard } = useAuthGuard()
  const { refreshCredits } = useRefreshCredits()
  const handleClick = async (prompt: string) => {
    if (!handleAuthGuard()) return

    const res = await trigger({
      prompt,
    })
    refreshCredits()
    setRecordId(res.recordId)
  }

  const handleDownload = async () => {
    if (data?.status !== 200) return
    if (!data?.body.generatedImageUrl) return

    const res = await fetch(data.body.generatedImageUrl)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className='relative flex flex-1 flex-col'>
      <div className='size-full'>
        {match(data)
          .with({ status: 200, body: { status: 'completed' } }, ({ body }) => {
            return (
              <div className='mt-2 flex h-full flex-col items-center justify-start'>
                <Image
                  src={body.generatedImageUrl ?? ''}
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
                    <DownloadIcon className='size-4' /> Download
                  </Button>
                </div>
              </div>
            )
          })
          .with({ status: 200, body: { status: 'pending' } }, () => {
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
