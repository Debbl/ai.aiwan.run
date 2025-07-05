'use client'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'
import { LinguiProvider } from './lingui-provider'
import type { LinguiProviderProps } from './lingui-provider'

export interface ProvidersClientProps extends LinguiProviderProps {
  children: React.ReactNode
}

export function ProvidersClient({
  children,
  ...linguiProviderProps
}: ProvidersClientProps) {
  return (
    <LinguiProvider {...linguiProviderProps}>
      <SWRConfig
        value={{
          onError(err) {
            toast.error(err.message)
          },
        }}
      >
        {children}
      </SWRConfig>
    </LinguiProvider>
  )
}
