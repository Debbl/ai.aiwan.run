import { msg } from '@lingui/core/macro'
import { generateMetadataWithI18n } from '~/i18n'
import type { SupportedLocales } from '~/i18n/config'

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: SupportedLocales }>
}) => {
  const i18n = await generateMetadataWithI18n(params)

  return {
    title: i18n._(msg`Object Detector`),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
