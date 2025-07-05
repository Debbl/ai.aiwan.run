import { setI18n } from '@lingui/react/server'
import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { getI18nInstance } from '~/i18n'
import { ProvidersClient } from './client'
import type { SupportedLocales } from '~/i18n/config'

export async function Providers({
  children,
  lang,
}: {
  children: React.ReactNode
  lang: SupportedLocales
}) {
  const i18n = await getI18nInstance(lang)
  setI18n(i18n)

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <LazyMotion features={domMax} strict>
        <NuqsAdapter>
          <ProvidersClient
            initialLocale={i18n.locale}
            initialMessages={i18n.messages}
          >
            {children}
          </ProvidersClient>
        </NuqsAdapter>
      </LazyMotion>
    </ThemeProvider>
  )
}
