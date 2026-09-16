import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arkalon Network',
  description: 'The Arkalon application ecosystem.'
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
        {children}
      </body>
    </html>
  )
}
