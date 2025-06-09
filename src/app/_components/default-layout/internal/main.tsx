import type { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
  return <div className='relative flex flex-1'>{children}</div>
}
