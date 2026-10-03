import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb'
    }
  },
  outputFileTracingIncludes: {
    '/**': ['./node_modules/geoip-lite/data/**']
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/brand/arkalon-icon-32.svg'
      }
    ]
  }
}

export default nextConfig