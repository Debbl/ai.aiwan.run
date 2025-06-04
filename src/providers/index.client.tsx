'use client'
import { SWRConfig } from 'swr'

export function ProvidersClient({ children }: { children: React.ReactNode }) {
  return <SWRConfig>{children}</SWRConfig>
}
