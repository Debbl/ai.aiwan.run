import { DefaultLayout } from '../_components/default-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Fortune Teller',
  description: 'AI Fortune Teller',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>
}
