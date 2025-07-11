'use client'
import { Trans } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { DefaultLayout } from '../_components/default-layout'

const DEV = true

export default function Home() {
  const { mutateAsync } = useMutation(orpc.test.mutationOptions())

  const handleTest = async () => {
    await mutateAsync({
      name: 'test',
    })
  }

  return (
    <DefaultLayout>
      <main className='flex flex-1 flex-col items-center justify-center md:p-12'>
        <h1 className='text-3xl font-bold'>
          <Trans>AI Apps</Trans>
        </h1>

        <div className='mt-12 flex flex-col gap-y-2'>
          <Link className='hover:text-blue-400' href='/ai-fortune-teller'>
            <Trans>AI Fortune Teller</Trans>
          </Link>
          <Link className='hover:text-blue-400' href='/ai-ghibli-generator'>
            <Trans>AI Ghibli Generator</Trans>
          </Link>
          <Link className='hover:text-blue-400' href='/ai-image-generator'>
            <Trans>AI Image Generator</Trans>
          </Link>

          {DEV && (
            <Button onClick={handleTest}>
              <Trans>Test</Trans>
            </Button>
          )}
        </div>
      </main>
    </DefaultLayout>
  )
}
