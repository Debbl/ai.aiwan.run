import { Footer } from './footer'
import { Header } from './header'

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className='relative min-h-screen'>{children}</div>
      <Footer />
    </>
  )
}
