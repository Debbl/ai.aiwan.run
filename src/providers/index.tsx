import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ProvidersClient } from './index.client'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <LazyMotion features={domMax} strict>
        <NuqsAdapter>
          <ProvidersClient>{children}</ProvidersClient>
        </NuqsAdapter>
      </LazyMotion>
    </ThemeProvider>
  )
}
