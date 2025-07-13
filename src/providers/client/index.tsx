'use client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { LinguiProvider } from './lingui-provider'
import type { LinguiProviderProps } from './lingui-provider'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      toast.error(err.message)
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      toast.error(err.message)
    },
  }),
})

export interface ProvidersClientProps extends LinguiProviderProps {
  children: React.ReactNode
}

export function ProvidersClient({
  children,
  ...linguiProviderProps
}: ProvidersClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LinguiProvider {...linguiProviderProps}>{children}</LinguiProvider>
    </QueryClientProvider>
  )
}
