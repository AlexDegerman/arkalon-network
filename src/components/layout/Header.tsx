'use client'

import { useEffect, useRef } from 'react'
import { Settings } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { validateSessionAction } from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'

export function Header() {
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)
  const bootstrapped = useRef(false)

  // Auto-creates identity on first visit
  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    async function ensureIdentity() {
      try {
        const session = await validateSessionAction()
        if (!session.valid) {
          await createCoreIdentityAction()
        }
      } catch (err) {
        console.error('[Header] Auto-provisioning failed:', err)
      }
    }

    ensureIdentity()
  }, [])

  return (
    <>
      <header className="w-full mb-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-[1.375rem] min-[390px]:text-[1.5rem] sm:text-[1.75rem] font-black leading-tight tracking-wide select-none whitespace-nowrap">
            <span className="g-dqgs">ARKALON NETWORK</span>
          </h1>

          <button
            type="button"
            onClick={() => setSettingsPanelOpen(true)}
            aria-label="Open settings"
            className="p-2 rounded-md transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
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
        <p
          className="mt-0.5 text-[0.8125rem] sm:text-[0.875rem] tracking-wide"
          style={{ color: 'var(--text-secondary)' }}
        >
          The Arkalon application ecosystem.
        </p>
      </header>

      <SettingsPanel />
    </>
  )
}
