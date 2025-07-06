'use client'
import { useHydrated } from '@debbl/ahooks'
import { useLingui } from '@lingui/react'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiBluesky, SiGithub, SiX } from 'react-icons/si'
import { cn } from 'twl'
import { MoonIcon, SettingsGearIcon, SunIcon } from '~/components/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { usePathname } from '~/hooks/usePathname'
import { Separator } from '../../../../components/ui/separator'
import type { Locale } from '~/i18n/config'

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { isHydrated } = useHydrated()

  if (!isHydrated) return <div />

  return (
    <div>
      <div className='flex items-center rounded-3xl border p-1'>
        <button
          type='button'
          className={cn(
            'cursor-pointer rounded-full p-2',
            theme === 'system' && 'bg-secondary',
          )}
          onClick={() => setTheme('system')}
        >
          <SettingsGearIcon className='size-4' />
          <span className='sr-only'>
            id-system-{isHydrated ? 'hydrated' : 'not-hydrated'}
          </span>
        </button>
        <button
          type='button'
          className={cn(
            'cursor-pointer rounded-full p-2',
            theme === 'light' && 'bg-secondary',
          )}
          onClick={() => setTheme('light')}
        >
          <SunIcon className='size-4' />
          <span className='sr-only'>light</span>
        </button>
        <button
          type='button'
          className={cn(
            'cursor-pointer rounded-full p-2',
            theme === 'dark' && 'bg-secondary',
          )}
          onClick={() => setTheme('dark')}
        >
          <MoonIcon className='size-4' />
          <span className='sr-only'>dark</span>
        </button>
      </div>
    </div>
  )
}

function LocaleSwitcher() {
  const { i18n } = useLingui()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (locale: Locale) => {
    if (locale === 'en') {
      router.replace(pathname)
    } else {
      router.replace(`/${locale}${pathname}`)
    }
  }

  return (
    <Select value={i18n.locale} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select a locale' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='en'>
          <Link href='/'>
            <Trans>English</Trans>
          </Link>
        </SelectItem>
        <SelectItem value='zh'>
          <Link href='/zh'>
            <Trans>Chinese</Trans>
          </Link>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export function Footer() {
  return (
    <footer className='border-border flex items-center justify-between border-t px-8 py-16 text-center text-sm'>
      <div className='flex h-5 items-center space-x-4 text-sm'>
        <Link
          href='https://github.com/Debbl'
          target='_blank'
          rel='noopener noreferrer'
        >
          <SiGithub className='size-4' />
          <span className='sr-only'>Github</span>
        </Link>
        <Separator orientation='vertical' />
        <Link
          href='https://x.com/Debbl66'
          target='_blank'
          rel='noopener noreferrer'
        >
          <SiX className='size-4' />
          <span className='sr-only'>X</span>
        </Link>
        <Separator orientation='vertical' />
        <Link
          href='https://bsky.app/profile/debbl.bsky.social'
          target='_blank'
          rel='noopener noreferrer'
        >
          <SiBluesky className='size-4' />
          <span className='sr-only'>Bluesky</span>
        </Link>
      </div>
      <p>
        <Link
          href='https://aiwan.run'
          target='_blank'
          rel='noopener noreferrer'
        >
          aiwan.run
        </Link>
      </p>
      <div className='flex items-center space-x-4'>
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
