'use client'
import { useChat } from '@ai-sdk/react'
import { useEffectEvent, useHydrated } from '@debbl/ahooks'
import { Trans, useLingui } from '@lingui/react/macro'
import { eventIteratorToStream } from '@orpc/client'
import { format } from 'date-fns'
import { useAtom } from 'jotai/react'
import { Loader2Icon, LoaderCircleIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import { CopyButton } from '~/components/animate-ui/buttons/copy'
import { RippleButton } from '~/components/animate-ui/buttons/ripple'
import { DateTimePicker } from '~/components/datetime-picker'
import {
  MaterialSymbolsFemale,
  MaterialSymbolsMaleRounded,
} from '~/components/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { useAuthGuard } from '~/hooks/useAuth'
import { useRefreshCredits } from '~/hooks/useRefreshCredits'
import { client } from '~/lib/orpc'
import { infoAtom } from './atoms/info'

export default function Page() {
  const [info, setInfo] = useAtom(infoAtom)
  const { gender, birthday } = useMemo(
    () => ({
      gender: info.gender,
      birthday: info.birthday,
    }),
    [info],
  )
  const setGender = useEffectEvent((gender: '0' | '1') => {
    setInfo({ ...info, gender })
  })

  const setBirthday = useEffectEvent((birthday: string) => {
    setInfo({ ...info, birthday })
  })

  const [isShowThinking, setIsShowThinking] = useState(false)

  const { t } = useLingui()
  const { refreshCredits } = useRefreshCredits()

  const { status, messages, sendMessage } = useChat({
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.text.aiFortuneTeller(
            {
              chatId: options.chatId,
              messages: options.messages,
            },
            { signal: options.abortSignal },
          ),
        )
      },
      reconnectToStream() {
        throw new Error('Unsupported')
      },
    },
    onData: () => {
      refreshCredits()
    },
    onError: () => {
      refreshCredits()
    },
  })

  const { handleAuthGuard } = useAuthGuard()
  const handleSubmit = () => {
    if (!handleAuthGuard()) return
    sendMessage({
      text: JSON.stringify({
        gender,
        birthday: format(birthday, 'yyyy-MM-dd HH:mm'),
      }),
    })
  }

  const { isHydrated } = useHydrated()

  const localBirthday = useMemo(() => {
    return isHydrated ? new Date(birthday) : undefined
  }, [birthday, isHydrated])

  const message = useMemo(() => {
    const lastMessage = messages.at(-1)

    return lastMessage
  }, [messages])

  const reasoning = useMemo(() => {
    return message?.parts.find((i) => i.type === 'reasoning')?.text
  }, [message])

  return (
    <main className='relative flex flex-1 flex-col'>
      <div className='relative flex flex-1 flex-col items-center'>
        <h1 className='mt-10 text-center text-2xl font-bold'>
          <Trans>DeepSeek AI Fortune Teller</Trans>
        </h1>

        {reasoning && (
          <div className='mx-auto w-[600px] max-w-full px-3 pt-8'>
            <RippleButton
              size='sm'
              onClick={() => setIsShowThinking(!isShowThinking)}
            >
              {!message?.parts.find((i) => i.type === 'reasoning')?.text && (
                <LoaderCircleIcon className='animate-spin' />
              )}
              Thinking
            </RippleButton>
            {isShowThinking && (
              <div
                className={cn(
                  'prose bg-muted dark:prose-invert mt-2 rounded-md p-2',
                )}
              >
                <Markdown>{reasoning}</Markdown>
              </div>
            )}
          </div>
        )}

        <div className='mx-auto w-[600px] max-w-full px-3 pt-4 pb-8'>
          <article className='prose dark:prose-invert'>
            <Markdown>
              {message?.parts.find((i) => i.type === 'text')?.text}
            </Markdown>
          </article>
        </div>
      </div>

      <div className='sticky bottom-12 mb-8'>
        <Skeleton
          isLoaded={isHydrated}
          className='relative mx-auto flex w-fit gap-1'
        >
          <div className='flex w-full items-center justify-center gap-x-2 md:w-auto'>
            <Select
              value={gender}
              onValueChange={(value) => setGender(value as '0' | '1')}
            >
              <SelectTrigger className='bg-background'>
                <SelectValue placeholder='Select your gender'>
                  {gender === '0' ? (
                    <MaterialSymbolsFemale className='size-4 shrink-0' />
                  ) : (
                    <MaterialSymbolsMaleRounded className='size-4 shrink-0' />
                  )}
                  {gender === '0' ? t`female` : t`male`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>
                  <Trans>Female</Trans>
                </SelectItem>
                <SelectItem value='1'>
                  <Trans>Male</Trans>
                </SelectItem>
              </SelectContent>
            </Select>

            <DateTimePicker
              value={localBirthday}
              max={new Date()}
              onChange={(e) => setBirthday(e?.toISOString() ?? '')}
            />
          </div>

          <div className='flex w-full items-center justify-center gap-x-2 md:w-auto'>
            <div className='bg-background flex-1'>
              <RippleButton
                size='sm'
                className='w-full md:w-auto'
                disabled={status !== 'ready'}
                color='primary'
                onClick={() => handleSubmit()}
              >
                {status === 'submitted' && (
                  <Loader2Icon className='animate-spin' />
                )}
                <Trans>Submit</Trans>
              </RippleButton>
            </div>

            <CopyButton
              className='size-9'
              disabled={!message || status !== 'ready'}
              content={message?.parts.find((i) => i.type === 'text')?.text}
            />
          </div>
          {!isHydrated && <div className='absolute inset-0 bg-gray-200' />}
        </Skeleton>
      </div>
    </main>
  )
}
