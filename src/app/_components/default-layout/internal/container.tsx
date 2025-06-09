import type { PropsWithChildren } from 'react'

export function Container({ children }: PropsWithChildren) {
  return <div className='flex min-h-screen flex-col'>{children}</div>
}
