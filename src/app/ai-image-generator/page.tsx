'use client'
import useSWR from 'swr'
import { useSession } from '~/lib/auth-client'
import { AIChatInput } from './components/ai-chat-input'

export default function Page() {
  const { data: session } = useSession()
  const { data } = useSWR(session?.user.id ? ['/api/getImageList', { userId: session.user.id }] : null, () => {
    return api.getImageList({ query: { userId: session!.user.id } })
  })

  // eslint-disable-next-line no-console
  console.log('🚀 ~ Page ~ data:', data)

  return (
    <div className='relative flex flex-1 flex-col'>
      <div className='h-[999px]'>aa</div>
      <AIChatInput />
    </div>
  )
}
