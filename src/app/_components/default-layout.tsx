import React from 'react'
import { Footer } from './default-layout/internal/footer'
import { Header } from './default-layout/internal/header'

export function DefaultLayout({
  children,
  SEO,
}: {
  children: React.ReactNode
  SEO?: React.ReactNode
}) {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <div className='relative flex flex-1'>{children}</div>
      </div>
      {SEO}
      <Footer />
    </>
  )
}
