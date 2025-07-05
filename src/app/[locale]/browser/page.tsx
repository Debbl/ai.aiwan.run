'use client'
import { Trans } from '@lingui/react/macro'

export default function Page() {
  return (
    <main className='relative flex flex-1 flex-col items-center justify-center md:p-12'>
      <h1>
        <Trans>The AI application running in your browser</Trans>
      </h1>

      <div className='mt-12 flex flex-col gap-y-2'>
        <Link className='hover:text-blue-400' href='/browser/object-detector'>
          <Trans>Object Detector</Trans>
        </Link>
        <Link className='hover:text-blue-400' href='/browser/segment-anything'>
          <Trans>Segment Anything</Trans>
        </Link>
      </div>
    </main>
  )
}
