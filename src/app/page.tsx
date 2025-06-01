'use client'
import { Button } from '~/components/ui/button'
import { DefaultLayout } from './_components/default-layout'

const DEV = true

export default function Home() {
  const handleTest = async () => {
    await api.test({
      body: {
        name: 'test',
      },
    })
  }

  return (
    <DefaultLayout>
      <main className='flex flex-1 flex-col items-center justify-center md:p-12'>
        <h1 className='text-3xl font-bold'>AI Apps</h1>

        <div className='mt-12 flex flex-col gap-y-2'>
          <Link className='hover:text-blue-400' href='/ai-fortune-teller'>
            AI Fortune Teller
          </Link>
          <Link className='hover:text-blue-400' href='/ai-ghibli-generator'>
            AI Ghibli Generator
          </Link>
          {/* <Link className='hover:text-blue-400' href='/ai-image-generator'>
            AI Image Generator
          </Link> */}

          {DEV && <Button onClick={handleTest}>Test</Button>}
        </div>
      </main>
    </DefaultLayout>
  )
}
