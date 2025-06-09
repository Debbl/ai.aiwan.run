import { DefaultLayout } from '../_components/default-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ghibli AI | Free Magical Ghibli Image Generator',
  description:
    'Create Your Own Ghibli-Style Art: Free AI Ghibli Generator, Transform your ideas into magical Ghibli-style artwork with our free AI generator. No artistic skills needed! Create stunning characters, scenes, and landscapes inspired by Studio Ghibli. Try it now!',
  keywords: [
    'AI Ghibli Generator',
    'Ghibli-Style Art',
    'Free Ghibli Art Generator',
    'how to make ghibli art with ai',
  ],
  openGraph: {
    title: 'Ghibli AI - Free Magical Ghibli Image Generator',
    description:
      'Transform photos to authentic Studio Ghibli art with our AI-powered ghibli image generator. Create stunning Miyazaki-style characters and scenes instantly.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>
}
