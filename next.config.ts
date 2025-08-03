import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bundleAnalyzer from '@next/bundle-analyzer'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import withSerwistInit from '@serwist/next'
import AutoImport from 'unplugin-auto-import/webpack'
import { env } from './src/env'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const withBundleAnalyzer = bundleAnalyzer({
  enabled: env.ANALYZE,
})

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
})

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/en',
      },
    ]
  },
  poweredByHeader: false,
  webpack: (config) => {
    // https://github.com/huggingface/transformers.js/issues/1026#issuecomment-2490410996
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
      '@huggingface/transformers': path.resolve(
        __dirname,
        'node_modules/@huggingface/transformers',
      ),
    }

    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: '@lingui/loader',
      },
    })

    config.plugins.push(
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        ],
        imports: [
          'react',
          {
            twl: ['cn'],
          },
          {
            from: 'motion/react-m',
            imports: [['*', 'motion']],
          },
          {
            from: '~/lib/orpc',
            imports: ['orpc'],
          },
          {
            from: '@tanstack/react-query',
            imports: ['useQuery', 'useMutation'],
          },
          {
            from: '~/components/link',
            imports: ['Link'],
          },
        ],
        dts: true,
      }),
    )

    return config
  },
}

export default [withBundleAnalyzer, withSerwist].reduce(
  (acc, fn) => fn(acc),
  nextConfig,
)
