import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center md:p-12'>
      <h1 className='text-3xl font-bold'>The client first AI apps</h1>

      <div className='mt-12 flex flex-col gap-y-2'>
        <Link className='hover:text-blue-400' href='/object-detector'>
          Object Detector
        </Link>
        <Link className='hover:text-blue-400' href='/segment-anything'>
          Segment Anything
        </Link>
        <Link className='hover:text-blue-400' href='/ai-fortune-teller'>
          AI Fortune Teller
        </Link>
        <Link className='hover:text-blue-400' href='/ai-ghibli-generator'>
          AI Ghibli Generator
        </Link>
      </div>
    </main>
  )
}
