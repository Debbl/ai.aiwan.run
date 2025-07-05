import { msg } from '@lingui/core/macro'
import { generateMetadataWithI18n } from '~/i18n'
import { DefaultLayout } from '../../_components/default-layout/index'
import { SEO } from './seo'
import type { Metadata } from 'next'
import type { SupportedLocales } from '~/i18n/config'

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: SupportedLocales }>
}): Promise<Metadata> => {
  const i18n = await generateMetadataWithI18n(params)

  return {
    title: i18n._(msg`Ghibli AI | Free Magical Ghibli Image Generator`),
    description: i18n._(
      msg`Create Your Own Ghibli-Style Art: Free AI Ghibli Generator, Transform your ideas into magical Ghibli-style artwork with our free AI generator. No artistic skills needed! Create stunning characters, scenes, and landscapes inspired by Studio Ghibli. Try it now!`,
    ),
    keywords: [
      i18n._(msg`AI Ghibli Generator`),
      i18n._(msg`Ghibli-Style Art`),
      i18n._(msg`Free Ghibli Art Generator`),
      i18n._(msg`how to make ghibli art with ai`),
    ],
    openGraph: {
      title: i18n._(msg`Ghibli AI - Free Magical Ghibli Image Generator`),
      description: i18n._(
        msg`Transform photos to authentic Studio Ghibli art with our AI-powered ghibli image generator. Create stunning Miyazaki-style characters and scenes instantly.`,
      ),
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout.Root>
      <DefaultLayout.Container>
        <DefaultLayout.Header />
        {children}
      </DefaultLayout.Container>

      <SEO />

      <DefaultLayout.Footer />
    </DefaultLayout.Root>
  )
}
