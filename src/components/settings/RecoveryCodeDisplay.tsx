'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type Props = {
  code: string
}

export function RecoveryCodeDisplay({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable - user can copy manually
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-[0.8125rem] leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        Save your recovery code. It is shown once and cannot be retrieved
        without a validated session.
      </p>

      <div
        className="flex items-center justify-between gap-3 rounded-md px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-active)'
        }}
      >
        <span
          className="text-[0.875rem] font-semibold tracking-widest select-all"
          style={{
            color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace",
            wordBreak: 'break-all'
          }}
        >
          {code}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy recovery code'}
          className="shrink-0 p-1.5 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={
            {
              color: copied ? 'var(--status-online)' : 'var(--text-muted)',
              '--tw-outline-color': 'var(--accent-network)'
            } as React.CSSProperties
          }
        >
          {copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      <p className="text-[0.75rem]" style={{ color: 'var(--text-muted)' }}>
        Format: WORD-WORD-DIGITS
      </p>
    </div>
  )
}
