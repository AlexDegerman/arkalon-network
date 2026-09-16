'use client'

import { Settings } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

export function Header() {
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)

  return (
    <>
      <header className="w-full mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-[1.75rem] font-bold leading-tight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              ARKALON NETWORK
            </h1>
            <p
              className="mt-1 text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              The Arkalon application ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSettingsPanelOpen(true)}
            aria-label="Open settings"
            className="mt-1 p-2 rounded-md transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={
              {
                color: 'var(--text-muted)',
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                'var(--text-primary)'
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--bg-surface)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                'var(--text-muted)'
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                'transparent'
            }}
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <SettingsPanel />
    </>
  )
}
