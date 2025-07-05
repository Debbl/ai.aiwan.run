import { msg } from '@lingui/core/macro'
import { ViewTransitions } from 'next-view-transitions'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { generateMetadataWithI18n } from '~/i18n'
import { linguiConfig } from '~/i18n/config'
import { Providers } from '~/providers'
import '../styles/index.css'
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import type { PageLocaleParam } from '~/i18n'
import type { Locale } from '~/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const i18n = await generateMetadataWithI18n(params)

  return {
    title: i18n._(msg`The client first ai apps`),
    description: i18n._(msg`A collection of client first ai apps`),
    appleWebApp: {
      title: i18n._(msg`The client first ai apps`),
    },
    keywords: [
      i18n._(msg`ai`),
      i18n._(msg`ai apps collection`),
      i18n._(msg`studio ghibli style anime generator`),
      i18n._(msg`browser ai apps`),
    ],
    icons: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
      },
      {
        rel: 'shortcut icon',
        url: '/favicon.ico',
      },
      {
        rel: 'app-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
    ],
  }
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<PageLocaleParam>) {
  const { locale } = await params

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <script
            defer
            src='https://umami.aiwan.run/script.js'
            data-website-id='4cb87172-a3d4-4c22-8787-056e690d0b5a'
            data-domains='ai.aiwan.run'
          />
        </head>
        <body>
          <Providers lang={locale}>
            <Toaster richColors />
            <Suspense>{children}</Suspense>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
