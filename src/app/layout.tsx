import type { Metadata, Viewport } from 'next'
import './globals.css'
import { UtmTracker } from '@/components/layout/UtmTracker'

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark'
}

export const metadata: Metadata = {
  title: 'Arkalon Network',
  description: 'The Arkalon application ecosystem.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/brand/arkalon-icon-32.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml'
      },
      {
        url: '/brand/arkalon-emblem-mono-white.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml'
      }
    ],
    apple: '/brand/arkalon-app-icon.svg'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Arkalon Network'
  }
}
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative">
        <div className="metallic-sheen" aria-hidden="true" />
        <UtmTracker />
        {children}
      </body>
    </html>
  )
}
