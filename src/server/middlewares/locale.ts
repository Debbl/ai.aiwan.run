import { setI18n } from '@lingui/react/server'
import { os } from '@orpc/server'
import { X_NEXT_LOCALE } from '~/constants'
import { getI18nInstance } from '~/i18n'

export const requiredLocaleMiddleware = os
  .$context<{ headers: Headers }>()
  .middleware(async ({ context, next }) => {
    const headers = context.headers
    const locale = (headers.get(X_NEXT_LOCALE) ?? 'en') as 'en' | 'zh'

    const i18n = await getI18nInstance(locale)
    setI18n(i18n)

    return next({
      context: {
        locale,
        i18n,
      },
    })
  })
