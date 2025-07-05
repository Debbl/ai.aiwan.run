import { BASE_URL } from '~/constants'
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function Layout({ children }: PropsWithChildren) {
  return children
}
