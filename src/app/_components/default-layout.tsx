import { Footer } from './footer'
import { Header } from './header'

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <div className='relative flex flex-1'>{children}</div>
      </div>
      <Footer />
    </>
  )
}
