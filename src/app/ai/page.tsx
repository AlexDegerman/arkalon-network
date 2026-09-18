import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ArkalonOracle } from '@/components/ai/ArkalonOracle'

export default function AIPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-3 sm:px-4 pt-3 pb-6 sm:py-5 min-h-dvh flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider transition-colors duration-150 hover:bg-(--bg-surface-hover) cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>HUB</span>
        </Link>

        <h1 className="text-sm sm:text-base font-black tracking-wider title-ai">
          ARKALON AI
        </h1>

        {/* Keeps title centered by balancing the navigation button width */}
        <div className="w-14 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex-1 flex flex-col min-h-0 justify-start">
        <ArkalonOracle />
      </div>
    </main>
  )
}
