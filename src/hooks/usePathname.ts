import { usePathname as useNextPathname } from 'next/navigation'
import { linguiConfig } from '~/i18n/config'

export function usePathname() {
  const pathname = useNextPathname()

  const pathnameHasLocale = linguiConfig.locales.some((locale) =>
    pathname.startsWith(`/${locale}`),
  )

  return pathnameHasLocale
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname
}
