export const linguiConfig = {
  sourceLocale: 'en',
  locales: ['en', 'zh'],
} as const

export type SupportedLocales = (typeof linguiConfig.locales)[number]
