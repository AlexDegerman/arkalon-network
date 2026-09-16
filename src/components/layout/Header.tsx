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
            <h1 className="text-[1.75rem] font-black leading-tight tracking-wide select-none">
              <span className="g-dqgs">ARKALON NETWORK</span>
            </h1>
            <p
              className="mt-1 text-base tracking-wide"
              style={{ color: 'var(--text-secondary)' }}
            >
              The Arkalon application ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSettingsPanelOpen(true)}
            aria-label="Open settings"
            className="mt-1 p-2 rounded-md transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-(--text-primary) hover:bg-(--bg-surface)"
            style={
              {
                color: 'var(--text-muted)',
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <SettingsPanel />
    </>
  )
}
