import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
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
