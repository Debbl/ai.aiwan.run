import { msg } from '@lingui/core/macro'
import { generateMetadataWithI18n } from '~/i18n'
import type { Metadata } from 'next'
import type { SupportedLocales } from '~/i18n/config'

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: SupportedLocales }>
}): Promise<Metadata> => {
  const i18n = await generateMetadataWithI18n(params)

  return {
    title: i18n._(msg`Segment Anything`),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
