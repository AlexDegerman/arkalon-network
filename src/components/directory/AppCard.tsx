'use client'

import { useState } from 'react'
import type { ArkalonApp } from '@/lib/registry/types'
import { StatusBadge } from './StatusBadge'
import { CTA_DISABLED } from '@/constants/status'
import { ChevronDown } from 'lucide-react'

type Props = {
  app: ArkalonApp
}

export function AppCard({ app }: Props) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded((prev) => !prev)

  const ctaDisabled = CTA_DISABLED[app.ctaLabel]

  return (
    <article
      className="w-full rounded-lg border transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: expanded ? 'var(--border-active)' : 'var(--border-default)'
      }}
    >
      {/* Card header - always visible, acts as toggle */}
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-controls={`card-body-${app.slug}`}
        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2"
        style={
          {
            '--tw-ring-color': 'var(--accent-network)'
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          ;(
            e.currentTarget.parentElement as HTMLElement
          ).style.backgroundColor = 'var(--bg-surface-hover)'
        }}
        onMouseLeave={(e) => {
          ;(
            e.currentTarget.parentElement as HTMLElement
          ).style.backgroundColor = 'var(--bg-surface)'
        }}
      >
        {/* Left: name + short description */}
        <span className="flex flex-col gap-0.5 min-w-0">
          <span
            className="text-[1.125rem] font-semibold leading-snug truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {app.name.toUpperCase()}
          </span>
          <span
            className="text-[0.875rem] leading-snug"
            style={{ color: 'var(--text-secondary)' }}
          >
            {app.shortDescription}
          </span>
        </span>

        {/* Right: status badge + chevron */}
        <span className="flex items-center gap-2 shrink-0 pt-0.5">
          <StatusBadge status={app.status} />
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200"
            style={{
              color: 'var(--text-muted)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div
          id={`card-body-${app.slug}`}
          className="px-4 pb-4 flex flex-col gap-3"
        >
          {/* Divider */}
          <hr
            className="border-0 border-t"
            style={{ borderColor: 'var(--border-default)' }}
          />

          {/* Extended description */}
          {app.extendedDescription && (
            <p
              className="text-[0.875rem] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {app.extendedDescription}
            </p>
          )}

          {/* Preview media slot - populated in Commit 2.1 */}

          {/* CTA button */}
          <div className="flex justify-center pt-1">
            <a
              href={ctaDisabled ? undefined : app.route}
              target={ctaDisabled ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-disabled={ctaDisabled}
              tabIndex={ctaDisabled ? -1 : undefined}
              className="inline-flex items-center justify-center px-6 py-2 rounded text-[0.875rem] font-semibold tracking-wider transition-colors"
              style={
                ctaDisabled
                  ? {
                      backgroundColor: 'var(--border-default)',
                      color: 'var(--text-muted)',
                      cursor: 'not-allowed',
                      pointerEvents: 'none'
                    }
                  : {
                      backgroundColor: 'var(--accent-network)',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }
              }
              onMouseEnter={(e) => {
                if (!ctaDisabled)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--accent-network-dim)'
              }}
              onMouseLeave={(e) => {
                if (!ctaDisabled)
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--accent-network)'
              }}
            >
              {app.ctaLabel}
            </a>
          </div>
        </div>
      )}
    </article>
  )
}
