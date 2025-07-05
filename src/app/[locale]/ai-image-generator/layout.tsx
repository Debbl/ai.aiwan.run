import { msg } from '@lingui/core/macro'
import { generateMetadataWithI18n } from '~/i18n'
import { DefaultLayout } from '../../_components/default-layout'
import type { Metadata } from 'next'
import type { PageLocaleParam } from '~/i18n'

export const generateMetadata = async ({
  params,
}: PageLocaleParam): Promise<Metadata> => {
  const i18n = await generateMetadataWithI18n(params)

  return {
    title: i18n._(msg`AI Image Generator`),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>
}
