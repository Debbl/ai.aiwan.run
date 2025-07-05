'use client'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'

export function ProvidersClient({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError(err) {
          toast.error(err.message)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
