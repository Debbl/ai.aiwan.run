import { useLingui } from '@lingui/react'
import NextLink from 'next/link'
import { linguiConfig } from '~/i18n/config'
import type { ComponentProps } from 'react'

export function Link(props: ComponentProps<typeof NextLink>) {
  const { i18n } = useLingui()
  const locale = i18n.locale
  const href =
    locale === linguiConfig.sourceLocale
      ? props.href
      : `/${locale}${props.href}`

  return <NextLink {...props} href={href} />
}
