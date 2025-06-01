import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SWRConfig } from 'swr'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <LazyMotion features={domMax} strict>
        <NuqsAdapter>
          <SWRConfig>{children}</SWRConfig>
        </NuqsAdapter>
      </LazyMotion>
    </ThemeProvider>
  )
}
