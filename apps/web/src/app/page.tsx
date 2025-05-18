import { DefaultLayout } from './_components/default-layout'

export default function Home() {
  return (
    <DefaultLayout>
      <main className='flex min-h-screen flex-col items-center justify-center md:p-12'>
        <h1 className='text-3xl font-bold'>AI Apps</h1>

        <div className='mt-12 flex flex-col gap-y-2'>
          <Link className='hover:text-blue-400' href='/ai-fortune-teller'>
            AI Fortune Teller
          </Link>
          <Link className='hover:text-blue-400' href='/ai-ghibli-generator'>
            AI Ghibli Generator
          </Link>
          <Link className='hover:text-blue-400' href='/ai-image-generator'>
            AI Image Generator
          </Link>
        </div>
      </main>
    </DefaultLayout>
  )
}
