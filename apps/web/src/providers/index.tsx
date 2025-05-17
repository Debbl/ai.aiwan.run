import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <LazyMotion features={domMax} strict>
        {children}
      </LazyMotion>
    </ThemeProvider>
  )
}
