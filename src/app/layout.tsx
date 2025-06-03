import { ViewTransitions } from 'next-view-transitions'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { Providers } from '../providers'
import './styles/index.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The client first ai apps',
  description: 'A collection of client first ai apps',
  appleWebApp: {
    title: 'The client first ai apps',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <html lang='en' suppressHydrationWarning>
        <head>
          <script
            defer
            src='https://umami.aiwan.run/script.js'
            data-website-id='4cb87172-a3d4-4c22-8787-056e690d0b5a'
            data-domains='ai.aiwan.run'
          />
        </head>
        <body>
          <Providers>
            <Toaster richColors />
            <Suspense>{children}</Suspense>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
