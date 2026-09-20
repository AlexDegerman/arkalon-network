import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-6 min-h-dvh flex flex-col justify-start">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider border transition-colors hover:bg-(--bg-surface-hover)"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>HUB</span>
        </Link>

        <h1 className="text-sm font-black tracking-wider text-text-primary">
          ARKALON SETTINGS
        </h1>

        <div className="w-14" aria-hidden="true" />
      </div>

      <Suspense
        fallback={
          <div className="text-xs text-text-muted">Loading settings...</div>
        }
      >
        <SettingsPanel forceOpen />
      </Suspense>
    </main>
  )
}
