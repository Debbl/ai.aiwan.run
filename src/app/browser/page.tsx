export default function Page() {
  return (
    <main className='relative flex flex-1 flex-col items-center justify-center md:p-12'>
      <h1>The AI application running in your browser</h1>

      <div className='mt-12 flex flex-col gap-y-2'>
        <Link className='hover:text-blue-400' href='/browser/object-detector'>
          Object Detector
        </Link>
        <Link className='hover:text-blue-400' href='/browser/segment-anything'>
          Segment Anything
        </Link>
      </div>
    </main>
  )
}
