import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
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
