'use client'
import Image from 'next/image'
import { Avatar } from '~/components/avatar'
import { Button } from '~/components/ui/button'
import { authClient } from '~/lib/auth-client'

export function Header() {
  const { data } = authClient.useSession()
  return (
    <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-2'>
      <Link href='/'>
        <Image src='/favicon.svg' alt='logo' width={24} height={24} />
      </Link>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Link href='/browser'>
            <Button variant='link'>Browser</Button>
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          {data?.user.name ? (
            <Avatar size={32} rounded={16} username={data.user.name} />
          ) : (
            <Link href='/login'>
              <Button variant='link'>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
