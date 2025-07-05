import linguiConfig from '../../lingui.config'
import type { Messages } from '@lingui/core'
import type { SupportedLocales } from './config'

export const { locales, sourceLocale } = linguiConfig

export async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages
}> {
  const { messages } = await import(`../locales/${locale}/messages.po`)
  return {
    [locale]: messages,
  }
}
