import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bundleAnalyzer from '@next/bundle-analyzer'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import withSerwistInit from '@serwist/next'
import { ANALYZE } from '@workspace/env'
import AutoImport from 'unplugin-auto-import/webpack'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const withBundleAnalyzer = bundleAnalyzer({
  enabled: ANALYZE === 'true',
})

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
})

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // https://github.com/huggingface/transformers.js/issues/1026#issuecomment-2490410996
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
      '@huggingface/transformers': path.resolve(__dirname, 'node_modules/@huggingface/transformers'),
    }

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
            from: '~/api',
            imports: ['api'],
          },
        ],
        dts: true,
      }),
    )

    return config
  },
}

export default [withBundleAnalyzer, withSerwist].reduce((acc, fn) => fn(acc), nextConfig)
