import { Suspense } from 'react'
import { DefaultLayout } from '../_components/default-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </DefaultLayout>
  )
}
