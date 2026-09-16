'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { RecoveryCodeDisplay } from './RecoveryCodeDisplay'
import { RecoveryCodeEntry } from './RecoveryCodeEntry'
import {
  validateSessionAction,
  getRecoveryCodeAction
} from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'

type PanelState =
  | { phase: 'loading' }
  | { phase: 'no_identity' }
  | { phase: 'created'; recoveryCode: string; displayId: string }
  | { phase: 'existing_unvalidated'; displayId: string }
  | { phase: 'existing_validated'; displayId: string }
  | { phase: 'error' }

export function SettingsPanel() {
  const settingsPanelOpen = useUiStore((s) => s.settingsPanelOpen)
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)

  const [panelState, setPanelState] = useState<PanelState>({ phase: 'loading' })
  const [activeTab, setActiveTab] = useState<'identity' | 'restore'>('identity')
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Bootstrap identity and session state when panel opens
  useEffect(() => {
    if (!settingsPanelOpen) return

    let cancelled = false

    const bootstrap = async () => {
      setPanelState({ phase: 'loading' })

      // Check for validated session first
      const sessionResult = await validateSessionAction()

      if (cancelled) return

      if (sessionResult.valid) {
        setPanelState({
          phase: 'existing_validated',
          displayId: sessionResult.displayId
        })
        return
      }

      // No validated session - try to create or detect existing identity
      const identityResult = await createCoreIdentityAction()

      if (cancelled) return

      if (identityResult.status === 'created') {
        // New identity - show recovery code once
        const session2 = await validateSessionAction()
        if (cancelled) return
        setPanelState({
          phase: 'created',
          recoveryCode: identityResult.recoveryCode,
          displayId: session2.valid ? session2.displayId : '--------'
        })
      } else if (identityResult.status === 'existing') {
        // Existing identity, no validated session
        // Get display ID from cookie via action
        const partial = await import('@/app/actions/createCoreIdentity')
        const displayId = await partial.getDisplayCoreId()
        if (cancelled) return
        setPanelState({
          phase: 'existing_unvalidated',
          displayId: displayId ?? '--------'
        })
      } else if (identityResult.status === 'rate_limited') {
        if (cancelled) return
        setPanelState({ phase: 'error' })
      } else {
        if (cancelled) return
        setPanelState({ phase: 'error' })
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [settingsPanelOpen])

  // Trap focus inside panel and close on Escape
  useEffect(() => {
    if (!settingsPanelOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsPanelOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [settingsPanelOpen, setSettingsPanelOpen])

  if (!settingsPanelOpen) return null

  const displayId =
    panelState.phase === 'created' ||
    panelState.phase === 'existing_unvalidated' ||
    panelState.phase === 'existing_validated'
      ? panelState.displayId
      : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        aria-hidden="true"
        onClick={() => setSettingsPanelOpen(false)}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-90 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          animation: 'fade-in 0.15s ease-out both'
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <h2
            className="text-[0.875rem] font-semibold tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            ARKALON CORE
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setSettingsPanelOpen(false)}
            aria-label="Close settings"
            className="p-1.5 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={
              {
                color: 'var(--text-muted)',
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex flex-col gap-5 px-5 py-5 overflow-y-auto flex-1">
          {/* Core ID display */}
          {displayId && (
            <div className="flex flex-col gap-1">
              <span
                className="text-[0.6875rem] font-semibold tracking-widest"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                CORE ID
              </span>
              <span
                className="text-[0.875rem] tracking-widest"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {displayId}...
              </span>
              <span
                className="text-[0.75rem]"
                style={{ color: 'var(--text-muted)' }}
              >
                Shared across all Arkalon apps on this network.
              </span>
            </div>
          )}

          {/* Loading state */}
          {panelState.phase === 'loading' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Loading identity...
            </p>
          )}

          {/* Error state */}
          {panelState.phase === 'error' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--status-maintenance)' }}
            >
              Could not load identity. Please try again.
            </p>
          )}

          {/* Tabs - identity / restore */}
          {(panelState.phase === 'created' ||
            panelState.phase === 'existing_unvalidated' ||
            panelState.phase === 'existing_validated') && (
            <>
              {/* Tab bar */}
              <div
                className="flex border-b"
                style={{ borderColor: 'var(--border-default)' }}
                role="tablist"
                aria-label="Settings sections"
              >
                {(['identity', 'restore'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 pb-2 text-[0.8125rem] font-semibold tracking-wide transition-colors duration-150 border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={
                      {
                        borderColor:
                          activeTab === tab
                            ? 'var(--accent-network)'
                            : 'transparent',
                        color:
                          activeTab === tab
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
                        '--tw-outline-color': 'var(--accent-network)'
                      } as React.CSSProperties
                    }
                  >
                    {tab === 'identity' ? 'RECOVERY CODE' : 'RESTORE'}
                  </button>
                ))}
              </div>

              {/* Identity tab */}
              {activeTab === 'identity' && (
                <div role="tabpanel">
                  {panelState.phase === 'created' && (
                    <RecoveryCodeDisplay code={panelState.recoveryCode} />
                  )}
                  {panelState.phase === 'existing_validated' && (
                    <p
                      className="text-[0.8125rem] leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Your recovery code was shown when your identity was
                      created. Use the code you saved to restore your identity
                      on a new device.
                    </p>
                  )}
                  {panelState.phase === 'existing_unvalidated' && (
                    <p
                      className="text-[0.8125rem] leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Your recovery code was shown once when your identity was
                      created. To restore your identity on another device,
                      switch to the Restore tab and enter your saved code.
                    </p>
                  )}
                </div>
              )}

              {/* Restore tab */}
              {activeTab === 'restore' && (
                <div role="tabpanel">
                  <RecoveryCodeEntry />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
