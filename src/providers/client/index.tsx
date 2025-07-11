'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SWRConfig } from 'swr'
import { LinguiProvider } from './lingui-provider'
import type { LinguiProviderProps } from './lingui-provider'

const queryClient = new QueryClient()

export interface ProvidersClientProps extends LinguiProviderProps {
  children: React.ReactNode
}

export function ProvidersClient({
  children,
  ...linguiProviderProps
}: ProvidersClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}
